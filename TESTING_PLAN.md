# Comprehensive Testing Plan for My New Tab Extension

## Overview

This document outlines a comprehensive testing strategy for the My New Tab Chrome extension, covering unit tests, integration tests, and end-to-end tests using modern testing frameworks and best practices.

## Testing Strategy

### 1. Unit Testing
**Framework:** Jest with Chrome Extension API mocks
**Coverage Target:** 80%+ for business logic
**Focus:** Services, utilities, and components in isolation

### 2. Integration Testing
**Framework:** Jest with DOM testing environment
**Focus:** Component interactions and service communication

### 3. End-to-End Testing
**Framework:** Puppeteer with Chrome Extension testing
**Focus:** Complete user workflows and extension behavior

### 4. Manual Testing
**Focus:** UI/UX validation and cross-browser compatibility

## Test Structure

```
tests/
├── unit/
│   ├── services/
│   │   ├── CalendarService.test.js
│   │   ├── SettingsService.test.js
│   │   └── WidgetResizeService.test.js
│   ├── components/
│   │   ├── CalendarRenderer.test.js
│   │   └── SettingsModal.test.js
│   ├── utils/
│   │   ├── StorageUtils.test.js
│   │   └── TimeUtils.test.js
│   └── app/
│       └── NewTabApp.test.js
├── integration/
│   ├── CalendarIntegration.test.js
│   ├── SettingsIntegration.test.js
│   └── WidgetResizeIntegration.test.js
├── e2e/
│   ├── NewTabWorkflow.test.js
│   ├── SettingsWorkflow.test.js
│   └── CalendarWorkflow.test.js
├── fixtures/
│   ├── sample-events.json
│   ├── mock-settings.json
│   └── test-manifest.json
├── mocks/
│   ├── chrome-api.mock.js
│   ├── google-calendar.mock.js
│   └── dom-elements.mock.js
└── utils/
    ├── test-helpers.js
    └── extension-loader.js
```

## 1. Unit Testing Implementation

### Setup Configuration

**jest.config.js:**
```javascript
module.exports = {
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/js/$1'
  },
  collectCoverageFrom: [
    'js/**/*.js',
    '!js/**/*.test.js',
    '!background.js',
    '!popup.js'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

**tests/setup.js:**
```javascript
// Mock Chrome Extension APIs
global.chrome = {
  storage: {
    sync: {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
      clear: jest.fn()
    }
  },
  identity: {
    getAuthToken: jest.fn()
  },
  runtime: {
    lastError: null,
    onInstalled: {
      addListener: jest.fn()
    }
  },
  action: {
    onClicked: {
      addListener: jest.fn()
    }
  }
};

// Mock DOM APIs
global.HTMLElement.prototype.getBoundingClientRect = jest.fn(() => ({
  width: 100,
  height: 100,
  top: 0,
  left: 0
}));
```

### Service Tests

**tests/unit/services/SettingsService.test.js:**
```javascript
import { SettingsService } from '../../../js/services/SettingsService';

describe('SettingsService', () => {
  let settingsService;
  
  beforeEach(() => {
    settingsService = new SettingsService();
    chrome.storage.sync.get.mockClear();
    chrome.storage.sync.set.mockClear();
  });

  describe('loadSettings', () => {
    it('should load settings with defaults', async () => {
      chrome.storage.sync.get.mockResolvedValue({
        calendarDays: 14,
        calendarView: false
      });

      const settings = await settingsService.loadSettings();
      
      expect(settings.calendarDays).toBe(14);
      expect(settings.calendarView).toBe(false);
      expect(settings.useSampleData).toBe(false); // default
    });

    it('should return defaults when storage is empty', async () => {
      chrome.storage.sync.get.mockResolvedValue({});

      const settings = await settingsService.loadSettings();
      
      expect(settings.calendarDays).toBe(7);
      expect(settings.calendarView).toBe(true);
    });

    it('should handle storage errors gracefully', async () => {
      chrome.storage.sync.get.mockRejectedValue(new Error('Storage error'));

      const settings = await settingsService.loadSettings();
      
      expect(settings).toEqual(settingsService.defaultSettings);
    });
  });

  describe('saveSettings', () => {
    it('should save settings successfully', async () => {
      chrome.storage.sync.set.mockResolvedValue();

      const result = await settingsService.saveSettings({
        calendarDays: 10,
        useSampleData: true
      });

      expect(result).toBe(true);
      expect(chrome.storage.sync.set).toHaveBeenCalledWith({
        calendarDays: 10,
        useSampleData: true
      });
    });

    it('should handle save errors', async () => {
      chrome.storage.sync.set.mockRejectedValue(new Error('Save error'));

      const result = await settingsService.saveSettings({
        calendarDays: 10
      });

      expect(result).toBe(false);
    });
  });
});
```

**tests/unit/services/CalendarService.test.js:**
```javascript
import { CalendarService } from '../../../js/services/CalendarService';

