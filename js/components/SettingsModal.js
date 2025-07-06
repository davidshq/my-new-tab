class SettingsModal {
    constructor(settingsService) {
        this.settingsService = settingsService;
        this.modal = document.getElementById('settingsModal');
        this.isOpen = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

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

    open() {
        this.modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        this.isOpen = true;
    }

    close() {
        this.modal.classList.remove('show');
        document.body.style.overflow = '';
        this.isOpen = false;
    }

    async onSampleDataToggle(useSampleData) {
        console.log('Sample data toggle changed to:', useSampleData);
        await this.settingsService.updateSetting('useSampleData', useSampleData);
        
        // Dispatch custom event for other components to listen to
        document.dispatchEvent(new CustomEvent('settingsChanged', {
            detail: { useSampleData }
        }));
    }

    async onExpandCalendarDaysToggle(expandCalendarDays) {
        console.log('Expand calendar days toggle changed to:', expandCalendarDays);
        await this.settingsService.updateSetting('expandCalendarDays', expandCalendarDays);
        
        // Dispatch custom event for other components to listen to
        document.dispatchEvent(new CustomEvent('settingsChanged', {
            detail: { expandCalendarDays }
        }));
    }

    async onDaysPerRowChange(daysPerRow) {
        console.log('Days per row changed to:', daysPerRow);
        await this.settingsService.updateSetting('daysPerRow', daysPerRow);
        
        // Dispatch custom event for other components to listen to
        document.dispatchEvent(new CustomEvent('settingsChanged', {
            detail: { daysPerRow }
        }));
    }

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