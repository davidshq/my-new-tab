class NewTabPage {
    constructor() {
        this.calendarService = new GoogleCalendarService();
        this.currentDays = 7;
        this.isTraditionalView = true; // Default to traditional view
        this.useSampleData = false; // Default to real data
        this.init();
    }

    async init() {
        console.log('Initializing NewTabPage...');
        this.updateTime();
        this.setupEventListeners();
        console.log('Loading settings...');
        await this.loadSettings();
        console.log('Settings loaded, loading calendar...');
        await this.loadCalendar();
        console.log('Initialization complete');
        
        // Update time every minute
        setInterval(() => this.updateTime(), 60000);
    }

    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        const dateString = now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        document.getElementById('timeDisplay').textContent = `${timeString} • ${dateString}`;
    }

    setupEventListeners() {
        const daysSelect = document.getElementById('daysSelect');
        const refreshBtn = document.getElementById('refreshBtn');
        const viewToggleBtn = document.getElementById('viewToggleBtn');
        const settingsBtn = document.getElementById('settingsBtn');
        const closeSettingsBtn = document.getElementById('closeSettingsBtn');
        const settingsModal = document.getElementById('settingsModal');

        daysSelect.addEventListener('change', (e) => {
            this.currentDays = parseInt(e.target.value);
            this.saveSettings();
            this.loadCalendar();
        });

        refreshBtn.addEventListener('click', () => {
            this.loadCalendar();
        });

        viewToggleBtn.addEventListener('click', () => {
            this.isTraditionalView = !this.isTraditionalView;
            this.updateViewToggleIcon();
            this.saveSettings();
            this.loadCalendar();
        });

        // Settings modal functionality
        settingsBtn.addEventListener('click', () => {
            this.openSettings();
        });

        closeSettingsBtn.addEventListener('click', () => {
            this.closeSettings();
        });

        // Close modal when clicking outside
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) {
                this.closeSettings();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && settingsModal.classList.contains('show')) {
                this.closeSettings();
            }
        });

        // Sample data toggle
        const useSampleDataToggle = document.getElementById('useSampleData');
        useSampleDataToggle.addEventListener('change', (e) => {
            console.log('Sample data toggle changed to:', e.target.checked);
            this.useSampleData = e.target.checked;
            this.saveSettings();
            this.loadCalendar();
        });
    }

    openSettings() {
        const settingsModal = document.getElementById('settingsModal');
        settingsModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    closeSettings() {
        const settingsModal = document.getElementById('settingsModal');
        settingsModal.classList.remove('show');
        document.body.style.overflow = '';
    }

    async loadSettings() {
        try {
            const result = await chrome.storage.sync.get(['calendarDays', 'calendarView', 'useSampleData']);
            console.log('Loaded settings:', result);
            
            if (result.calendarDays) {
                this.currentDays = result.calendarDays;
                document.getElementById('daysSelect').value = this.currentDays;
            }
            if (result.calendarView !== undefined) {
                this.isTraditionalView = result.calendarView;
            }
            if (result.useSampleData !== undefined) {
                this.useSampleData = result.useSampleData;
                document.getElementById('useSampleData').checked = this.useSampleData;
                console.log('Set useSampleData to:', this.useSampleData);
            }
            this.updateViewToggleIcon();
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    async saveSettings() {
        try {
            await chrome.storage.sync.set({ 
                calendarDays: this.currentDays,
                calendarView: this.isTraditionalView,
                useSampleData: this.useSampleData
            });
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    async loadCalendar() {
        const calendarContent = document.getElementById('calendarContent');
        calendarContent.innerHTML = '<div class="loading">Loading calendar...</div>';

        console.log('Loading calendar with useSampleData:', this.useSampleData);

        try {
            let events;
            if (this.useSampleData) {
                console.log('Generating sample events...');
                events = this.generateSampleEvents();
                console.log('Generated', events.length, 'sample events');
            } else {
                console.log('Fetching real calendar events...');
                events = await this.calendarService.getEvents(this.currentDays);
                console.log('Fetched', events.length, 'real events');
            }
            this.renderCalendar(events);
        } catch (error) {
            console.error('Error loading calendar:', error);
            this.showError('Failed to load calendar events. Please try again.');
        }
    }

    updateViewToggleIcon() {
        const icon = document.getElementById('viewToggleIcon');
        if (this.isTraditionalView) {
            // Show agenda icon (list view)
            icon.innerHTML = '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>';
        } else {
            // Show calendar icon (grid view)
            icon.innerHTML = '<path d="M3 3h18v18H3zM8 12h8M12 8v8"/>';
        }
    }

    renderCalendar(events) {
        const calendarContent = document.getElementById('calendarContent');
        
        if (!events || events.length === 0) {
            calendarContent.innerHTML = '<div class="no-events">No upcoming events found.</div>';
            return;
        }

        // Group events by date
        const eventsByDate = this.groupEventsByDate(events);
        
        if (this.isTraditionalView) {
            const calendarHTML = this.renderTraditionalCalendar(eventsByDate);
            calendarContent.innerHTML = calendarHTML;
        } else {
            const calendarHTML = `
                <div class="calendar-grid">
                    ${Object.keys(eventsByDate).map(date => this.renderDay(date, eventsByDate[date])).join('')}
                </div>
            `;
            calendarContent.innerHTML = calendarHTML;
        }
    }

    renderTraditionalCalendar(eventsByDate) {
        // Only show the next X days, starting from today
        const daysToShow = this.currentDays;
        const today = new Date();
        const days = [];
        
        console.log('Rendering traditional calendar for', daysToShow, 'days');
        console.log('Available event dates:', Object.keys(eventsByDate));
        
        for (let i = 0; i < daysToShow; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const dateKey = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
            
            const hasEvents = eventsByDate[dateKey] && eventsByDate[dateKey].length > 0;
            const events = eventsByDate[dateKey] || [];
            
            console.log('Day', i + 1, 'dateKey:', dateKey, 'hasEvents:', hasEvents, 'eventCount:', events.length);
            
            days.push({
                date,
                dateKey,
                hasEvents,
                events
            });
        }
        return `
            <div class="traditional-calendar single-row-calendar">
                <div class="calendar-days-row">
                    ${days.map(dayData => this.renderCalendarDay(dayData)).join('')}
                </div>
            </div>
        `;
    }

    renderWeek(week) {
        return `
            <div class="calendar-week">
                ${week.map(dayData => this.renderCalendarDay(dayData)).join('')}
            </div>
        `;
    }

    renderCalendarDay(dayData) {
        const { date, dateKey, hasEvents, events } = dayData;
        const isToday = this.isToday(date);
        const isCurrentMonth = this.isCurrentMonth(date);
        
        const dayNumber = date.getDate();
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        let eventsHTML = '';
        if (hasEvents) {
            eventsHTML = `
                <div class="calendar-day-events">
                    ${events.slice(0, 2).map(event => this.renderCalendarEvent(event, dateKey)).join('')}
                    ${events.length > 2 ? `<div class="more-events">+${events.length - 2} more</div>` : ''}
                </div>
            `;
        }

        return `
            <div class="calendar-day-cell ${isToday ? 'today' : ''} ${!isCurrentMonth ? 'other-month' : ''} ${hasEvents ? 'has-events' : ''}">
                <div class="calendar-day-header">
                    <div class="calendar-day-number">${dayNumber}</div>
                    <div class="calendar-day-name">${dayName}</div>
                </div>
                ${eventsHTML}
            </div>
        `;
    }

    renderCalendarEvent(event, dateKey) {
        const startTime = new Date(event.start.dateTime || event.start.date);
        const isAllDay = !event.start.dateTime;
        
        let timeString = '';
        if (!isAllDay) {
            timeString = startTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        }

        return `
            <div class="calendar-event-item ${isAllDay ? 'all-day' : ''}">
                <div class="calendar-event-time">${isAllDay ? 'All day' : timeString}</div>
                <div class="calendar-event-title">${event.summary}</div>
            </div>
        `;
    }

    isToday(date) {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    }

    isCurrentMonth(date) {
        const today = new Date();
        return date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    }

    groupEventsByDate(events) {
        const grouped = {};
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Start of today
        
        console.log('Grouping events:', events.length, 'events');
        console.log('Today:', today.toISOString());
        
        events.forEach(event => {
            const startDate = new Date(event.start.dateTime || event.start.date);
            const endDate = new Date(event.end.dateTime || event.end.date);
            
            console.log('Processing event:', event.summary, 'start:', startDate.toISOString(), 'end:', endDate.toISOString());
            
            // For all-day events, the end date is exclusive, so we need to adjust
            if (event.start.date) {
                // All-day event: end date is exclusive, so subtract one day
                endDate.setDate(endDate.getDate() - 1);
            }
            
            // Generate all dates this event spans
            const eventDates = [];
            const currentDate = new Date(startDate);
            
            while (currentDate <= endDate) {
                // Only include dates that are today or in the future
                if (currentDate >= today) {
                    const dateKey = currentDate.getFullYear() + '-' + 
                                  String(currentDate.getMonth() + 1).padStart(2, '0') + '-' + 
                                  String(currentDate.getDate()).padStart(2, '0');
                    eventDates.push(dateKey);
                    console.log('Added date key:', dateKey);
                } else {
                    console.log('Skipped date:', currentDate.toISOString(), 'because it\'s before today');
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }
            
            // Add event to each relevant date
            eventDates.forEach(dateKey => {
                if (!grouped[dateKey]) {
                    grouped[dateKey] = [];
                }
                grouped[dateKey].push(event);
            });
        });

        // Sort events within each date by start time
        Object.keys(grouped).forEach(date => {
            grouped[date].sort((a, b) => {
                const timeA = new Date(a.start.dateTime || a.start.date);
                const timeB = new Date(b.start.dateTime || b.start.date);
                return timeA - timeB;
            });
        });

        return grouped;
    }

    renderDay(dateString, events) {
        // For all-day events, dateString is YYYY-MM-DD and should be interpreted as local time
        // For timed events, dateString is also YYYY-MM-DD
        // Always construct the date as local time
        const [year, month, day] = dateString.split('-');
        const date = new Date(Number(year), Number(month) - 1, Number(day));
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dayDate = date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });

        const eventsHTML = events.map(event => this.renderEvent(event, dateString)).join('');

        return `
            <div class="calendar-day">
                <div class="day-header">
                    <div class="day-date">${dayDate}</div>
                    <div class="day-name">${dayName}</div>
                </div>
                <div class="events-list">
                    ${eventsHTML}
                </div>
            </div>
        `;
    }

    renderEvent(event, currentDateString) {
        const startTime = new Date(event.start.dateTime || event.start.date);
        const endTime = new Date(event.end.dateTime || event.end.date);
        
        // For all-day events, the end date is exclusive, so we need to adjust
        if (event.start.date) {
            endTime.setDate(endTime.getDate() - 1);
        }
        
        // Parse current date to compare with event dates
        const [year, month, day] = currentDateString.split('-');
        const currentDate = new Date(Number(year), Number(month) - 1, Number(day));
        
        let timeString = '';
        let isFirstDay = false;
        let isLastDay = false;
        
        if (event.start.dateTime) {
            // Timed event
            const currentDateStart = new Date(currentDate);
            const currentDateEnd = new Date(currentDate);
            currentDateEnd.setDate(currentDateEnd.getDate() + 1);
            
            isFirstDay = startTime >= currentDateStart && startTime < currentDateEnd;
            isLastDay = endTime > currentDateStart && endTime <= currentDateEnd;
            
            if (isFirstDay && isLastDay) {
                // Event starts and ends on the same day
                timeString = `${startTime.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                })} - ${endTime.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                })}`;
            } else if (isFirstDay) {
                // Event starts on this day
                timeString = `${startTime.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                })} - ...`;
            } else if (isLastDay) {
                // Event ends on this day
                timeString = `... - ${endTime.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                })}`;
            } else {
                // Event spans through this day (middle day)
                timeString = 'All day';
            }
        } else {
            // All-day event
            const currentDateStart = new Date(currentDate);
            const currentDateEnd = new Date(currentDate);
            currentDateEnd.setDate(currentDateEnd.getDate() + 1);
            
            isFirstDay = startTime >= currentDateStart && startTime < currentDateEnd;
            isLastDay = endTime >= currentDateStart && endTime < currentDateEnd;
            
            if (isFirstDay && isLastDay) {
                // Single day all-day event
                timeString = 'All day';
            } else if (isFirstDay) {
                // Multi-day event starts on this day
                timeString = 'All day (starts)';
            } else if (isLastDay) {
                // Multi-day event ends on this day
                timeString = 'All day (ends)';
            } else {
                // Multi-day event spans through this day
                timeString = 'All day';
            }
        }

        return `
            <div class="event-item">
                <div class="event-time">${timeString}</div>
                <div class="event-title">${event.summary}</div>
                ${event.location ? `<div class="event-location">📍 ${event.location}</div>` : ''}
            </div>
        `;
    }

    showError(message) {
        const calendarContent = document.getElementById('calendarContent');
        calendarContent.innerHTML = `<div class="error-message">${message}</div>`;
    }

    generateSampleEvents() {
        const events = [];
        const today = new Date();
        
        // Sample event templates
        const sampleEvents = [
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
        ];

        // Generate events for the next X days based on currentDays setting
        for (let i = 0; i < this.currentDays; i++) {
            const eventDate = new Date(today);
            eventDate.setDate(today.getDate() + i);
            
            // Add 1-3 random events per day
            const eventsForDay = Math.floor(Math.random() * 3) + 1;
            for (let j = 0; j < eventsForDay; j++) {
                const eventIndex = Math.floor(Math.random() * sampleEvents.length);
                const sampleEvent = sampleEvents[eventIndex];
                
                // Create a new event with the current date
                const newEvent = {
                    ...sampleEvent,
                    start: { ...sampleEvent.start },
                    end: { ...sampleEvent.end }
                };

                // Adjust the date to match the current day
                if (newEvent.start.dateTime) {
                    const startDate = new Date(newEvent.start.dateTime);
                    startDate.setFullYear(eventDate.getFullYear());
                    startDate.setMonth(eventDate.getMonth());
                    startDate.setDate(eventDate.getDate());
                    newEvent.start.dateTime = startDate.toISOString();

                    const endDate = new Date(newEvent.end.dateTime);
                    endDate.setFullYear(eventDate.getFullYear());
                    endDate.setMonth(eventDate.getMonth());
                    endDate.setDate(eventDate.getDate());
                    newEvent.end.dateTime = endDate.toISOString();
                } else if (newEvent.start.date) {
                    newEvent.start.date = eventDate.toISOString().split('T')[0];
                    newEvent.end.date = eventDate.toISOString().split('T')[0];
                }

                events.push(newEvent);
            }
        }

        // Sort events by start time
        return events.sort((a, b) => {
            const aTime = a.start.dateTime || a.start.date;
            const bTime = b.start.dateTime || b.start.date;
            return new Date(aTime) - new Date(bTime);
        });
    }
}

class GoogleCalendarService {
    constructor() {
        this.isAuthenticated = false;
    }

    async authenticate() {
        try {
            const token = await this.getAuthToken();
            this.isAuthenticated = !!token;
            return this.isAuthenticated;
        } catch (error) {
            console.error('Authentication error:', error);
            return false;
        }
    }

    async getAuthToken() {
        return new Promise((resolve, reject) => {
            chrome.identity.getAuthToken({ interactive: true }, (token) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(token);
                }
            });
        });
    }

    async getEvents(days = 7) {
        const isAuthenticated = await this.authenticate();
        if (!isAuthenticated) {
            throw new Error('Authentication required');
        }

        const token = await this.getAuthToken();
        const now = new Date();
        const endDate = new Date();
        endDate.setDate(now.getDate() + days);

        console.log('Fetching events for', days, 'days from', now.toISOString(), 'to', endDate.toISOString());

        const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
            `timeMin=${now.toISOString()}&` +
            `timeMax=${endDate.toISOString()}&` +
            `singleEvents=true&` +
            `orderBy=startTime&` +
            `maxResults=1000`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Google Calendar API returned', data.items ? data.items.length : 0, 'events');
        return data.items || [];
    }
}

// Initialize the new tab page when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NewTabPage();
}); 