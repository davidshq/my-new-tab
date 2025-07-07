/**
 * Service class for managing calendar operations.
 * Handles event retrieval, grouping, and sample data generation.
 * 
 * @class CalendarService
 * @description Provides a unified interface for calendar operations
 * including real Google Calendar integration and sample data generation.
 */
class CalendarService {
    /**
     * Initializes a new CalendarService instance.
     * Sets up the Google Calendar service integration.
     * 
     * @constructor
     * @description Creates a new CalendarService instance with
     * Google Calendar service integration.
     */
    constructor() {
        this.googleCalendarService = new GoogleCalendarService();
    }

    /**
     * Retrieves calendar events based on configuration.
     * Fetches real events or generates sample data as needed.
     * 
     * @async
     * @method getEvents
     * @param {number} days - Number of days to fetch events for
     * @param {boolean} useSampleData - Whether to use sample data instead of real events
     * @returns {Promise<Array>} Array of calendar events
     * @description Retrieves calendar events either from Google Calendar
     * or generates sample data based on the useSampleData parameter.
     */
    async getEvents(days, useSampleData = false) {
        if (useSampleData) {
            return this.generateSampleEvents(days);
        }
        return await this.googleCalendarService.getEvents(days);
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
     * Generates sample calendar events for testing and demonstration.
     * Creates realistic sample data when real calendar is not available.
     * 
     * @method generateSampleEvents
     * @param {number} days - Number of days to generate events for
     * @returns {Array} Array of sample calendar events
     * @description Generates a set of realistic sample calendar events
     * for testing and demonstration purposes.
     */
    generateSampleEvents(days) {
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

        // Generate events for the next X days
        for (let i = 0; i < days; i++) {
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

/**
 * Service class for interacting with Google Calendar API.
 * Handles authentication and event retrieval from Google Calendar.
 * 
 * @class GoogleCalendarService
 * @description Provides methods for authenticating with Google Calendar
 * and retrieving calendar events through the Google Calendar API.
 */
class GoogleCalendarService {
    /**
     * Initializes a new GoogleCalendarService instance.
     * Sets up the authentication state.
     * 
     * @constructor
     * @description Creates a new GoogleCalendarService instance with
     * initial authentication state set to false.
     */
    constructor() {
        this.isAuthenticated = false;
    }

    /**
     * Authenticates with Google Calendar API.
     * Attempts to get an auth token and updates authentication state.
     * 
     * @async
     * @method authenticate
     * @returns {Promise<boolean>} True if authentication successful, false otherwise
     * @description Attempts to authenticate with Google Calendar API using
     * Chrome identity API and updates the authentication state.
     */
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

    /**
     * Gets an authentication token from Chrome identity API.
     * Requests user authorization for Google Calendar access.
     * 
     * @async
     * @method getAuthToken
     * @returns {Promise<string>} Authentication token for Google Calendar API
     * @description Requests an authentication token from Chrome identity API
     * for accessing Google Calendar services.
     */
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

    /**
     * Retrieves calendar events from Google Calendar API.
     * Fetches events for the specified number of days from today.
     * 
     * @async
     * @method getEvents
     * @param {number} days - Number of days to fetch events for (default: 7)
     * @returns {Promise<Array>} Array of calendar events
     * @description Fetches calendar events from Google Calendar API for
     * the specified number of days starting from today.
     */
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