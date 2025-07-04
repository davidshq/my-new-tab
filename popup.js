// Popup script for My New Tab extension

document.addEventListener('DOMContentLoaded', async () => {
    await loadSettings();
    await checkConnectionStatus();
});

async function loadSettings() {
    try {
        const result = await chrome.storage.sync.get(['calendarDays']);
        const calendarDays = result.calendarDays || 7;
        document.getElementById('calendarDays').textContent = calendarDays;
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

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