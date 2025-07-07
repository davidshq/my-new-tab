/**
 * Component class for managing the settings modal dialog.
 * Handles settings interface and user interactions.
 * 
 * @class SettingsModal
 * @description Provides a modal interface for managing application
 * settings and user preferences.
 */
class SettingsModal {
    /**
     * Initializes a new SettingsModal instance.
     * Sets up the modal with settings service integration.
     * 
     * @constructor
     * @param {SettingsService} settingsService - Service for managing settings
     * @description Creates a new SettingsModal instance with
     * settings service integration and modal state management.
     */
    constructor(settingsService) {
        this.settingsService = settingsService;
        this.modal = document.getElementById('settingsModal');
        this.isOpen = false;
        this.init();
    }

    /**
     * Initializes the settings modal functionality.
     * Sets up event listeners for modal interactions.
     * 
     * @method init
     * @description Sets up the complete modal functionality including
     * event listeners and user interaction handling.
     */
    init() {
        this.setupEventListeners();
    }

    /**
     * Sets up all event listeners for modal interactions.
     * Configures handlers for buttons, toggles, and keyboard shortcuts.
     * 
     * @method setupEventListeners
     * @description Sets up event listeners for all interactive elements
     * in the settings modal including buttons, toggles, and keyboard shortcuts.
     */
    setupEventListeners() {
        const settingsBtn = document.getElementById('settingsBtn');
        const closeSettingsBtn = document.getElementById('closeSettingsBtn');
        const useSampleDataToggle = document.getElementById('useSampleData');
        const expandCalendarDaysToggle = document.getElementById('expandCalendarDays');

        settingsBtn.addEventListener('click', () => this.open());
        closeSettingsBtn.addEventListener('click', () => this.close());

        // Close modal when clicking outside
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Sample data toggle
        useSampleDataToggle.addEventListener('change', (e) => {
            this.onSampleDataToggle(e.target.checked);
        });

        // Expand calendar days toggle
        expandCalendarDaysToggle.addEventListener('change', (e) => {
            this.onExpandCalendarDaysToggle(e.target.checked);
        });

        // Days per row select
        const daysPerRowSelect = document.getElementById('daysPerRow');
        if (daysPerRowSelect) {
            daysPerRowSelect.addEventListener('change', (e) => {
                this.onDaysPerRowChange(parseInt(e.target.value));
            });
        }

        // Reset widget dimensions button
        const resetWidgetDimensionsBtn = document.getElementById('resetWidgetDimensions');
        if (resetWidgetDimensionsBtn) {
            resetWidgetDimensionsBtn.addEventListener('click', () => {
                this.onResetWidgetDimensions();
            });
        }
    }

    /**
     * Opens the settings modal dialog.
     * Displays the settings interface and prevents background scrolling.
     * 
     * @method open
     * @description Shows the settings modal and locks the background scroll.
     */
    open() {
        this.modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        this.isOpen = true;
    }

    /**
     * Closes the settings modal dialog.
     * Hides the settings interface and restores background scrolling.
     * 
     * @method close
     * @description Hides the settings modal and restores normal scrolling.
     */
    close() {
        this.modal.classList.remove('show');
        document.body.style.overflow = '';
        this.isOpen = false;
    }

    /**
     * Handles sample data toggle changes.
     * Updates the setting and notifies other components.
     * 
     * @async
     * @method onSampleDataToggle
     * @param {boolean} useSampleData - Whether to use sample data
     * @description Updates the sample data setting and dispatches
     * a custom event to notify other components of the change.
     */
    async onSampleDataToggle(useSampleData) {
        console.log('Sample data toggle changed to:', useSampleData);
        await this.settingsService.updateSetting('useSampleData', useSampleData);
        
        // Dispatch custom event for other components to listen to
        document.dispatchEvent(new CustomEvent('settingsChanged', {
            detail: { useSampleData }
        }));
    }

    /**
     * Handles expand calendar days toggle changes.
     * Updates the setting and notifies other components.
     * 
     * @async
     * @method onExpandCalendarDaysToggle
     * @param {boolean} expandCalendarDays - Whether to expand calendar days
     * @description Updates the expand calendar days setting and dispatches
     * a custom event to notify other components of the change.
     */
    async onExpandCalendarDaysToggle(expandCalendarDays) {
        console.log('Expand calendar days toggle changed to:', expandCalendarDays);
        await this.settingsService.updateSetting('expandCalendarDays', expandCalendarDays);
        
        // Dispatch custom event for other components to listen to
        document.dispatchEvent(new CustomEvent('settingsChanged', {
            detail: { expandCalendarDays }
        }));
    }

    /**
     * Handles days per row select changes.
     * Updates the setting and notifies other components.
     * 
     * @async
     * @method onDaysPerRowChange
     * @param {number} daysPerRow - Number of days to display per row
     * @description Updates the days per row setting and dispatches
     * a custom event to notify other components of the change.
     */
    async onDaysPerRowChange(daysPerRow) {
        console.log('Days per row changed to:', daysPerRow);
        await this.settingsService.updateSetting('daysPerRow', daysPerRow);
        
        // Dispatch custom event for other components to listen to
        document.dispatchEvent(new CustomEvent('settingsChanged', {
            detail: { daysPerRow }
        }));
    }

    /**
     * Handles widget dimensions reset.
     * Resets all widget dimensions to default values.
     * 
     * @async
     * @method onResetWidgetDimensions
     * @description Resets all widget dimensions to their default values
     * and reloads the page to apply the changes.
     */
    async onResetWidgetDimensions() {
        try {
            // Reset all widget dimensions
            const widgets = document.querySelectorAll('.widget');
            widgets.forEach(widget => {
                if (window.widgetResizeService) {
                    window.widgetResizeService.resetWidgetDimensions(widget.id);
                }
            });
            
            // Reload the page to apply changes
            window.location.reload();
        } catch (error) {
            console.error('Error resetting widget dimensions:', error);
        }
    }

    /**
     * Loads settings into the modal interface.
     * Updates UI elements to reflect current settings.
     * 
     * @async
     * @method loadSettings
     * @description Loads current settings from storage and updates
     * the modal UI elements to reflect the saved preferences.
     */
    async loadSettings() {
        try {
            const settings = await this.settingsService.loadSettings();
            document.getElementById('useSampleData').checked = settings.useSampleData;
            document.getElementById('expandCalendarDays').checked = settings.expandCalendarDays;
            document.getElementById('daysPerRow').value = settings.daysPerRow;
            console.log('Settings loaded in modal:', settings);
        } catch (error) {
            console.error('Error loading settings in modal:', error);
        }
    }
} 