/**
 * Utility class for Chrome storage operations.
 * Provides static methods for common storage operations across the extension.
 * 
 * @class StorageUtils
 * @description Contains utility functions for handling Chrome sync storage
 * operations including getting, setting, and managing extension settings.
 * @global
 */
class StorageUtils {
    /**
     * Gets a single setting from Chrome storage.
     * 
     * @static
     * @method getSetting
     * @param {string} key - The storage key to retrieve
     * @returns {Promise<any>} The stored value or null if not found
     * @description Retrieves a single setting from Chrome sync storage.
     */
    static async getSetting(key) {
        try {
            const result = await chrome.storage.sync.get([key]);
            return result[key] || null;
        } catch (error) {
            console.error(`Error getting setting ${key}:`, error);
            return null;
        }
    }

    /**
     * Gets multiple settings from Chrome storage.
     * 
     * @static
     * @method getSettings
     * @param {Array<string>} keys - Array of storage keys to retrieve
     * @returns {Promise<Object>} Object containing the stored values
     * @description Retrieves multiple settings from Chrome sync storage.
     */
    static async getSettings(keys) {
        try {
            const result = await chrome.storage.sync.get(keys);
            return result;
        } catch (error) {
            console.error('Error getting settings:', error);
            return {};
        }
    }

    /**
     * Sets a single setting in Chrome storage.
     * 
     * @static
     * @method setSetting
     * @param {string} key - The storage key
     * @param {any} value - The value to store
     * @returns {Promise<boolean>} True if successful, false otherwise
     * @description Stores a single setting in Chrome sync storage.
     */
    static async setSetting(key, value) {
        try {
            await chrome.storage.sync.set({ [key]: value });
            return true;
        } catch (error) {
            console.error(`Error setting ${key}:`, error);
            return false;
        }
    }

    /**
     * Sets multiple settings in Chrome storage.
     * 
     * @static
     * @method setSettings
     * @param {Object} settings - Object containing key-value pairs to store
     * @returns {Promise<boolean>} True if successful, false otherwise
     * @description Stores multiple settings in Chrome sync storage.
     */
    static async setSettings(settings) {
        try {
            await chrome.storage.sync.set(settings);
            return true;
        } catch (error) {
            console.error('Error setting settings:', error);
            return false;
        }
    }

    /**
     * Removes a setting from Chrome storage.
     * 
     * @static
     * @method removeSetting
     * @param {string} key - The storage key to remove
     * @returns {Promise<boolean>} True if successful, false otherwise
     * @description Removes a setting from Chrome sync storage.
     */
    static async removeSetting(key) {
        try {
            await chrome.storage.sync.remove([key]);
            return true;
        } catch (error) {
            console.error(`Error removing setting ${key}:`, error);
            return false;
        }
    }

    /**
     * Clears all settings from Chrome storage.
     * 
     * @static
     * @method clearSettings
     * @returns {Promise<boolean>} True if successful, false otherwise
     * @description Clears all settings from Chrome sync storage.
     */
    static async clearSettings() {
        try {
            await chrome.storage.sync.clear();
            return true;
        } catch (error) {
            console.error('Error clearing settings:', error);
            return false;
        }
    }

    /**
     * Gets all settings from Chrome storage.
     * 
     * @static
     * @method getAllSettings
     * @returns {Promise<Object>} All stored settings
     * @description Retrieves all settings from Chrome sync storage.
     */
    static async getAllSettings() {
        try {
            const result = await chrome.storage.sync.get(null);
            return result;
        } catch (error) {
            console.error('Error getting all settings:', error);
            return {};
        }
    }
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageUtils;
} 