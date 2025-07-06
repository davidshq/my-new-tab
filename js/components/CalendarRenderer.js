class CalendarRenderer {
    constructor() {
        this.currentDays = 7;
        this.isTraditionalView = true;
    }

    setConfig(days, isTraditionalView) {
        this.currentDays = days;
        this.isTraditionalView = isTraditionalView;
    }

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
        return `
            <div class="traditional-calendar single-row-calendar">
                <div class="calendar-days-row">
                    ${days.map(dayData => this.renderCalendarDay(dayData)).join('')}
                </div>
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

    updateViewToggleIcon(isTraditionalView) {
        const icon = document.getElementById('viewToggleIcon');
        if (isTraditionalView) {
            // Show agenda icon (list view)
            icon.innerHTML = '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>';
        } else {
            // Show calendar icon (grid view)
            icon.innerHTML = '<path d="M3 3h18v18H3zM8 12h8M12 8v8"/>';
        }
    }
} 