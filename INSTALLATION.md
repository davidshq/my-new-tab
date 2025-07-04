# Installation Guide

This guide will walk you through setting up the My New Tab Chrome extension with Google Calendar integration.

## Prerequisites

- Google Chrome browser
- A Google account with Google Calendar
- Basic familiarity with Google Cloud Console

## Step 1: Set Up Google Cloud Console

### 1.1 Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top and select "New Project"
3. Enter a project name (e.g., "My New Tab Extension")
4. Click "Create"

### 1.2 Enable Google Calendar API

1. In your new project, go to "APIs & Services" > "Library"
2. Search for "Google Calendar API"
3. Click on "Google Calendar API" in the results
4. Click "Enable"

### 1.3 Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. If prompted, configure the OAuth consent screen:
   - User Type: External
   - App name: "My New Tab"
   - User support email: Your email
   - Developer contact information: Your email
   - Save and continue through the other sections
4. Back in "Create OAuth 2.0 Client IDs":
   - Application type: Chrome Extension
   - Name: "My New Tab Extension"
   - **Leave the Application ID field empty for now** (we'll get this after loading the extension)
5. Click "Create"
6. **Copy the Client ID** - you'll need this in the next step

## Step 2: Install the Extension

### 2.1 Load the Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked"
4. Select the folder containing your extension files
5. The extension should now appear in your extensions list

### 2.2 Get the Extension ID

1. In the extensions page, find "My New Tab" in the list
2. Copy the extension ID (it's a long string of letters and numbers)
3. Go back to Google Cloud Console > "APIs & Services" > "Credentials"
4. Click on your OAuth 2.0 Client ID
5. In the "Application ID" field, paste your extension ID
6. Click "Save"

### 2.3 Update the Extension Configuration

1. Open `manifest.json` in your extension folder
2. Replace `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com` with your actual Client ID
3. Save the file
4. Go back to `chrome://extensions/`
5. Click the refresh icon on your extension to reload it

## Step 3: Authenticate with Google

### 3.1 Grant Calendar Access

1. Open a new tab in Chrome
2. You should see the new tab page with the calendar widget
3. The extension will prompt you to authenticate with Google
4. Click "Allow" to grant calendar access permissions
5. Your calendar events should now appear!

## Step 4: Customize Settings

### 4.1 Adjust Calendar Display

- Use the dropdown in the calendar widget to change how many days to display (7, 10, 14, 20, or 30 days)
- Click the refresh button to manually update the calendar
- Your settings will be automatically saved

### 4.2 Extension Popup

- Click the extension icon in your Chrome toolbar to see:
  - Connection status
  - Current settings
  - Extension information

## Troubleshooting

### "Authentication required" Error

1. Make sure you've completed the Google Cloud Console setup
2. Verify your Client ID is correct in `manifest.json`
3. Check that the Google Calendar API is enabled
4. Try refreshing the extension and opening a new tab

### No Events Showing

1. Ensure you have events in your Google Calendar
2. Check that you granted calendar access permissions
3. Try clicking the refresh button
4. Check the browser console for any error messages

### Extension Not Loading

1. Verify all files are in the correct location
2. Check that `manifest.json` is valid JSON
3. Look for any error messages in the extensions page
4. Try removing and re-adding the extension

### Permission Denied Errors

1. Make sure you're using the correct Google account
2. Check that the OAuth consent screen is configured properly
3. Verify the extension ID matches in both places

## Security Notes

- The extension only requests read-only access to your calendar
- Your calendar data is not stored locally or transmitted anywhere else
- The extension uses Chrome's built-in identity API for secure authentication

## Support

If you encounter any issues:

1. Check the browser console for error messages
2. Verify all setup steps were completed correctly
3. Try removing and reinstalling the extension
4. Check that your Google Calendar has events in the selected date range

## Next Steps

Once the Google Calendar widget is working, you can:

1. Add the Google Keep widget (coming soon)
2. Customize the styling in `styles.css`
3. Add more widgets or features
4. Share the extension with others 