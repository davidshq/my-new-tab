# My New Tab - Chrome Extension

A customizable new tab page with widgets including Google Calendar and Google Keep integration.

## Features

- **Google Calendar Integration**: View your upcoming events with a beautiful, responsive interface
- **Google Keep Integration**: Access your Keep notes with OAuth 2.0 authentication
- **Multiple Calendar Views**: Toggle between traditional calendar and agenda views
- **Responsive Design**: Works perfectly on all screen sizes
- **Customizable Settings**: Adjust calendar days and other preferences
- **Sample Data Mode**: Test the extension with sample calendar data
- **Settings Page**: Accessible settings modal with toggle controls
- **Real-time Updates**: Time display updates every minute
- **Settings Persistence**: Your preferences are saved and restored across sessions
- **Mobile Responsive**: Works great on all screen sizes

## Architecture

This extension uses a hybrid authentication approach:

- **Google Calendar**: Uses Chrome's Identity API (GIS) for direct authentication
- **Google Keep**: Uses OAuth 2.0 flow through a Cloudflare Workers backend

This architecture allows secure access to both services while keeping secrets safe.

## Screenshots

## Traditional View
![Traditional View of Calendar](/screenshots/calendar-view.png)

## Agenda View
![Agenda View of Calendar](/screenshots/agenda-view.png)

## Setup Instructions

### 1. Chrome Extension Setup

1. Clone this repository
2. Update the `backendUrl` in `newtab.js` to point to your deployed Cloudflare Worker
3. Replace `{{REPLACE_WITH_CLIENT_ID}}` in `manifest.template.json` with your Google OAuth Client ID
4. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the extension directory

### 2. Backend Server Setup

The extension requires a Cloudflare Workers backend for Google Keep OAuth. See the [backend documentation](./my-new-tab-server/README.md) for setup instructions.

### 3. Google Cloud Console Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Calendar API and Google Keep API
4. Create OAuth 2.0 credentials for both the extension and backend

## Usage

### Calendar Widget

- **View Toggle**: Switch between traditional calendar and agenda views
- **Days Selector**: Choose how many upcoming days to display (7-30 days)
- **Refresh Button**: Manually refresh calendar data
- **Sample Data**: Toggle between real and sample data for testing

### Keep Widget

- **Authentication**: Click the authenticate button to connect to Google Keep
- **Notes Display**: View your Keep notes with color coding and pin indicators
- **Refresh**: Manually refresh your Keep notes

## Settings

Access the settings by clicking the gear icon in the top-right corner of the new tab page.

### Available Settings

- **Use Sample Data**: Toggle to display realistic sample calendar events instead of your actual Google Calendar data
  - Useful for testing the extension without requiring Google Calendar access
  - Sample events include meetings, appointments, gym sessions, and more
  - Events are randomly distributed across the selected time period

### Settings Persistence

All settings are automatically saved to Chrome's sync storage and will be restored when you open a new tab.

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
- **Sample Events**: Modify the `generateSampleEvents()` method in `newtab.js`

## Troubleshooting

### Common Issues

1. **"Authentication required" error**:
   - Make sure you've set up the Google Cloud Console correctly
   - Verify your OAuth client ID is correct in `manifest.json`
   - Check that the Google Calendar API is enabled
   - Try using sample data mode to test the extension

2. **No events showing**:
   - Ensure you have events in your Google Calendar
   - Check that you've granted calendar access permissions
   - Try refreshing the page or clicking the refresh button
   - Enable sample data mode to see example events

3. **Extension not loading**:
   - Verify all files are in the correct location
   - Check the browser console for JavaScript errors
   - Ensure the manifest.json is valid

4. **Settings not saving**:
   - Check that Chrome sync is enabled
   - Verify the extension has storage permissions
   - Try reloading the extension

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
- [ ] Drag-and-drop widget reordering
- [ ] Create, edit, delete calendar events

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License. 