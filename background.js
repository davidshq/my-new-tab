// Background script for My New Tab extension
// This script runs in the background and can handle any background tasks

chrome.runtime.onInstalled.addListener((details) => {
    console.log('My New Tab extension installed:', details.reason);
    
    // Set default settings on installation
    if (details.reason === 'install') {
        chrome.storage.sync.set({
            calendarDays: 7
        }, () => {
            console.log('Default settings saved');
        });
    }
});

// Handle any messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Background script received message:', request);
    
    // Handle different message types
    switch (request.type) {
        case 'GET_SETTINGS':
            chrome.storage.sync.get(['calendarDays'], (result) => {
                sendResponse(result);
            });
            return true; // Keep the message channel open for async response
            
        case 'SAVE_SETTINGS':
            chrome.storage.sync.set(request.data, () => {
                sendResponse({ success: true });
            });
            return true;
            
        default:
            sendResponse({ error: 'Unknown message type' });
    }
});

// Optional: Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
    // This would be used if we had a popup or wanted to open a specific page
    console.log('Extension icon clicked');
}); 