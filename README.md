# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


3️⃣ Power Automate – Detailed Explanation (Most Practical)
🎯 Goal

Automatically capture every reply from Outlook related to an issue and store it in one place so you can track:

Who said what

When they said it

Which team is delaying / denying ownership

🔹 How Power Automate Works Here
Step 1: Trigger

Trigger:

When a new email arrives (V3)

This listens to:

Inbox

Shared mailbox

Incident mailbox (recommended)

Step 2: Identify the Issue / Incident

You detect the issue using any one of these:

Option A – Subject Pattern (Best)
[INC-1023]
[EXC-445]


Power Automate condition:

Subject contains "INC-"

Option B – Keywords
incident
exception
sla breach
not from our side

Step 3: Extract Key Email Data

From each email, extract:

Field	Why it matters
Subject	Incident reference
From	Which team replied
Body	Actual comment
Received Time	SLA tracking
Conversation ID	Links all replies together

💡 Conversation ID is the backbone — all replies in a thread share it.

Step 4: Store in Central Tracking (Example: SharePoint List)

SharePoint List Columns

IncidentID (Text)
ConversationID (Text)
SenderTeam (Text)
Comment (Multiple lines)
ReceivedDate (DateTime)
Status (Choice)


Each email reply becomes one row.

Step 5: Auto-Update Status (Optional but Powerful)

Rules like:

If comment contains “shared logs” → Status = In Progress

If contains “not from our side” → Status = Ownership Conflict

If mail from resolver team → Status = Resolved

Step 6: Output

Now you have:

Full conversation history

SLA timestamps

Proof during audits



{
  "definition": {
    "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#",
    "contentVersion": "1.0.0.0",
    "triggers": {
      "When_a_new_email_arrives": {
        "type": "OpenApiConnection",
        "inputs": {
          "host": {
            "connection": {
              "name": "@parameters('$connections')['office365']['connectionId']"
            }
          },
          "method": "get",
          "path": "/v3/Mail/OnNewEmail",
          "queries": {
            "fetchOnlyUnread": true,
            "folderPath": "Inbox"
          }
        }
      }
    },
    "actions": {
      "Filter_Incident": {
        "type": "If",
        "expression": {
          "or": [
            {
              "contains": [
                "@triggerBody()?['subject']",
                "INC-"
              ]
            },
            {
              "contains": [
                "@triggerBody()?['subject']",
                "EXC-"
              ]
            }
          ]
        },
        "actions": {
          "Compose_IncidentID": {
            "type": "Compose",
            "inputs": "@first(match(triggerBody()?['subject'], 'INC-\\\\d+'))"
          },
          "Compose_Team": {
            "type": "Compose",
            "inputs": "@if(contains(triggerBody()?['from'], 'infra'), 'Infra', if(contains(triggerBody()?['from'], 'app'), 'App', 'Unknown'))"
          },
          "Compose_CleanBody": {
            "type": "Compose",
            "inputs": "@replace(triggerBody()?['bodyPreview'], '\\\\r\\\\n', ' ')"
          },
          "Compose_Status": {
            "type": "Compose",
            "inputs": "@if(contains(outputs('Compose_CleanBody'), 'not from our side'), 'Conflict', if(contains(outputs('Compose_CleanBody'), 'shared'), 'In Progress', 'Open'))"
          },
          "Create_SharePoint_Item": {
            "type": "OpenApiConnection",
            "inputs": {
              "host": {
                "connection": {
                  "name": "@parameters('$connections')['sharepoint']['connectionId']"
                }
              },
              "method": "post",
              "path": "/datasets/@{encodeURIComponent('https://YOUR_TENANT.sharepoint.com/sites/YOUR_SITE')}/tables/@{encodeURIComponent('IncidentTracking')}/items",
              "body": {
                "IncidentID": "@outputs('Compose_IncidentID')",
                "Team": "@outputs('Compose_Team')",
                "Comment": "@outputs('Compose_CleanBody')",
                "Date": "@triggerBody()?['receivedDateTime']",
                "Status": "@outputs('Compose_Status')",
                "ConversationID": "@triggerBody()?['conversationId']"
              }
            }
          }
        }
      }
    },
    "outputs": {},
    "parameters": {
      "$connections": {
        "type": "Object",
        "defaultValue": {}
      }
    }
  }
}

