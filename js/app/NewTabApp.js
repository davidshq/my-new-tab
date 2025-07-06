class NewTabApp {
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
        
        this.init();
    }

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

    async loadSettings() {
        try {
            const settings = await this.settingsService.loadSettings();
            this.currentDays = settings.calendarDays;
            this.isTraditionalView = settings.calendarView;
            this.useSampleData = settings.useSampleData;
            this.expandCalendarDays = settings.expandCalendarDays;
            
            // Update UI to reflect settings
            this.updateUIFromSettings();
            
            console.log('Settings loaded:', settings);
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

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
    }

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
            this.loadCalendar();
        });
    }

    async saveSettings() {
        try {
            await this.settingsService.saveSettings({
                calendarDays: this.currentDays,
                calendarView: this.isTraditionalView,
                useSampleData: this.useSampleData,
                expandCalendarDays: this.expandCalendarDays
            });
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    async loadCalendar() {
        const calendarContent = document.getElementById('calendarContent');
        if (!calendarContent) return;

        calendarContent.innerHTML = '<div class="loading">Loading calendar...</div>';

        try {
            console.log('Loading calendar with useSampleData:', this.useSampleData);
            
            const events = await this.calendarService.getEvents(this.currentDays, this.useSampleData);
            console.log('Loaded', events.length, 'events');
            
            // Update renderer config
            this.calendarRenderer.setConfig(this.currentDays, this.isTraditionalView, this.expandCalendarDays);
            
            // Render calendar
            this.calendarRenderer.renderCalendar(events, 'calendarContent');
            
        } catch (error) {
            console.error('Error loading calendar:', error);
            this.showError('Failed to load calendar events. Please try again.');
        }
    }

    updateTime() {
        TimeUtils.updateTimeDisplay();
    }

    startTimeUpdates() {
        // Update time every minute
        setInterval(() => this.updateTime(), 60000);
    }

    showError(message) {
        const calendarContent = document.getElementById('calendarContent');
        if (calendarContent) {
            calendarContent.innerHTML = `<div class="error-message">${message}</div>`;
        }
    }
} 