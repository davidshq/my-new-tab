// jest.mock must come before requiring the module under test
jest.mock('../../../js/utils/StorageUtils', () => ({
  getSettings: jest.fn(),
  setSettings: jest.fn(),
  setSetting: jest.fn(),
  getSetting: jest.fn(),
}));
const StorageUtils = require('../../../js/utils/StorageUtils');
// Now require the SettingsService after the mock is in place
const SettingsService = require('../../../js/services/SettingsService');

describe('SettingsService', () => {
  let settingsService;
  
  beforeEach(() => {
    settingsService = new SettingsService();
    StorageUtils.getSettings.mockReset();
    StorageUtils.setSettings.mockReset();
    StorageUtils.setSetting.mockReset();
    StorageUtils.getSetting.mockReset();
  });

  describe('loadSettings', () => {
    it('should load settings with defaults', async () => {
      // Arrange
      StorageUtils.getSettings.mockImplementation((keys) => {
        if (Array.isArray(keys) && keys.length === 5) {
          return Promise.resolve({
            calendarDays: 14,
            calendarView: false,
            useSampleData: false,
            expandCalendarDays: false,
            daysPerRow: 4
          });
        }
        return Promise.resolve({});
      });

      // Act
      const settings = await settingsService.loadSettings();
      
      // Assert
      expect(settings.calendarDays).toBe(14);
      expect(settings.calendarView).toBe(false);
      expect(settings.useSampleData).toBe(false);
      expect(settings.expandCalendarDays).toBe(false);
      expect(settings.daysPerRow).toBe(4);
      expect(StorageUtils.getSettings).toHaveBeenCalledWith(['calendarDays', 'calendarView', 'useSampleData', 'expandCalendarDays', 'daysPerRow']);
    });

    it('should return defaults when storage is empty', async () => {
      // Arrange
      StorageUtils.getSettings.mockImplementation((keys) => {
        if (Array.isArray(keys) && keys.length === 5) {
          return Promise.resolve({});
        }
        return Promise.resolve({});
      });

      // Act
      const settings = await settingsService.loadSettings();
      
      // Assert
      expect(settings.calendarDays).toBe(7);
      expect(settings.calendarView).toBe(true);
      expect(settings.useSampleData).toBe(false);
      expect(settings.expandCalendarDays).toBe(false);
      expect(settings.daysPerRow).toBe(4);
    });

    it('should handle storage errors gracefully', async () => {
      // Arrange
      StorageUtils.getSettings.mockImplementation(() => Promise.reject(new Error('Storage error')));

      // Act
      const settings = await settingsService.loadSettings();
      
      // Assert
      expect(settings).toEqual(settingsService.defaultSettings);
    });

    it('should merge partial settings with defaults', async () => {
      // Arrange
      StorageUtils.getSettings.mockImplementation((keys) => {
        if (Array.isArray(keys) && keys.length === 5) {
          return Promise.resolve({
            calendarDays: 10,
            useSampleData: true
          });
        }
        return Promise.resolve({});
      });

      // Act
      const settings = await settingsService.loadSettings();
      
      // Assert
      expect(settings.calendarDays).toBe(10);
      expect(settings.calendarView).toBe(true);
      expect(settings.useSampleData).toBe(true);
      expect(settings.expandCalendarDays).toBe(false);
      expect(settings.daysPerRow).toBe(4);
    });
  });

  describe('saveSettings', () => {
    it('should save settings successfully', async () => {
      // Arrange
      StorageUtils.setSettings.mockImplementation(() => Promise.resolve(undefined));

      // Act
      const result = await settingsService.saveSettings({
        calendarDays: 10,
        useSampleData: true
      });

      // Assert
      expect(result).toBe(true);
      expect(StorageUtils.setSettings).toHaveBeenCalledWith({
        calendarDays: 10,
        useSampleData: true
      });
    });

    it('should handle save errors', async () => {
      // Arrange
      StorageUtils.setSettings.mockImplementation(() => Promise.reject(new Error('Save error')));

      // Act
      const result = await settingsService.saveSettings({
        calendarDays: 10
      });

      // Assert
      expect(result).toBe(false);
    });

    it('should save all settings when provided', async () => {
      // Arrange
      const allSettings = {
        calendarDays: 14,
        calendarView: false,
        useSampleData: true,
        expandCalendarDays: true,
        daysPerRow: 3
      };
      StorageUtils.setSettings.mockImplementation(() => Promise.resolve(undefined));

      // Act
      const result = await settingsService.saveSettings(allSettings);

      // Assert
      expect(result).toBe(true);
      expect(StorageUtils.setSettings).toHaveBeenCalledWith(allSettings);
    });
  });

  describe('defaultSettings', () => {
    it('should have correct default values', () => {
      // Assert
      expect(settingsService.defaultSettings).toEqual({
        calendarDays: 7,
        calendarView: true,
        useSampleData: false,
        expandCalendarDays: false,
        daysPerRow: 4
      });
    });
  });

  describe('getSetting', () => {
    it('should get a specific setting', async () => {
      // Arrange
      StorageUtils.getSetting.mockImplementation(() => Promise.resolve(14));

      // Act
      const result = await settingsService.getSetting('calendarDays');

      // Assert
      expect(result).toBe(14);
      expect(StorageUtils.getSetting).toHaveBeenCalledWith('calendarDays');
    });

    it('should return default value when setting not found', async () => {
      // Arrange
      StorageUtils.getSetting.mockImplementation(() => Promise.resolve(null));

      // Act
      const result = await settingsService.getSetting('calendarDays');

      // Assert
      expect(result).toBe(7);
    });

    it('should handle storage errors', async () => {
      // Arrange
      StorageUtils.getSetting.mockImplementation(() => Promise.reject(new Error('Storage error')));

      // Act
      const result = await settingsService.getSetting('calendarDays');

      // Assert
      expect(result).toBe(7);
    });
  });

  describe('updateSetting', () => {
    it('should update a single setting', async () => {
      // Arrange
      StorageUtils.setSetting.mockImplementation(() => Promise.resolve(undefined));

      // Act
      const result = await settingsService.updateSetting('calendarDays', 10);

      // Assert
      expect(result).toBe(true);
      expect(StorageUtils.setSetting).toHaveBeenCalledWith('calendarDays', 10);
    });

    it('should handle update errors', async () => {
      // Arrange
      StorageUtils.setSetting.mockImplementation(() => Promise.reject(new Error('Update error')));

      // Act
      const result = await settingsService.updateSetting('calendarDays', 10);

      // Assert
      expect(result).toBe(false);
    });
  });
}); 