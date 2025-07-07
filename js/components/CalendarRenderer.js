/**
 * Component class for rendering calendar displays.
 * Handles different calendar view modes and event rendering.
 * 
 * @class CalendarRenderer
 * @description Provides rendering functionality for different calendar
 * view modes including traditional and agenda layouts.
 */
class CalendarRenderer {
    /**
     * Initializes a new CalendarRenderer instance.
     * Sets up default configuration for calendar rendering.
     * 
     * @constructor
     * @description Creates a new CalendarRenderer instance with
     * default configuration values.
     */
    constructor() {
        this.currentDays = 7;
        this.isTraditionalView = true;
        this.expandCalendarDays = false;
        this.daysPerRow = 4;
    }

    /**
     * Sets the configuration for calendar rendering.
     * Updates renderer settings for different view modes.
     * 
     * @method setConfig
     * @param {number} days - Number of days to display
     * @param {boolean} isTraditionalView - Whether to use traditional view
     * @param {boolean} expandCalendarDays - Whether to expand calendar days
     * @param {number} daysPerRow - Number of days per row in traditional view
     * @description Updates the renderer configuration with new settings
     * for calendar display options.
     */
    setConfig(days, isTraditionalView, expandCalendarDays = false, daysPerRow = 4) {
        this.currentDays = days;
        this.isTraditionalView = isTraditionalView;
        this.expandCalendarDays = expandCalendarDays;
        this.daysPerRow = daysPerRow;
    }

    /**
     * Renders the calendar with the provided events.
     * Displays events in either traditional or agenda view format.
     * 
     * @method renderCalendar
     * @param {Array} events - Array of calendar events to display
     * @param {string} containerId - ID of the container element
     * @description Renders the calendar interface with the provided events,
     * grouping them by date and applying the current view mode.
     */
    renderCalendar(events, containerId) {
        const container = document.getElementById(containerId);
        
        if (!events || events.length === 0) {
            container.innerHTML = '<div class="no-events">No upcoming events found.</div>';
            return;
        }

        // Group events by date
        const eventsByDate = this.groupEventsByDate(events);
        
        if (this.isTraditionalView) {
            const calendarHTML = this.renderTraditionalCalendar(eventsByDate);
            container.innerHTML = calendarHTML;
        } else {
            const calendarHTML = `
                <div class="calendar-grid">
                    ${Object.keys(eventsByDate).map(date => this.renderDay(date, eventsByDate[date])).join('')}
                </div>
            `;
            container.innerHTML = calendarHTML;
        }
    }

