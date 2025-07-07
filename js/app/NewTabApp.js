/**
 * Main application class for the New Tab page.
 * Orchestrates all services and components for the calendar interface.
 * 
 * @class NewTabApp
 * @description The primary application class that coordinates all services
 * including settings, calendar, rendering, and widget management.
 */
class NewTabApp {
    /**
     * Initializes a new NewTabApp instance.
     * Sets up all services and initializes the application state.
     * 
     * @constructor
     * @description Creates a new NewTabApp instance with all required services
     * and default configuration values.
     */
    constructor() {
        this.settingsService = new SettingsService();
        this.calendarService = new CalendarService();
        this.calendarRenderer = new CalendarRenderer();
        this.settingsModal = new SettingsModal(this.settingsService);
        this.widgetResizeService = new WidgetResizeService();
        
        this.currentDays = 7;
        this.isTraditionalView = true;
        this.useSampleData = false;
        this.expandCalendarDays = false;
        this.daysPerRow = 4;
        
        this.init();
    }

    /**
     * Initializes the application and sets up all components.
     * Loads settings, sets up UI, and starts the calendar display.
     * 
     * @async
     * @method init
     * @description Performs the complete application initialization including
     * settings loading, UI setup, widget initialization, and calendar loading.
     */
    async init() {
        console.log('Initializing NewTabApp...');
        
        // Load settings first
        await this.loadSettings();
        
        // Setup UI components
        this.setupEventListeners();
        this.updateTime();
        
        // Initialize widget resize functionality
        this.widgetResizeService.init();
        
        // Make widget resize service globally accessible
        window.widgetResizeService = this.widgetResizeService;
        
        // Load calendar data
        await this.loadCalendar();
        
        // Start time updates
        this.startTimeUpdates();
        
        console.log('NewTabApp initialization complete');
    }

    /**
     * Loads user settings from storage and applies them.
     * Updates the application state with saved preferences.
     * 
     * @async
     * @method loadSettings
     * @description Loads all user settings from storage and updates
     * the application state and UI accordingly.
     */
    async loadSettings() {
        try {
            const settings = await this.settingsService.loadSettings();
            this.currentDays = settings.calendarDays;
            this.isTraditionalView = settings.calendarView;
            this.useSampleData = settings.useSampleData;
            this.expandCalendarDays = settings.expandCalendarDays;
            this.daysPerRow = settings.daysPerRow;
            
            // Update UI to reflect settings
            this.updateUIFromSettings();
            
            console.log('Settings loaded:', settings);
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    /**
     * Updates the UI elements to reflect current settings.
     * Synchronizes the interface with the application state.
     * 
     * @method updateUIFromSettings
     * @description Updates all UI elements to match the current
     * application settings and state.
     */
    updateUIFromSettings() {
        // Update days select
        const daysSelect = document.getElementById('daysSelect');
        if (daysSelect) {
            daysSelect.value = this.currentDays;
        }
        
        // Update view toggle icon
        this.calendarRenderer.updateViewToggleIcon(this.isTraditionalView);
        
        // Update sample data toggle
        const useSampleDataToggle = document.getElementById('useSampleData');
        if (useSampleDataToggle) {
            useSampleDataToggle.checked = this.useSampleData;
        }
        
        // Update expand calendar days toggle
        const expandCalendarDaysToggle = document.getElementById('expandCalendarDays');
        if (expandCalendarDaysToggle) {
            expandCalendarDaysToggle.checked = this.expandCalendarDays;
        }
        
        // Update days per row select
        const daysPerRowSelect = document.getElementById('daysPerRow');
        if (daysPerRowSelect) {
            daysPerRowSelect.value = this.daysPerRow;
        }
    }

    /**
     * Sets up all event listeners for user interactions.
     * Configures handlers for calendar controls and settings changes.
     * 
     * @method setupEventListeners
     * @description Sets up event listeners for all interactive elements
     * including dropdowns, buttons, and settings modal interactions.
     */
    setupEventListeners() {
        // Calendar controls
        const daysSelect = document.getElementById('daysSelect');
        const refreshBtn = document.getElementById('refreshBtn');
        const viewToggleBtn = document.getElementById('viewToggleBtn');

        if (daysSelect) {
            daysSelect.addEventListener('change', (e) => {
                this.currentDays = parseInt(e.target.value);
                this.saveSettings();
                this.loadCalendar();
            });
        }

        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadCalendar();
            });
        }