describe('CalendarService', () => {
  let calendarService;
  
  beforeEach(() => {
    calendarService = new CalendarService();
    chrome.identity.getAuthToken.mockClear();
  });

  describe('getEvents', () => {
    it('should return sample events when useSampleData is true', async () => {
      const events = await calendarService.getEvents(7, true);
      
      expect(events).toBeInstanceOf(Array);
      expect(events.length).toBeGreaterThan(0);
      expect(events[0]).toHaveProperty('summary');
      expect(events[0]).toHaveProperty('start');
    });

    it('should authenticate and fetch real events', async () => {
      chrome.identity.getAuthToken.mockResolvedValue('mock-token');
      
      // Mock fetch for Google Calendar API
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          items: [
            {
              summary: 'Test Event',
              start: { dateTime: '2024-01-15T10:00:00Z' },
              end: { dateTime: '2024-01-15T11:00:00Z' }
            }
          ]
        })
      });

      const events = await calendarService.getEvents(7, false);
      
      expect(events).toHaveLength(1);
      expect(events[0].summary).toBe('Test Event');
    });

    it('should handle authentication errors', async () => {
      chrome.identity.getAuthToken.mockRejectedValue(new Error('Auth failed'));

      await expect(calendarService.getEvents(7, false))
        .rejects.toThrow('Authentication required');
    });
  });

  describe('generateSampleEvents', () => {
    it('should generate events for specified days', () => {
      const events = calendarService.generateSampleEvents(7);
      
      expect(events).toHaveLength(7);
      events.forEach(event => {
        expect(event).toHaveProperty('summary');
        expect(event).toHaveProperty('start');
        expect(event).toHaveProperty('end');
      });
    });

    it('should generate events within date range', () => {
      const events = calendarService.generateSampleEvents(3);
      const today = new Date();
      const endDate = new Date(today.getTime() + (3 * 24 * 60 * 60 * 1000));
      
      events.forEach(event => {
        const eventDate = new Date(event.start.dateTime);
        expect(eventDate.getTime()).toBeGreaterThanOrEqual(today.getTime());
        expect(eventDate.getTime()).toBeLessThanOrEqual(endDate.getTime());
      });
    });
  });
});
```

### Component Tests

**tests/unit/components/CalendarRenderer.test.js:**
```javascript
import { CalendarRenderer } from '../../../js/components/CalendarRenderer';

