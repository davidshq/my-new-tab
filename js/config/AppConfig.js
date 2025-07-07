/**
 * Application configuration object.
 * Contains all configuration constants and settings for the application.
 * 
 * @constant {Object} AppConfig
 * @description Centralized configuration object containing all application
 * settings, constants, and configuration values.
 */
const AppConfig = {
    /**
     * Default application settings.
     * Initial values for user preferences and application state.
     * 
     * @type {Object}
     * @property {number} calendarDays - Number of days to display (default: 7)
     * @property {boolean} calendarView - Whether to use traditional view (default: true)
     * @property {boolean} useSampleData - Whether to use sample data (default: false)
     * @property {boolean} expandCalendarDays - Whether to expand calendar days (default: false)
     * @property {number} daysPerRow - Number of days per row in traditional view (default: 4)
     */
    DEFAULT_SETTINGS: {
        calendarDays: 7,
        calendarView: true, // true = traditional view, false = agenda view
        useSampleData: false,
        expandCalendarDays: false, // true = show all events, false = show +x events
        daysPerRow: 4 // number of days to show per row
    },

    /**
     * Calendar display options.
     * Available options for calendar configuration.
     * 
     * @type {Object}
     * @property {Array<number>} CALENDAR_DAYS_OPTIONS - Available day count options
     * @property {Array<number>} DAYS_PER_ROW_OPTIONS - Available days per row options
     */
    CALENDAR_DAYS_OPTIONS: [7, 10, 14, 20, 30],
    DAYS_PER_ROW_OPTIONS: [2, 3, 4, 5, 6, 7],
    
    /**
     * Google Calendar API configuration.
     * Settings for Google Calendar API integration.
     * 
     * @type {Object}
     * @property {string} BASE_URL - Google Calendar API base URL
     * @property {number} MAX_RESULTS - Maximum number of events to retrieve
     * @property {Array<string>} SCOPES - Required OAuth scopes for API access
     */
    GOOGLE_CALENDAR_API: {
        BASE_URL: 'https://www.googleapis.com/calendar/v3',
        MAX_RESULTS: 1000,
        SCOPES: ['https://www.googleapis.com/auth/calendar.readonly']
    },

    /**
     * User interface configuration.
     * Settings for UI behavior and display options.
     * 
     * @type {Object}
     * @property {number} TIME_UPDATE_INTERVAL - Time update interval in milliseconds
     * @property {number} MAX_EVENTS_PER_DAY - Maximum events to show per day
     * @property {number} MORE_EVENTS_THRESHOLD - Threshold for showing "+x more" indicator
     */
    UI: {
        TIME_UPDATE_INTERVAL: 60000, // 1 minute
        MAX_EVENTS_PER_DAY: 2,
        MORE_EVENTS_THRESHOLD: 2
    },

    /**
     * Sample calendar events for testing and demonstration.
     * Predefined events used when sample data mode is enabled.
     * 
     * @type {Array<Object>}
     * @description Array of sample calendar events with realistic
     * event data for testing and demonstration purposes.
     */
    SAMPLE_EVENTS: [
        {
            summary: 'Team Meeting',
            location: 'Conference Room A',
            start: { dateTime: '2024-01-15T10:00:00Z' },
            end: { dateTime: '2024-01-15T11:00:00Z' }
        },
        {
            summary: 'Lunch with Client',
            location: 'Downtown Restaurant',
            start: { dateTime: '2024-01-15T12:30:00Z' },
            end: { dateTime: '2024-01-15T14:00:00Z' }
        },
        {
            summary: 'Project Review',
            location: 'Virtual Meeting',
            start: { dateTime: '2024-01-16T14:00:00Z' },
            end: { dateTime: '2024-01-16T15:30:00Z' }
        },
        {
            summary: 'Doctor Appointment',
            location: 'Medical Center',
            start: { dateTime: '2024-01-17T09:00:00Z' },
            end: { dateTime: '2024-01-17T10:00:00Z' }
        },
        {
            summary: 'Gym Session',
            location: 'Fitness Center',
            start: { dateTime: '2024-01-17T18:00:00Z' },
            end: { dateTime: '2024-01-17T19:30:00Z' }
        },
        {
            summary: 'Dinner with Friends',
            location: 'Italian Restaurant',
            start: { dateTime: '2024-01-18T19:00:00Z' },
            end: { dateTime: '2024-01-18T21:00:00Z' }
        },
        {
            summary: 'All Day Event - Conference',
            location: 'Convention Center',
            start: { date: '2024-01-19' },
            end: { date: '2024-01-19' }
        },
        {
            summary: 'Weekend Trip',
            location: 'Mountain Resort',
            start: { dateTime: '2024-01-20T08:00:00Z' },
            end: { dateTime: '2024-01-21T18:00:00Z' }
        },
        {
            summary: 'Code Review',
            location: 'Office',
            start: { dateTime: '2024-01-22T11:00:00Z' },
            end: { dateTime: '2024-01-22T12:00:00Z' }
        },
        {
            summary: 'Product Launch',
            location: 'Main Auditorium',
            start: { dateTime: '2024-01-23T15:00:00Z' },
            end: { dateTime: '2024-01-23T17:00:00Z' }
        }
    ],

    /**
     * Error messages for user-facing error handling.
     * Standardized error messages used throughout the application.
     * 
     * @type {Object}
     * @property {string} AUTHENTICATION_REQUIRED - Message for authentication failures
     * @property {string} CALENDAR_LOAD_FAILED - Message for calendar loading failures
     * @property {string} SETTINGS_LOAD_FAILED - Message for settings loading failures
     * @property {string} SETTINGS_SAVE_FAILED - Message for settings saving failures
     */
    ERROR_MESSAGES: {
        AUTHENTICATION_REQUIRED: 'Authentication required',
        CALENDAR_LOAD_FAILED: 'Failed to load calendar events. Please try again.',
        SETTINGS_LOAD_FAILED: 'Error loading settings',
        SETTINGS_SAVE_FAILED: 'Error saving settings'
    },

    /**
     * DOM element IDs used throughout the application.
     * Centralized reference to all element IDs for consistency.
     * 
     * @type {Object}
     * @property {string} TIME_DISPLAY - ID for time display element
     * @property {string} CALENDAR_CONTENT - ID for calendar content container
     * @property {string} DAYS_SELECT - ID for days selection dropdown
     * @property {string} REFRESH_BTN - ID for refresh button
     * @property {string} VIEW_TOGGLE_BTN - ID for view toggle button
     * @property {string} VIEW_TOGGLE_ICON - ID for view toggle icon
     * @property {string} SETTINGS_BTN - ID for settings button
     * @property {string} CLOSE_SETTINGS_BTN - ID for close settings button
     * @property {string} SETTINGS_MODAL - ID for settings modal
     * @property {string} USE_SAMPLE_DATA - ID for sample data toggle
     */
    ELEMENT_IDS: {
        TIME_DISPLAY: 'timeDisplay',
        CALENDAR_CONTENT: 'calendarContent',
        DAYS_SELECT: 'daysSelect',
        REFRESH_BTN: 'refreshBtn',
        VIEW_TOGGLE_BTN: 'viewToggleBtn',
        VIEW_TOGGLE_ICON: 'viewToggleIcon',
        SETTINGS_BTN: 'settingsBtn',
        CLOSE_SETTINGS_BTN: 'closeSettingsBtn',
        SETTINGS_MODAL: 'settingsModal',
        USE_SAMPLE_DATA: 'useSampleData'
    }
}; 