# Gmail Label Automation Script

Also tired to label your emails one by one? This Node.js project allows you to authenticate with your Gmail account and automatically label emails from specific senders. It uses the Gmail API and OAuth 2.0 for secure access.

---

## Features

- Authenticate with your Gmail account.
- Search for emails from specific senders.
- Automatically apply a Gmail label to matching emails.
- Stores OAuth tokens locally for reuse.

---

## Prerequisites

1. **Node.js**: Ensure you have Node.js installed. You can download it [here](https://nodejs.org/).
2. **Gmail API Enabled**: 
   - Go to the [Google Cloud Console](https://console.cloud.google.com/).
   - Create a project or use an existing one.
   - Enable the **Gmail API** for the project.
   - Create **OAuth 2.0 Client Credentials** and download the `credentials.json` file.

---

## Setup

1. Clone this repository:
   ```bash
   git clone gmail-labeling
   cd gmail-labeling
   ```

2. Install dependencies:
    ```bash
   npm install
   ```

3. Add your credentials.json file:

    - Place the credentials.json file (downloaded from Google Cloud Console) in the project root.

4. Run the script for the first time to generate the OAuth token:
    ```bash
   node index.js
   ```

## Usage

1. Edit the list of senders and label name in the script:
   Open `index.js` and modify the `SENDERS` array and `LABEL_NAME` variable as needed:
   ```javascript
   const SENDERS = ["sender1@example.com"];
   const LABEL_NAME = "Important";
   ```