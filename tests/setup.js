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

// Mock fetch for API calls
global.fetch = jest.fn();

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
};

// Mock Date.now() for consistent testing
const mockDate = new Date('2024-01-15T10:00:00Z');
global.Date.now = jest.fn(() => mockDate.getTime());

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
global.sessionStorage = sessionStorageMock; 