describe('CalendarRenderer', () => {
  let renderer;
  let container;

  beforeEach(() => {
    renderer = new CalendarRenderer();
    container = document.createElement('div');
    container.id = 'calendarContent';
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('renderCalendar', () => {
    it('should render traditional view correctly', () => {
      const events = [
        {
          summary: 'Test Event',
          start: { dateTime: '2024-01-15T10:00:00Z' },
          end: { dateTime: '2024-01-15T11:00:00Z' }
        }
      ];

      renderer.renderCalendar(events, 'calendarContent', true);

      const calendarElement = document.getElementById('calendarContent');
      expect(calendarElement.innerHTML).toContain('Test Event');
      expect(calendarElement.innerHTML).toContain('calendar-grid');
    });

    it('should render agenda view correctly', () => {
      const events = [
        {
          summary: 'Test Event',
          start: { dateTime: '2024-01-15T10:00:00Z' },
          end: { dateTime: '2024-01-15T11:00:00Z' }
        }
      ];

      renderer.renderCalendar(events, 'calendarContent', false);

      const calendarElement = document.getElementById('calendarContent');
      expect(calendarElement.innerHTML).toContain('Test Event');
      expect(calendarElement.innerHTML).toContain('agenda-list');
    });

    it('should handle empty events array', () => {
      renderer.renderCalendar([], 'calendarContent', true);

      const calendarElement = document.getElementById('calendarContent');
      expect(calendarElement.innerHTML).toContain('No events');
    });
  });

  describe('updateViewToggleIcon', () => {
    it('should update icon for traditional view', () => {
      const icon = document.createElement('i');
      icon.id = 'viewToggleIcon';
      document.body.appendChild(icon);

      renderer.updateViewToggleIcon(true);

      expect(icon.className).toContain('fa-calendar');
      document.body.removeChild(icon);
    });

    it('should update icon for agenda view', () => {
      const icon = document.createElement('i');
      icon.id = 'viewToggleIcon';
      document.body.appendChild(icon);

      renderer.updateViewToggleIcon(false);

      expect(icon.className).toContain('fa-list');
      document.body.removeChild(icon);
    });
  });
});
```

### Utility Tests

**tests/unit/utils/StorageUtils.test.js:**
```javascript
import { StorageUtils } from '../../../js/utils/StorageUtils';

describe('StorageUtils', () => {
  beforeEach(() => {
    chrome.storage.sync.get.mockClear();
    chrome.storage.sync.set.mockClear();
    chrome.storage.sync.remove.mockClear();
    chrome.storage.sync.clear.mockClear();
  });

  describe('getSetting', () => {
    it('should retrieve a single setting', async () => {
      chrome.storage.sync.get.mockResolvedValue({ testKey: 'testValue' });

      const result = await StorageUtils.getSetting('testKey');

      expect(result).toBe('testValue');
      expect(chrome.storage.sync.get).toHaveBeenCalledWith(['testKey']);
    });

    it('should return null for non-existent setting', async () => {
      chrome.storage.sync.get.mockResolvedValue({});

      const result = await StorageUtils.getSetting('nonExistent');

      expect(result).toBeNull();
    });

    it('should handle storage errors', async () => {
      chrome.storage.sync.get.mockRejectedValue(new Error('Storage error'));

      const result = await StorageUtils.getSetting('testKey');

      expect(result).toBeNull();
    });
  });

  describe('setSetting', () => {
    it('should set a single setting', async () => {
      chrome.storage.sync.set.mockResolvedValue();

      const result = await StorageUtils.setSetting('testKey', 'testValue');

      expect(result).toBe(true);
      expect(chrome.storage.sync.set).toHaveBeenCalledWith({
        testKey: 'testValue'
      });
    });

    it('should handle set errors', async () => {
      chrome.storage.sync.set.mockRejectedValue(new Error('Set error'));

      const result = await StorageUtils.setSetting('testKey', 'testValue');

      expect(result).toBe(false);
    });
  });
});
```

## 2. Integration Testing

**tests/integration/CalendarIntegration.test.js:**
```javascript
import { NewTabApp } from '../../js/app/NewTabApp';
import { CalendarService } from '../../js/services/CalendarService';
import { SettingsService } from '../../js/services/SettingsService';

describe('Calendar Integration', () => {
  let app;
  let calendarService;
  let settingsService;

  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `
      <div id="calendarContent"></div>
      <select id="daysSelect">
        <option value="7">7 days</option>
        <option value="14">14 days</option>
      </select>
      <button id="refreshBtn">Refresh</button>
      <button id="viewToggleBtn">Toggle View</button>
    `;

    calendarService = new CalendarService();
    settingsService = new SettingsService();
    app = new NewTabApp();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should load calendar with settings', async () => {
    // Mock services
    jest.spyOn(settingsService, 'loadSettings').mockResolvedValue({
      calendarDays: 14,
      calendarView: true,
      useSampleData: true
    });

    jest.spyOn(calendarService, 'getEvents').mockResolvedValue([
      {
        summary: 'Test Event',
        start: { dateTime: '2024-01-15T10:00:00Z' },
        end: { dateTime: '2024-01-15T11:00:00Z' }
      }
    ]);

    await app.init();

    expect(settingsService.loadSettings).toHaveBeenCalled();
    expect(calendarService.getEvents).toHaveBeenCalledWith(14, true);
  });

  it('should handle settings changes', async () => {
    const settingsChangedEvent = new CustomEvent('settingsChanged', {
      detail: { useSampleData: true }
    });

    jest.spyOn(app, 'loadCalendar').mockResolvedValue();

    document.dispatchEvent(settingsChangedEvent);

    expect(app.useSampleData).toBe(true);
    expect(app.loadCalendar).toHaveBeenCalled();
  });
});
```

## 3. End-to-End Testing

**tests/e2e/NewTabWorkflow.test.js:**
```javascript
const puppeteer = require('puppeteer');
const path = require('path');

