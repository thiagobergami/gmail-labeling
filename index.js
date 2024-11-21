const fs = require("fs");
const { google } = require("googleapis");

const SCOPES = ["https://www.googleapis.com/auth/gmail.modify"];
const TOKEN_PATH = "token.json"

async function authorize() {
    const credentials = JSON.parse(fs.readFileSync("credentials.json"))
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    if (fs.existsSync(TOKEN_PATH)) {
        const token = fs.readFileSync(TOKEN_PATH);
        oAuth2Client.setCredentials(JSON.parse(token));
        return oAuth2Client;
    } else {
        return getNewToken(oAuth2Client);
    }
}

function getNewToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
    });
    console.log("Authorize this app by visiting this url:", authUrl);

    const readline = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve, reject) => {
        readline.question("Enter the code from that page here: ", (code) => {
            readline.close();
            oAuth2Client.getToken(code, (err, token) => {
                if (err) {
                    console.error("Error retrieving access token", err);
                    reject(err);
                    return;
                }
                oAuth2Client.setCredentials(token);
                fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
                console.log("Token stored to", TOKEN_PATH);
                resolve(oAuth2Client);
            });
        });
    });
}
async function labelEmails(auth) {
    const gmail = google.gmail({ version: "v1", auth });
    const senders = ["sender1@example.com"];
    const labelName = "ToRead";

    const labelId = await getLabelId(gmail, labelName);

    if (!labelId) {
        console.error(`Label "${labelName}" does not exist.`);
        return;
    }

    for (const sender of senders) {
        console.log(`Searching for emails from: ${sender}`);
        const res = await gmail.users.messages.list({
            userId: "me",
            q: `from:${sender}`,
        });
        const messages = res.data.messages || [];

        if (messages.length === 0) {
            console.log(`No messages found from ${sender}.`);
            continue;
        }

        console.log(`Found ${messages.length} messages from ${sender}. Applying label...`);

        for (const message of messages) {
            await gmail.users.messages.modify({
                userId: "me",
                id: message.id,
                requestBody: {
                    addLabelIds: [labelId],
                },
            });
            console.log(`Labeled message ID: ${message.id}`);
        }
    }
}
async function getLabelId(gmail, labelName) {
    const res = await gmail.users.labels.list({ userId: "me" });
    const labels = res.data.labels || [];
    const label = labels.find((l) => l.name === labelName);

    return label ? label.id : null;
}


authorize()
    .then(labelEmails)
    .catch(console.error);