// Import the StorageUtils class
// Note: We'll need to modify the original file to export the class
const StorageUtils = require('../../../js/utils/StorageUtils');

describe('StorageUtils', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    chrome.storage.sync.get.mockClear();
    chrome.storage.sync.set.mockClear();
    chrome.storage.sync.remove.mockClear();
    chrome.storage.sync.clear.mockClear();
  });

  describe('getSetting', () => {
    it('should retrieve a single setting', async () => {
      // Arrange
      chrome.storage.sync.get.mockResolvedValue({ testKey: 'testValue' });

      // Act
      const result = await StorageUtils.getSetting('testKey');

      // Assert
      expect(result).toBe('testValue');
      expect(chrome.storage.sync.get).toHaveBeenCalledWith(['testKey']);
    });

    it('should return null for non-existent setting', async () => {
      // Arrange
      chrome.storage.sync.get.mockResolvedValue({});

      // Act
      const result = await StorageUtils.getSetting('nonExistent');

      // Assert
      expect(result).toBeNull();
    });

    it('should handle storage errors gracefully', async () => {
      // Arrange
      chrome.storage.sync.get.mockRejectedValue(new Error('Storage error'));

      // Act
      const result = await StorageUtils.getSetting('testKey');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('getSettings', () => {
    it('should retrieve multiple settings', async () => {
      // Arrange
      const mockSettings = {
        calendarDays: 7,
        calendarView: true,
        useSampleData: false
      };
      chrome.storage.sync.get.mockResolvedValue(mockSettings);

      // Act
      const result = await StorageUtils.getSettings(['calendarDays', 'calendarView', 'useSampleData']);

      // Assert
      expect(result).toEqual(mockSettings);
      expect(chrome.storage.sync.get).toHaveBeenCalledWith(['calendarDays', 'calendarView', 'useSampleData']);
    });

    it('should return empty object when no settings found', async () => {
      // Arrange
      chrome.storage.sync.get.mockResolvedValue({});

      // Act
      const result = await StorageUtils.getSettings(['test1', 'test2']);

      // Assert
      expect(result).toEqual({});
    });

    it('should handle errors when getting multiple settings', async () => {
      // Arrange
      chrome.storage.sync.get.mockRejectedValue(new Error('Storage error'));

      // Act
      const result = await StorageUtils.getSettings(['test1', 'test2']);

      // Assert
      expect(result).toEqual({});
    });
  });

  describe('setSetting', () => {
    it('should set a single setting successfully', async () => {
      // Arrange
      chrome.storage.sync.set.mockResolvedValue();

      // Act
      const result = await StorageUtils.setSetting('testKey', 'testValue');

      // Assert
      expect(result).toBe(true);
      expect(chrome.storage.sync.set).toHaveBeenCalledWith({
        testKey: 'testValue'
      });
    });

    it('should handle set errors', async () => {
      // Arrange
      chrome.storage.sync.set.mockRejectedValue(new Error('Set error'));

      // Act
      const result = await StorageUtils.setSetting('testKey', 'testValue');

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('setSettings', () => {
    it('should set multiple settings successfully', async () => {
      // Arrange
      const settings = {
        calendarDays: 14,
        calendarView: false,
        useSampleData: true
      };
      chrome.storage.sync.set.mockResolvedValue();

      // Act
      const result = await StorageUtils.setSettings(settings);

      // Assert
      expect(result).toBe(true);
      expect(chrome.storage.sync.set).toHaveBeenCalledWith(settings);
    });

    it('should handle errors when setting multiple settings', async () => {
      // Arrange
      chrome.storage.sync.set.mockRejectedValue(new Error('Set error'));

      // Act
      const result = await StorageUtils.setSettings({ test: 'value' });

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('removeSetting', () => {
    it('should remove a setting successfully', async () => {
      // Arrange
      chrome.storage.sync.remove.mockResolvedValue();

      // Act
      const result = await StorageUtils.removeSetting('testKey');

      // Assert
      expect(result).toBe(true);
      expect(chrome.storage.sync.remove).toHaveBeenCalledWith(['testKey']);
    });

    it('should handle remove errors', async () => {
      // Arrange
      chrome.storage.sync.remove.mockRejectedValue(new Error('Remove error'));

      // Act
      const result = await StorageUtils.removeSetting('testKey');

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('clearSettings', () => {
    it('should clear all settings successfully', async () => {
      // Arrange
      chrome.storage.sync.clear.mockResolvedValue();

      // Act
      const result = await StorageUtils.clearSettings();

      // Assert
      expect(result).toBe(true);
      expect(chrome.storage.sync.clear).toHaveBeenCalled();
    });

    it('should handle clear errors', async () => {
      // Arrange
      chrome.storage.sync.clear.mockRejectedValue(new Error('Clear error'));

      // Act
      const result = await StorageUtils.clearSettings();

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('getAllSettings', () => {
    it('should retrieve all settings', async () => {
      // Arrange
      const mockAllSettings = {
        calendarDays: 7,
        calendarView: true,
        useSampleData: false,
        expandCalendarDays: false,
        daysPerRow: 4
      };
      chrome.storage.sync.get.mockResolvedValue(mockAllSettings);

      // Act
      const result = await StorageUtils.getAllSettings();

      // Assert
      expect(result).toEqual(mockAllSettings);
      expect(chrome.storage.sync.get).toHaveBeenCalledWith(null);
    });

    it('should return empty object when no settings exist', async () => {
      // Arrange
      chrome.storage.sync.get.mockResolvedValue({});

      // Act
      const result = await StorageUtils.getAllSettings();

      // Assert
      expect(result).toEqual({});
    });

    it('should handle errors when getting all settings', async () => {
      // Arrange
      chrome.storage.sync.get.mockRejectedValue(new Error('Get all error'));

      // Act
      const result = await StorageUtils.getAllSettings();

      // Assert
      expect(result).toEqual({});
    });
  });
}); 