describe('New Tab Workflow', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      args: [
        '--disable-extensions-except=' + path.resolve(__dirname, '../../'),
        '--load-extension=' + path.resolve(__dirname, '../../'),
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
  });

  afterEach(async () => {
    await page.close();
  });

  it('should load new tab page with calendar', async () => {
    // Navigate to new tab
    await page.goto('chrome://newtab/');

    // Wait for calendar content to load
    await page.waitForSelector('#calendarContent', { timeout: 5000 });

    // Check that calendar is displayed
    const calendarContent = await page.$('#calendarContent');
    expect(calendarContent).not.toBeNull();

    // Check that time is displayed
    const timeDisplay = await page.$('#timeDisplay');
    expect(timeDisplay).not.toBeNull();
  });

  it('should change calendar view when toggle is clicked', async () => {
    await page.goto('chrome://newtab/');
    await page.waitForSelector('#viewToggleBtn');

    // Get initial view state
    const initialView = await page.$eval('#calendarContent', el => 
      el.classList.contains('calendar-grid')
    );

    // Click view toggle
    await page.click('#viewToggleBtn');

    // Wait for view to change
    await page.waitForTimeout(1000);

    // Check that view has changed
    const newView = await page.$eval('#calendarContent', el => 
      el.classList.contains('calendar-grid')
    );

    expect(newView).not.toBe(initialView);
  });

  it('should open settings modal', async () => {
    await page.goto('chrome://newtab/');
    await page.waitForSelector('#settingsBtn');

    // Click settings button
    await page.click('#settingsBtn');

    // Check that modal is visible
    const modal = await page.$('#settingsModal');
    expect(modal).not.toBeNull();

    const modalDisplay = await page.$eval('#settingsModal', el => 
      getComputedStyle(el).display
    );
    expect(modalDisplay).not.toBe('none');
  });

  it('should change days range and reload calendar', async () => {
    await page.goto('chrome://newtab/');
    await page.waitForSelector('#daysSelect');

    // Change days selection
    await page.select('#daysSelect', '14');

    // Wait for calendar to reload
    await page.waitForTimeout(1000);

    // Check that calendar content has updated
    const calendarContent = await page.$('#calendarContent');
    expect(calendarContent).not.toBeNull();
  });
});
```

## 4. Test Configuration

### Package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:unit": "jest tests/unit",
    "test:integration": "jest tests/integration",
    "test:e2e": "jest tests/e2e",
    "test:ci": "jest --ci --coverage --watchAll=false"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "puppeteer": "^21.0.0",
    "@testing-library/jest-dom": "^6.1.0",
    "jest-chrome": "^0.8.0"
  }
}
```

