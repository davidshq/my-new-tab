class NewTabPage {
    constructor() {
        this.calendarService = new GoogleCalendarService();
        this.keepService = new GoogleKeepService();
        this.currentDays = 7;
        this.isTraditionalView = true; // Default to traditional view
        this.useSampleData = false; // Default to real data
        this.init();
    }

    async init() {
        this.updateTime();
        this.setupEventListeners();
        this.loadSettings();
        await this.loadCalendar();
        await this.loadKeep();
        
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
            this.useSampleData = e.target.checked;
            this.saveSettings();
            this.loadCalendar();
        });

        // Keep authentication button
        const keepAuthBtn = document.getElementById('keepAuthBtn');
        keepAuthBtn.addEventListener('click', () => {
            this.authenticateKeep();
        });

        // Keep refresh button
        const keepRefreshBtn = document.getElementById('keepRefreshBtn');
        keepRefreshBtn.addEventListener('click', () => {
            this.loadKeep();
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

        try {
            let events;
            if (this.useSampleData) {
                events = this.generateSampleEvents();
            } else {
                events = await this.calendarService.getEvents(this.currentDays);
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
        for (let i = 0; i < daysToShow; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const dateKey = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
            days.push({
                date,
                dateKey,
                hasEvents: eventsByDate[dateKey] && eventsByDate[dateKey].length > 0,
                events: eventsByDate[dateKey] || []
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

    async authenticateKeep() {
        const keepContent = document.getElementById('keepContent');
        keepContent.innerHTML = '<div class="loading">Authenticating with Google Keep...</div>';

        try {
            const isAuthenticated = await this.keepService.authenticate();
            if (isAuthenticated) {
                await this.loadKeep();
            } else {
                keepContent.innerHTML = '<div class="error-message">Authentication failed. Please try again.</div>';
            }
        } catch (error) {
            console.error('Keep authentication error:', error);
            keepContent.innerHTML = '<div class="error-message">Authentication failed: ' + error.message + '</div>';
        }
    }

    async loadKeep() {
        const keepContent = document.getElementById('keepContent');
        keepContent.innerHTML = '<div class="loading">Loading Keep notes...</div>';

        try {
            // Try to load existing tokens first
            const hasTokens = await this.keepService.loadTokens();
            
            if (!hasTokens) {
                keepContent.innerHTML = '<div class="no-notes">Not authenticated. Click the authenticate button to connect to Google Keep.</div>';
                return;
            }

            const notes = await this.keepService.getNotes({ pageSize: 10 });
            this.renderKeepNotes(notes);
        } catch (error) {
            console.error('Error loading Keep notes:', error);
            if (error.message.includes('Authentication required')) {
                keepContent.innerHTML = '<div class="no-notes">Not authenticated. Click the authenticate button to connect to Google Keep.</div>';
            } else {
                keepContent.innerHTML = '<div class="error-message">Failed to load Keep notes: ' + error.message + '</div>';
            }
        }
    }

    renderKeepNotes(notesData) {
        const keepContent = document.getElementById('keepContent');
        
        if (!notesData.notes || notesData.notes.length === 0) {
            keepContent.innerHTML = '<div class="no-notes">No notes found in Google Keep.</div>';
            return;
        }

        const notesHTML = notesData.notes.map(note => this.renderKeepNote(note)).join('');
        keepContent.innerHTML = `
            <div class="keep-notes">
                ${notesHTML}
            </div>
        `;
    }

    renderKeepNote(note) {
        const title = note.title || 'Untitled Note';
        const content = note.textContent || '';
        const color = note.color || 'default';
        const isPinned = note.trashed === false && note.pinned === true;
        
        // Truncate content for display
        const truncatedContent = content.length > 100 ? content.substring(0, 100) + '...' : content;
        
        return `
            <div class="keep-note ${color} ${isPinned ? 'pinned' : ''}">
                <div class="note-header">
                    <h3 class="note-title">${this.escapeHtml(title)}</h3>
                    ${isPinned ? '<span class="pin-indicator">📌</span>' : ''}
                </div>
                ${content ? `<div class="note-content">${this.escapeHtml(truncatedContent)}</div>` : ''}
                <div class="note-footer">
                    <span class="note-date">${this.formatNoteDate(note.userEditedTimestampUsec)}</span>
                </div>
            </div>
        `;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatNoteDate(timestampUsec) {
        if (!timestampUsec) return '';
        
        const timestamp = parseInt(timestampUsec) / 1000000; // Convert microseconds to seconds
        const date = new Date(timestamp * 1000);
        
        const now = new Date();
        const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        
        if (diffInDays === 0) {
            return 'Today';
        } else if (diffInDays === 1) {
            return 'Yesterday';
        } else if (diffInDays < 7) {
            return diffInDays + ' days ago';
        } else {
            return date.toLocaleDateString();
        }
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
        return data.items || [];
    }
}

class GoogleKeepService {
    constructor() {
        this.backendUrl = 'https://mnt.eccentricquality.com'; // Replace with your actual worker URL
        this.isAuthenticated = false;
        this.accessToken = null;
        this.refreshToken = null;
        this.tokenExpiry = null;
    }

    async authenticate() {
        try {
            // Check if we have a valid token
            if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
                this.isAuthenticated = true;
                return true;
            }

            // Try to refresh token if we have one
            if (this.refreshToken) {
                const refreshed = await this.refreshAccessToken();
                if (refreshed) {
                    return true;
                }
            }

            // Start OAuth flow
            return await this.startOAuthFlow();
        } catch (error) {
            console.error('Keep authentication error:', error);
            return false;
        }
    }

    async startOAuthFlow() {
        try {
            // Get OAuth URL from backend
            const response = await fetch(`${this.backendUrl}/auth/google?state=${crypto.randomUUID()}`);
            const data = await response.json();

            if (!data.authUrl) {
                throw new Error('Failed to get OAuth URL');
            }

            // Open OAuth popup
            const popup = window.open(
                data.authUrl,
                'google-oauth',
                'width=500,height=600,scrollbars=yes,resizable=yes'
            );

            // Wait for OAuth completion
            return new Promise((resolve, reject) => {
                const checkClosed = setInterval(() => {
                    if (popup.closed) {
                        clearInterval(checkClosed);
                        reject(new Error('OAuth popup was closed'));
                    }
                }, 1000);

                // Listen for message from popup
                const messageListener = (event) => {
                    if (event.origin !== this.backendUrl) return;
                    
                    if (event.data.type === 'OAUTH_SUCCESS') {
                        clearInterval(checkClosed);
                        window.removeEventListener('message', messageListener);
                        popup.close();
                        
                        this.accessToken = event.data.access_token;
                        this.refreshToken = event.data.refresh_token;
                        this.tokenExpiry = new Date(Date.now() + (event.data.expires_in * 1000));
                        this.isAuthenticated = true;
                        
                        // Store tokens securely
                        this.storeTokens();
                        resolve(true);
                    } else if (event.data.type === 'OAUTH_ERROR') {
                        clearInterval(checkClosed);
                        window.removeEventListener('message', messageListener);
                        popup.close();
                        reject(new Error(event.data.error));
                    }
                };

                window.addEventListener('message', messageListener);
            });

        } catch (error) {
            console.error('OAuth flow error:', error);
            return false;
        }
    }

    async refreshAccessToken() {
        try {
            const response = await fetch(`${this.backendUrl}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    refresh_token: this.refreshToken,
                }),
            });

            const data = await response.json();

            if (data.success) {
                this.accessToken = data.access_token;
                this.tokenExpiry = new Date(Date.now() + (data.expires_in * 1000));
                this.isAuthenticated = true;
                this.storeTokens();
                return true;
            }

            return false;
        } catch (error) {
            console.error('Token refresh error:', error);
            return false;
        }
    }

    async getNotes(options = {}) {
        const isAuthenticated = await this.authenticate();
        if (!isAuthenticated) {
            throw new Error('Authentication required for Keep');
        }

        const params = new URLSearchParams();
        if (options.pageSize) params.set('pageSize', options.pageSize);
        if (options.pageToken) params.set('pageToken', options.pageToken);
        if (options.filter) params.set('filter', options.filter);

        const response = await fetch(`${this.backendUrl}/api/keep/notes?${params}`, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Keep API error: ${response.status}`);
        }

        return await response.json();
    }

    async getLabels() {
        const isAuthenticated = await this.authenticate();
        if (!isAuthenticated) {
            throw new Error('Authentication required for Keep');
        }

        const response = await fetch(`${this.backendUrl}/api/keep/labels`, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Keep API error: ${response.status}`);
        }

        return await response.json();
    }

    storeTokens() {
        // Store tokens in chrome.storage.sync for persistence
        chrome.storage.sync.set({
            keepAccessToken: this.accessToken,
            keepRefreshToken: this.refreshToken,
            keepTokenExpiry: this.tokenExpiry?.toISOString(),
        });
    }

    async loadTokens() {
        try {
            const result = await chrome.storage.sync.get([
                'keepAccessToken',
                'keepRefreshToken',
                'keepTokenExpiry',
            ]);

            if (result.keepAccessToken && result.keepRefreshToken && result.keepTokenExpiry) {
                this.accessToken = result.keepAccessToken;
                this.refreshToken = result.keepRefreshToken;
                this.tokenExpiry = new Date(result.keepTokenExpiry);
                
                // Check if token is still valid
                if (new Date() < this.tokenExpiry) {
                    this.isAuthenticated = true;
                    return true;
                }
            }

            return false;
        } catch (error) {
            console.error('Error loading tokens:', error);
            return false;
        }
    }

    async logout() {
        this.accessToken = null;
        this.refreshToken = null;
        this.tokenExpiry = null;
        this.isAuthenticated = false;
        
        await chrome.storage.sync.remove([
            'keepAccessToken',
            'keepRefreshToken',
            'keepTokenExpiry',
        ]);
    }
}

// Initialize the new tab page when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NewTabPage();
}); 