const AppConfig = {
    // Default settings
    DEFAULT_SETTINGS: {
        calendarDays: 7,
        calendarView: true, // true = traditional view, false = agenda view
        useSampleData: false,
        expandCalendarDays: false, // true = show all events, false = show +x events
        daysPerRow: 4 // number of days to show per row
    },

    // Calendar options
    CALENDAR_DAYS_OPTIONS: [7, 10, 14, 20, 30],
    DAYS_PER_ROW_OPTIONS: [2, 3, 4, 5, 6, 7],
    
    // API settings
    GOOGLE_CALENDAR_API: {
        BASE_URL: 'https://www.googleapis.com/calendar/v3',
        MAX_RESULTS: 1000,
        SCOPES: ['https://www.googleapis.com/auth/calendar.readonly']
    },

    // UI settings
    UI: {
        TIME_UPDATE_INTERVAL: 60000, // 1 minute
        MAX_EVENTS_PER_DAY: 2,
        MORE_EVENTS_THRESHOLD: 2
    },

    // Sample events for testing
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

    // Error messages
    ERROR_MESSAGES: {
        AUTHENTICATION_REQUIRED: 'Authentication required',
        CALENDAR_LOAD_FAILED: 'Failed to load calendar events. Please try again.',
        SETTINGS_LOAD_FAILED: 'Error loading settings',
        SETTINGS_SAVE_FAILED: 'Error saving settings'
    },

    // DOM element IDs
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