        if (viewToggleBtn) {
            viewToggleBtn.addEventListener('click', () => {
                this.isTraditionalView = !this.isTraditionalView;
                this.calendarRenderer.updateViewToggleIcon(this.isTraditionalView);
                this.saveSettings();
                this.loadCalendar();
            });
        }

        // Listen for settings changes from modal
        document.addEventListener('settingsChanged', (e) => {
            if (e.detail.useSampleData !== undefined) {
                this.useSampleData = e.detail.useSampleData;
            }
            if (e.detail.expandCalendarDays !== undefined) {
                this.expandCalendarDays = e.detail.expandCalendarDays;
            }
            if (e.detail.daysPerRow !== undefined) {
                this.daysPerRow = e.detail.daysPerRow;
            }
            this.loadCalendar();
        });
    }

    /**
     * Saves current application settings to storage.
     * Persists user preferences for future sessions.
     * 
     * @async
     * @method saveSettings
     * @description Saves the current application state to storage
     * for persistence across browser sessions.
     */
    async saveSettings() {
        try {
            await this.settingsService.saveSettings({
                calendarDays: this.currentDays,
                calendarView: this.isTraditionalView,
                useSampleData: this.useSampleData,
                expandCalendarDays: this.expandCalendarDays,
                daysPerRow: this.daysPerRow
            });
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    /**
     * Loads and displays calendar events.
     * Fetches events and renders them using the calendar renderer.
     * 
     * @async
     * @method loadCalendar
     * @description Loads calendar events based on current settings
     * and renders them using the appropriate calendar renderer.
     */
    async loadCalendar() {
        const calendarContent = document.getElementById('calendarContent');
        if (!calendarContent) return;

        calendarContent.innerHTML = '<div class="loading">Loading calendar...</div>';

        try {
            console.log('Loading calendar with useSampleData:', this.useSampleData);
            
            const events = await this.calendarService.getEvents(this.currentDays, this.useSampleData);
            console.log('Loaded', events.length, 'events');
            
            // Update renderer config
            this.calendarRenderer.setConfig(this.currentDays, this.isTraditionalView, this.expandCalendarDays, this.daysPerRow);
            
            // Render calendar
            this.calendarRenderer.renderCalendar(events, 'calendarContent');
            
        } catch (error) {
            console.error('Error loading calendar:', error);
            this.showError('Failed to load calendar events. Please try again.');
        }
    }

    /**
     * Updates the time display in the UI.
     * Refreshes the current time and date display.
     * 
     * @method updateTime
     * @description Updates the time display element with the current
     * time and date in a user-friendly format.
     */
    updateTime() {
        TimeUtils.updateTimeDisplay();
    }

    /**
     * Starts the periodic time updates.
     * Sets up an interval to update the time display every minute.
     * 
     * @method startTimeUpdates
     * @description Initiates periodic time updates to keep the
     * time display current.
     */
    startTimeUpdates() {
        // Update time every minute
        setInterval(() => this.updateTime(), 60000);
    }

    /**
     * Displays an error message in the calendar area.
     * Shows user-friendly error messages when operations fail.
     * 
     * @method showError
     * @param {string} message - Error message to display
     * @description Displays an error message in the calendar content
     * area when calendar operations fail.
     */
    showError(message) {
        const calendarContent = document.getElementById('calendarContent');
        if (calendarContent) {
            calendarContent.innerHTML = `<div class="error-message">${message}</div>`;
        }
    }
} 