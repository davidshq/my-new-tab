class NewTabPage {
    constructor() {
        this.calendarService = new GoogleCalendarService();
        this.currentDays = 7;
        this.init();
    }

    async init() {
        this.updateTime();
        this.setupEventListeners();
        this.loadSettings();
        await this.loadCalendar();
        
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

        daysSelect.addEventListener('change', (e) => {
            this.currentDays = parseInt(e.target.value);
            this.saveSettings();
            this.loadCalendar();
        });

        refreshBtn.addEventListener('click', () => {
            this.loadCalendar();
        });
    }

    async loadSettings() {
        try {
            const result = await chrome.storage.sync.get(['calendarDays']);
            if (result.calendarDays) {
                this.currentDays = result.calendarDays;
                document.getElementById('daysSelect').value = this.currentDays;
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    async saveSettings() {
        try {
            await chrome.storage.sync.set({ calendarDays: this.currentDays });
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    async loadCalendar() {
        const calendarContent = document.getElementById('calendarContent');
        calendarContent.innerHTML = '<div class="loading">Loading calendar...</div>';

        try {
            const events = await this.calendarService.getEvents(this.currentDays);
            this.renderCalendar(events);
        } catch (error) {
            console.error('Error loading calendar:', error);
            this.showError('Failed to load calendar events. Please try again.');
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
        
        const calendarHTML = `
            <div class="calendar-grid">
                ${Object.keys(eventsByDate).map(date => this.renderDay(date, eventsByDate[date])).join('')}
            </div>
        `;
        
        calendarContent.innerHTML = calendarHTML;
    }

    groupEventsByDate(events) {
        const grouped = {};
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Start of today
        
        events.forEach(event => {
            const startDate = new Date(event.start.dateTime || event.start.date);
            const endDate = new Date(event.end.dateTime || event.end.date);
            
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

        const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
            `timeMin=${now.toISOString()}&` +
            `timeMax=${endDate.toISOString()}&` +
            `singleEvents=true&` +
            `orderBy=startTime&` +
            `maxResults=100`;

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
        return data.items || [];
    }
}

// Initialize the new tab page when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NewTabPage();
}); 