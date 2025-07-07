/**
 * Popup script for My New Tab extension.
 * Handles the popup interface functionality including settings display
 * and connection status checking.
 * 
 * @description Manages the popup window interface for the extension,
 * providing quick access to settings and status information.
 */

/**
 * Initializes the popup when the DOM is loaded.
 * Loads settings and checks connection status.
 * 
 * @async
 * @description Sets up the popup interface by loading current settings
 * and checking the Google Calendar connection status.
 */
document.addEventListener('DOMContentLoaded', async () => {
    await loadSettings();
    await checkConnectionStatus();
});

/**
 * Loads and displays current settings in the popup.
 * Retrieves settings from Chrome storage and updates the UI.
 * 
 * @async
 * @function loadSettings
 * @description Loads calendar settings from Chrome sync storage and
 * displays them in the popup interface.
 */
async function loadSettings() {
    try {
        const result = await StorageUtils.getSettings(['calendarDays']);
        const calendarDays = result.calendarDays || 7;
        document.getElementById('calendarDays').textContent = calendarDays;
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

/**
 * Checks the connection status with Google Calendar.
 * Verifies authentication and updates the status display.
 * 
 * @async
 * @function checkConnectionStatus
 * @description Attempts to authenticate with Google Calendar and
 * updates the connection status indicator in the popup.
 */
async function checkConnectionStatus() {
    const statusElement = document.getElementById('status');
    
    try {
        // Try to get an auth token to check if user is authenticated
        const token = await new Promise((resolve, reject) => {
            chrome.identity.getAuthToken({ interactive: false }, (token) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(token);
                }
            });
        });
        
        if (token) {
            statusElement.textContent = 'Connected to Google Calendar';
            statusElement.className = 'status connected';
        } else {
            statusElement.textContent = 'Not connected to Google Calendar';
            statusElement.className = 'status disconnected';
        }
    } catch (error) {
        statusElement.textContent = 'Not connected to Google Calendar';
        statusElement.className = 'status disconnected';
    }
} 