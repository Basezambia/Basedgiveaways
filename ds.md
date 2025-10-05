Add the MiniApp SDK


npm

pnpm

yarn

Report incorrect code

Copy

Ask AI
npm install @farcaster/miniapp-sdk
2
Trigger App Display

Once your app has loaded, call sdk.actions.ready() to hide the loading splash screen and display your app.
Vanilla JS
React
app.js

Report incorrect code

Copy

Ask AI
import { sdk } from '@farcaster/miniapp-sdk';

// Once app is ready to be displayed
await sdk.actions.ready();
3
Host the Manifest

Create a file available at https://www.your-domain.com/.well-known/farcaster.json.
Vanilla JS
Next.js
Create a Next.js rouote to host your manifest file
app/.well-known/farcaster.json/route.ts

Report incorrect code

Copy

Ask AI
function withValidProperties(properties: Record<string, undefined | string | string[]>) {
return Object.fromEntries(
    Object.entries(properties).filter(([_, value]) => (Array.isArray(value) ? value.length > 0 : !!value))
);
}

export async function GET() {
const URL = process.env.NEXT_PUBLIC_URL as string;
return Response.json(paste_manifest_json_object_here); // see the next step for the manifest_json_object
}
4
Update the Manifest

Copy the example manifest below and add it to the file created in the previous step. Update each field in the miniapp.
For details on each field, see the field reference
​
Example Manifest
/.well-known/farcaster.json

Report incorrect code

Copy

Ask AI
{
  "accountAssociation": {  // these will be added in step 5
    "header": "",
    "payload": "",
    "signature": ""
  },
  "baseBuilder": {
    "allowedAddresses": [""] // add your Base Account address here
  },
  "miniapp": {
    "version": "1",
    "name": "Example Mini App",
    "homeUrl": "https://ex.co",
    "iconUrl": "https://ex.co/i.png",
    "splashImageUrl": "https://ex.co/l.png",
    "splashBackgroundColor": "#000000",
    "webhookUrl": "https://ex.co/api/webhook",
    "subtitle": "Fast, fun, social",
    "description": "A fast, fun way to challenge friends in real time.",
    "screenshotUrls": [
      "https://ex.co/s1.png",
      "https://ex.co/s2.png",
      "https://ex.co/s3.png"
    ],
    "primaryCategory": "social",
    "tags": ["example", "miniapp", "baseapp"],
    "heroImageUrl": "https://ex.co/og.png",
    "tagline": "Play instantly",
    "ogTitle": "Example Mini App",
    "ogDescription": "Challenge friends in real time.",
    "ogImageUrl": "https://ex.co/og.png",
    "noindex": true
  }
}
5
Create accountAssociation Credentials

The accountAssociation fields in the manifest are used to verify ownership of your app. You can generate these fields on Base Build.
Ensure all changes are live so that the Manifest file is available at your app’s url.
Navigate to the Base Build Account association tool.
Paste your domain in the App URL field (ex: sample-url.vercel.app) and click “Submit”
Click on the “Verify” button that appears and follow the instructions to generate the accountAssociation fields.
Copy the accountAssociation fields and paste them into the manifest file you added in the previous step.
/.well-known/farcaster.json

Report incorrect code

Copy

Ask AI
{
  "accountAssociation": {
    "header": "eyJmaWQiOjkxNTIsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHgwMmVmNzkwRGQ3OTkzQTM1ZkQ4NDdDMDUzRURkQUU5NDBEMDU1NTk2In0",
    "payload": "eyJkb21haW4iOiJhcHAuZXhhbXBsZS5jb20ifQ",
    "signature": "MHgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDIwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwNDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAyMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwYzAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMTIwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAxNzAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDEyNDdhNDhlZGJmMTMwZDU0MmIzMWQzZTg1ZDUyOTAwMmEwNDNkMjM5NjZiNWVjNTNmYjhlNzUzZmIyYzc1MWFmNTI4MWFiYTgxY2I5ZDE3NDAyY2YxMzQxOGI2MTcwYzFiODY3OTExZDkxN2UxMzU3MmVkMWIwYzNkYzEyM2Q1ODAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMjVmMTk4MDg2YjJkYjE3MjU2NzMxYmM0NTY2NzNiOTZiY2VmMjNmNTFkMWZiYWNkZDdjNDM3OWVmNjU0NjU1NzJmMWQwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwOGE3YjIyNzQ3OTcwNjUyMjNhMjI3NzY1NjI2MTc1NzQ2ODZlMmU2NzY1NzQyMjJjMjI2MzY4NjE2YzZjNjU2ZTY3NjUyMjNhMjI2NDJkMzQ0YjMzMzMzNjUyNDY3MDc0MzE0NTYxNjQ2Yjc1NTE0ODU3NDg2ZDc5Mzc1Mzc1Njk2YjQ0MzI0ZjM1NGE2MzRhNjM2YjVhNGM3NDUzMzczODIyMmMyMjZmNzI2OTY3Njk2ZTIyM2EyMjY4NzQ3NDcwNzMzYTJmMmY2YjY1Nzk3MzJlNjM2ZjY5NmU2MjYxNzM2NTJlNjM2ZjZkMjIyYzIyNjM3MjZmNzM3MzRmNzI2OTY3Njk2ZTIyM2E2NjYxNmM3MzY1N2QwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMA"
  },
  "miniapp": {...} // these fields remain the same
}
Note: Because you are signing with your Base Account, the signature field will be significantly longer than if you were to sign directly with your Farcaster custody wallet.
6
Add Embed Metadata

Update your index.html file to include the fc:miniapp metadata. This is used to generate the rich embeds when your app is shared and is required for your app to display.
Vanilla JS
Next.js
Use the generateMetadata function to add the fc:miniapp metadata.
app/layout.tsx

Report incorrect code

Copy

Ask AI
    export async function generateMetadata(): Promise<Metadata> {
    return {
        other: {
        'fc:miniapp': JSON.stringify({
            version: 'next',
            imageUrl: 'https://your-app.com/embed-image',
            button: {
                title: `Launch Your App Name`,
                action: {
                    type: 'launch_miniapp',
                    name: 'Your App Name',
                    url: 'https://your-app.com',
                    splashImageUrl: 'https://your-app.com/splash-image',
                    splashBackgroundColor: '#000000',
                },
            },
        }),
        },
    };
    }
7
Push to Production

Ensure all changes are live.
8
Preview Your App

Use the Base Build Preview tool to validate your app.
Add your app URL to view the embeds and click the launch button to verify the app launches as expected.
Use the “Account association” tab to verify the association credentials were created correctly.
Use the “Metadata” to see the metadata added from the manifest and identify any missing fields.