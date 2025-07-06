class SettingsService {
    constructor() {
        this.defaultSettings = {
            calendarDays: 7,
            calendarView: true, // true = traditional view, false = agenda view
            useSampleData: false
        };
    }

    async loadSettings() {
        try {
            const result = await chrome.storage.sync.get(Object.keys(this.defaultSettings));
            return { ...this.defaultSettings, ...result };
        } catch (error) {
            console.error('Error loading settings:', error);
            return this.defaultSettings;
        }
    }

    async saveSettings(settings) {
        try {
            await chrome.storage.sync.set(settings);
            return true;
        } catch (error) {
            console.error('Error saving settings:', error);
            return false;
        }
    }

    async updateSetting(key, value) {
        try {
            await chrome.storage.sync.set({ [key]: value });
            return true;
        } catch (error) {
            console.error('Error updating setting:', error);
            return false;
        }
    }

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