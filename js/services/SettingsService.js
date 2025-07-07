/**
 * Service class for managing application settings.
 * Handles loading, saving, and updating user preferences.
 * 
 * @class SettingsService
 * @description Provides a centralized interface for managing all
 * application settings and user preferences.
 */
class SettingsService {
    /**
     * Initializes a new SettingsService instance.
     * Sets up default settings configuration.
     * 
     * @constructor
     * @description Creates a new SettingsService instance with
     * default settings values.
     */
    constructor() {
        this.defaultSettings = {
            calendarDays: 7,
            calendarView: true, // true = traditional view, false = agenda view
            useSampleData: false,
            expandCalendarDays: false, // true = show all events, false = show +x events
            daysPerRow: 4 // number of days to show per row
        };
    }

    /**
     * Loads all settings from Chrome storage.
     * Merges stored settings with defaults.
     * 
     * @async
     * @method loadSettings
     * @returns {Promise<Object>} Object containing all settings with defaults applied
     * @description Loads all user settings from Chrome sync storage and
     * merges them with default values.
     */
    async loadSettings() {
        try {
            const result = await chrome.storage.sync.get(Object.keys(this.defaultSettings));
            return { ...this.defaultSettings, ...result };
        } catch (error) {
            console.error('Error loading settings:', error);
            return this.defaultSettings;
        }
    }

    /**
     * Saves settings to Chrome storage.
     * Persists user preferences for future sessions.
     * 
     * @async
     * @method saveSettings
     * @param {Object} settings - Settings object to save
     * @returns {Promise<boolean>} True if save successful, false otherwise
     * @description Saves the provided settings object to Chrome sync storage.
     */
    async saveSettings(settings) {
        try {
            await chrome.storage.sync.set(settings);
            return true;
        } catch (error) {
            console.error('Error saving settings:', error);
            return false;
        }
    }

    /**
     * Updates a single setting in storage.
     * Modifies a specific setting without affecting others.
     * 
     * @async
     * @method updateSetting
     * @param {string} key - Setting key to update
     * @param {*} value - New value for the setting
     * @returns {Promise<boolean>} True if update successful, false otherwise
     * @description Updates a single setting in Chrome sync storage
     * without affecting other settings.
     */
    async updateSetting(key, value) {
        try {
            await chrome.storage.sync.set({ [key]: value });
            return true;
        } catch (error) {
            console.error('Error updating setting:', error);
            return false;
        }
    }

    /**
     * Retrieves a single setting from storage.
     * Returns the setting value or default if not found.
     * 
     * @async
     * @method getSetting
     * @param {string} key - Setting key to retrieve
     * @returns {Promise<*>} Setting value or default value
     * @description Retrieves a single setting from Chrome sync storage
     * and returns the default value if not found.
     */
    async getSetting(key) {
        try {
            const result = await chrome.storage.sync.get([key]);
            return result[key] !== undefined ? result[key] : this.defaultSettings[key];
        } catch (error) {
            console.error('Error getting setting:', error);
            return this.defaultSettings[key];
        }
    }
} 