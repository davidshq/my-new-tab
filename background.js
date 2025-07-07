/**
 * Background script for My New Tab extension.
 * This script runs in the background and handles extension lifecycle events,
 * message passing, and default settings initialization.
 * 
 * @description Manages the extension's background processes including
 * installation handling, message routing, and storage management.
 */

/**
 * Handles extension installation and sets up default settings.
 * Initializes default configuration when the extension is first installed.
 * 
 * @param {Object} details - Installation details from Chrome extension API
 * @param {string} details.reason - Reason for the event ('install', 'update', etc.)
 * @description Sets up default settings when the extension is installed
 * for the first time.
 */
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

/**
 * Handles messages from content scripts or popup.
 * Routes different message types to appropriate handlers.
 * 
 * @param {Object} request - Message request object
 * @param {string} request.type - Type of message ('GET_SETTINGS', 'SAVE_SETTINGS', etc.)
 * @param {Object} request.data - Data payload for the message
 * @param {Object} sender - Information about the message sender
 * @param {Function} sendResponse - Function to send response back to sender
 * @returns {boolean} True to keep message channel open for async response
 * @description Processes incoming messages from content scripts and popup,
 * handling settings retrieval and storage operations.
 */
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

/**
 * Handles extension icon click events.
 * Currently logs the event for future functionality.
 * 
 * @param {Object} tab - Information about the active tab
 * @description Handles clicks on the extension icon in the browser toolbar.
 * This would be used if we had a popup or wanted to open a specific page.
 */
chrome.action.onClicked.addListener((tab) => {
    // This would be used if we had a popup or wanted to open a specific page
    console.log('Extension icon clicked');
}); 