    /**
     * Renders the traditional calendar view.
     * Creates a grid layout of calendar days with events.
     * 
     * @method renderTraditionalCalendar
     * @param {Object} eventsByDate - Events grouped by date
     * @returns {string} HTML string for the traditional calendar view
     * @description Generates the traditional calendar layout showing days
     * in a grid format with event indicators.
     */
    renderTraditionalCalendar(eventsByDate) {
        // Only show the next X days, starting from today
        const daysToShow = this.currentDays;
        const today = new Date();
        const days = [];
        
        for (let i = 0; i < daysToShow; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const dateKey = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
            
            const hasEvents = eventsByDate[dateKey] && eventsByDate[dateKey].length > 0;
            const events = eventsByDate[dateKey] || [];
            
            days.push({
                date,
                dateKey,
                hasEvents,
                events
            });
        }

        // Split days into rows based on daysPerRow setting
        const rows = [];
        for (let i = 0; i < days.length; i += this.daysPerRow) {
            rows.push(days.slice(i, i + this.daysPerRow));
        }

        return `
            <div class="traditional-calendar">
                ${rows.map(row => `
                    <div class="calendar-days-row" style="grid-template-columns: repeat(${this.daysPerRow}, 1fr);">
                        ${row.map(dayData => this.renderCalendarDay(dayData)).join('')}
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Renders a single calendar day cell.
     * Creates a day cell with date, name, and event indicators.
     * 
     * @method renderCalendarDay
     * @param {Object} dayData - Day data object containing date and events
     * @returns {string} HTML string for a calendar day cell
     * @description Generates a calendar day cell with proper styling
     * and event indicators, handling expanded view mode.
     */
    renderCalendarDay(dayData) {
        const { date, dateKey, hasEvents, events } = dayData;
        const isToday = this.isToday(date);
        const isCurrentMonth = this.isCurrentMonth(date);
        
        const dayNumber = date.getDate();
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        let eventsHTML = '';
        if (hasEvents) {
            if (this.expandCalendarDays) {
                // Show all events when expandCalendarDays is enabled
                eventsHTML = `
                    <div class="calendar-day-events expanded">
                        ${events.map(event => this.renderCalendarEvent(event, dateKey)).join('')}
                    </div>
                `;
            } else {
                // Show only first 2 events and "+x more" when expandCalendarDays is disabled
                eventsHTML = `
                    <div class="calendar-day-events">
                        ${events.slice(0, 2).map(event => this.renderCalendarEvent(event, dateKey)).join('')}
                        ${events.length > 2 ? `<div class="more-events">+${events.length - 2} more</div>` : ''}
                    </div>
                `;
            }
        }

        return `
            <div class="calendar-day-cell ${isToday ? 'today' : ''} ${!isCurrentMonth ? 'other-month' : ''} ${hasEvents ? 'has-events' : ''} ${this.expandCalendarDays ? 'expanded' : ''}">
                <div class="calendar-day-header">
                    <div class="calendar-day-number">${dayNumber}</div>
                    <div class="calendar-day-name">${dayName}</div>
                </div>
                ${eventsHTML}
            </div>
        `;
    }

    /**
     * Renders a calendar event within a day cell.
     * Creates a compact event display for traditional view.
     * 
     * @method renderCalendarEvent
     * @param {Object} event - Calendar event object
     * @param {string} dateKey - Date key for the event
     * @returns {string} HTML string for a calendar event
     * @description Generates a compact event display suitable for
     * traditional calendar view.
     */
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

    /**
     * Renders a calendar day in agenda view.
     * Creates a day container with events for the agenda layout.
     * 
     * @method renderDay
     * @param {string} dateString - Date string in YYYY-MM-DD format
     * @param {Array} events - Array of events for this day
     * @returns {string} HTML string for a calendar day in agenda view
     * @description Generates a day container for agenda view with
     * proper date formatting and event list.
     */
    renderDay(dateString, events) {
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

    /**
     * Renders a calendar event in agenda view.
     * Creates a detailed event display with time, title, and location.
     * 
     * @method renderEvent
     * @param {Object} event - Calendar event object
     * @param {string} currentDateString - Current date string for context
     * @returns {string} HTML string for a calendar event in agenda view
     * @description Generates a detailed event display with proper time
     * formatting and location information.
     */
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

    /**
     * Groups calendar events by date.
     * Organizes events into a date-keyed object for easier rendering.
     * 
     * @method groupEventsByDate
     * @param {Array} events - Array of calendar events
     * @returns {Object} Events grouped by date key (YYYY-MM-DD format)
     * @description Groups events by their occurrence date, handling multi-day
     * events and sorting events within each date by start time.
     */
    groupEventsByDate(events) {
        const grouped = {};
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        events.forEach(event => {
            const startDate = new Date(event.start.dateTime || event.start.date);
            const endDate = new Date(event.end.dateTime || event.end.date);
            
            // For all-day events, the end date is exclusive, so we need to adjust
            if (event.start.date) {
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

    /**
     * Checks if a given date is today.
     * Compares the date with the current date.
     * 
     * @method isToday
     * @param {Date} date - Date to check
     * @returns {boolean} True if the date is today, false otherwise
     * @description Determines if a given date represents today's date.
     */
    isToday(date) {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    }

    /**
     * Checks if a given date is in the current month.
     * Compares the month and year with the current date.
     * 
     * @method isCurrentMonth
     * @param {Date} date - Date to check
     * @returns {boolean} True if the date is in the current month, false otherwise
     * @description Determines if a given date falls within the current month.
     */
    isCurrentMonth(date) {
        const today = new Date();
        return date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    }

    /**
     * Updates the view toggle icon based on current view mode.
     * Changes the icon to reflect traditional or agenda view.
     * 
     * @method updateViewToggleIcon
     * @param {boolean} isTraditionalView - Whether traditional view is active
     * @description Updates the visual indicator for the current calendar view mode.
     */
    updateViewToggleIcon(isTraditionalView) {
        const icon = document.getElementById('viewToggleIcon');
        if (!icon) return;
        
        if (isTraditionalView) {
            // Show agenda icon (list view)
            icon.innerHTML = '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>';
        } else {
            // Show calendar icon (grid view)
            icon.innerHTML = '<path d="M3 3h18v18H3zM8 12h8M12 8v8"/>';
        }
    }
} 