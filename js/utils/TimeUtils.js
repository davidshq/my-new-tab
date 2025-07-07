/**
 * Utility class for time and date operations.
 * Provides static methods for time formatting and date manipulation.
 * 
 * @class TimeUtils
 * @description Contains utility functions for handling time display,
 * date comparisons, and event time formatting.
 */
class TimeUtils {
    /**
     * Updates the time display in the UI.
     * Formats and displays current time and date.
     * 
     * @static
     * @method updateTimeDisplay
     * @description Updates the time display element with the current
     * time and date in a user-friendly format.
     */
    static updateTimeDisplay() {
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
        
        const timeDisplay = document.getElementById('timeDisplay');
        if (timeDisplay) {
            timeDisplay.textContent = `${timeString} • ${dateString}`;
        }
    }

    /**
     * Checks if a given date is today.
     * Compares the date with the current date.
     * 
     * @static
     * @method isToday
     * @param {Date} date - Date to check
     * @returns {boolean} True if the date is today, false otherwise
     * @description Determines if a given date represents today's date.
     */
    static isToday(date) {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    }

    /**
     * Checks if a given date is in the current month.
     * Compares the month and year with the current date.
     * 
     * @static
     * @method isCurrentMonth
     * @param {Date} date - Date to check
     * @returns {boolean} True if the date is in the current month, false otherwise
     * @description Determines if a given date falls within the current month.
     */
    static isCurrentMonth(date) {
        const today = new Date();
        return date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    }

    /**
     * Formats an event's start time for display.
     * Handles both timed and all-day events.
     * 
     * @static
     * @method formatEventTime
     * @param {Object} event - Calendar event object
     * @returns {string} Formatted time string for the event
     * @description Formats the start time of an event for display,
     * handling both timed events and all-day events.
     */
    static formatEventTime(event) {
        const startTime = new Date(event.start.dateTime || event.start.date);
        const endTime = new Date(event.end.dateTime || event.end.date);
        const isAllDay = !event.start.dateTime;
        
        if (isAllDay) {
            return 'All day';
        }
        
        return startTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }

    /**
     * Formats an event's time range for display.
     * Shows start and end times for timed events.
     * 
     * @static
     * @method formatEventTimeRange
     * @param {Object} event - Calendar event object
     * @returns {string} Formatted time range string for the event
     * @description Formats the time range of an event for display,
     * showing both start and end times for timed events.
     */
    static formatEventTimeRange(event) {
        const startTime = new Date(event.start.dateTime || event.start.date);
        const endTime = new Date(event.end.dateTime || event.end.date);
        const isAllDay = !event.start.dateTime;
        
        if (isAllDay) {
            return 'All day';
        }
        
        return `${startTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })} - ${endTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })}`;
    }

    /**
     * Converts a Date object to a date key string.
     * Creates a standardized date key format (YYYY-MM-DD).
     * 
     * @static
     * @method getDateKey
     * @param {Date} date - Date object to convert
     * @returns {string} Date key in YYYY-MM-DD format
     * @description Converts a Date object to a standardized
     * date key string for consistent date handling.
     */
    static getDateKey(date) {
        return date.getFullYear() + '-' + 
               String(date.getMonth() + 1).padStart(2, '0') + '-' + 
               String(date.getDate()).padStart(2, '0');
    }

    /**
     * Converts a date key string to a Date object.
     * Parses a standardized date key format (YYYY-MM-DD).
     * 
     * @static
     * @method parseDateKey
     * @param {string} dateKey - Date key string in YYYY-MM-DD format
     * @returns {Date} Date object parsed from the key
     * @description Converts a date key string back to a Date object
     * for date manipulation and comparison.
     */
    static parseDateKey(dateKey) {
        const [year, month, day] = dateKey.split('-');
        return new Date(Number(year), Number(month) - 1, Number(day));
    }
} 