### Chrome Extension Testing Setup

**tests/utils/extension-loader.js:**
```javascript
const puppeteer = require('puppeteer');
const path = require('path');

class ExtensionLoader {
  static async loadExtension() {
    const extensionPath = path.resolve(__dirname, '../../');
    
    const browser = await puppeteer.launch({
      headless: false,
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });

    return browser;
  }

  static async getExtensionId(browser) {
    const page = await browser.newPage();
    await page.goto('chrome://extensions/');
    
    const extensionId = await page.evaluate(() => {
      const extensionElement = document.querySelector('[data-extension-id]');
      return extensionElement ? extensionElement.getAttribute('data-extension-id') : null;
    });

    await page.close();
    return extensionId;
  }
}

module.exports = ExtensionLoader;
```

## 5. Continuous Integration

### GitHub Actions Workflow

**.github/workflows/test.yml:**
```yaml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run unit tests
      run: npm run test:unit
    
    - name: Run integration tests
      run: npm run test:integration
    
    - name: Generate coverage report
      run: npm run test:coverage
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
        flags: unittests
        name: codecov-umbrella
```

## 6. Manual Testing Checklist

### Functional Testing
- [ ] Extension loads without errors
- [ ] New tab page displays correctly
- [ ] Calendar events load and display
- [ ] Settings modal opens and closes
- [ ] Settings persist across browser sessions
- [ ] Widget resizing works correctly
- [ ] View toggle switches between calendar and agenda views
- [ ] Days selector changes calendar range
- [ ] Refresh button reloads calendar data
- [ ] Sample data mode works correctly

### Cross-Browser Testing
- [ ] Chrome (latest version)
- [ ] Chrome (previous version)
- [ ] Edge (Chromium-based)
- [ ] Opera (Chromium-based)

### Performance Testing
- [ ] Extension loads within 2 seconds
- [ ] Calendar renders within 1 second
- [ ] Settings save within 500ms
- [ ] No memory leaks during extended use

### Security Testing
- [ ] No sensitive data in console logs
- [ ] OAuth tokens handled securely
- [ ] Storage permissions used correctly
- [ ] Content Security Policy enforced

## 7. Testing Best Practices

### Code Organization
1. **Test files mirror source structure**
2. **Descriptive test names** using "should" format
3. **Arrange-Act-Assert** pattern
4. **Isolated tests** with proper setup/teardown

### Mocking Strategy
1. **Mock Chrome APIs** consistently
2. **Mock external services** (Google Calendar API)
3. **Mock DOM elements** for component tests
4. **Use realistic test data**

### Coverage Goals
1. **80%+ line coverage** for business logic
2. **100% coverage** for critical paths
3. **Edge case testing** for error conditions
4. **Integration testing** for component interactions

### Performance Considerations
1. **Fast test execution** (< 30 seconds for unit tests)
2. **Parallel test execution** where possible
3. **Minimal setup/teardown** overhead
4. **Efficient mocking** strategies

## 8. Future Enhancements

### Advanced Testing Features
1. **Visual regression testing** for UI changes
2. **Accessibility testing** with axe-core
3. **Performance testing** with Lighthouse CI
4. **Security testing** with OWASP ZAP

### Test Automation
1. **Automated deployment testing**
2. **Cross-browser automated testing**
3. **Mobile browser testing**
4. **Extension store compatibility testing**

### Monitoring and Analytics
1. **Test execution metrics**
2. **Coverage trend analysis**
3. **Performance regression detection**
4. **Error rate monitoring**

## Conclusion

This comprehensive testing plan provides a solid foundation for ensuring the quality and reliability of the My New Tab extension. The combination of unit, integration, and end-to-end tests will catch issues early in development while maintaining high code quality standards.

The modular architecture of the extension makes it particularly well-suited for comprehensive testing, with clear separation of concerns allowing for isolated testing of each component.

Regular execution of this test suite will help maintain code quality and prevent regressions as the extension evolves. 