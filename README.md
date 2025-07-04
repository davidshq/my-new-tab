# My New Tab - Chrome Extension

A beautiful and customizable new tab Chrome extension that displays your Google Calendar events with a modern, clean interface.

## Features

- **Google Calendar Integration**: View your upcoming calendar events directly on your new tab page
- **Customizable Time Range**: Choose to display events for 7, 10, 14, 20, or 30 days
- **Modern UI**: Clean, responsive design with smooth animations and hover effects
- **Real-time Updates**: Time display updates every minute
- **Settings Persistence**: Your preferred day range is saved and restored
- **Mobile Responsive**: Works great on all screen sizes

## Setup Instructions

### 1. Google Cloud Console Setup

Before using the extension, you need to set up Google Calendar API access:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Calendar API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click on it and press "Enable"
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Chrome Extension" as the application type
   - Enter your extension ID (you'll get this after loading the extension)
   - Download the client configuration

### 2. Extension Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select the extension folder
4. Copy the extension ID from the extensions page
5. Update the `client_id` in `manifest.json` with your Google OAuth client ID
6. Reload the extension

### 3. Authentication

1. Open a new tab to see the extension in action
2. Click the calendar widget - it will prompt you to authenticate with Google
3. Grant the necessary permissions for calendar access
4. Your calendar events will now be displayed!

## Google OAuth Client ID Setup

This extension uses Google APIs and requires a Google OAuth client ID.  
**For security and flexibility, the client ID is not included in this repository.**

### How to Set Up

1. **Create a Google Cloud Project:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/).
   - Create a new project or select an existing one.
   - Enable the Google Calendar API.

2. **Configure OAuth Consent Screen:**
   - Set the user type to "External".
   - Fill in the required fields.

3. **Create OAuth 2.0 Credentials:**
   - Application type: Chrome Extension
   - Add your extension's ID (from `chrome://extensions` after loading unpacked).
   - Copy the generated client ID.

4. **Update `manifest.json`:**
   - Open `manifest.json`.
   - Replace the value of `"client_id"` under `"oauth2"` with your client ID:
     ```json
     "oauth2": {
       "client_id": "YOUR_CLIENT_ID.apps.googleusercontent.com",
       "scopes": [
         "https://www.googleapis.com/auth/calendar.readonly"
       ]
     }
     ```

5. **Load the Extension:**
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select your extension folder

**Note:**  
If you are contributing to this project, please do not commit your client ID to the repository.

## File Structure

```
my-new-tab/
├── manifest.json          # Extension configuration
├── newtab.html           # Main new tab page
├── newtab.js             # JavaScript functionality
├── styles.css            # CSS styling
├── icons/                # Extension icons
└── README.md             # This file
```

## Configuration

### Google Calendar API Scopes

The extension requests the following Google Calendar API scopes:
- `https://www.googleapis.com/auth/calendar.readonly` - Read-only access to calendar events

### Customization

You can customize the extension by modifying:

- **Time Range Options**: Edit the `<select>` options in `newtab.html`
- **Styling**: Modify `styles.css` to change colors, fonts, and layout
- **Calendar Display**: Update the rendering logic in `newtab.js`

## Troubleshooting

### Common Issues

1. **"Authentication required" error**:
   - Make sure you've set up the Google Cloud Console correctly
   - Verify your OAuth client ID is correct in `manifest.json`
   - Check that the Google Calendar API is enabled

2. **No events showing**:
   - Ensure you have events in your Google Calendar
   - Check that you've granted calendar access permissions
   - Try refreshing the page or clicking the refresh button

3. **Extension not loading**:
   - Verify all files are in the correct location
   - Check the browser console for JavaScript errors
   - Ensure the manifest.json is valid

### Debug Mode

To debug the extension:
1. Open `chrome://extensions/`
2. Find your extension and click "Details"
3. Click "inspect views: newtab" to open DevTools
4. Check the console for any error messages

## Future Features

- [ ] Google Keep widget integration
- [ ] Multiple calendar support
- [ ] Weather widget
- [ ] Quick links/bookmarks widget
- [ ] Customizable themes
- [ ] Drag-and-drop widget reordering

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License. 