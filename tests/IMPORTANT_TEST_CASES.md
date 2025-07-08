# Most Important Test Cases for My New Tab Extension

## 1. SettingsService
- Loads settings with defaults when storage is empty
- Loads settings from storage and merges with defaults
- Saves settings to storage successfully
- Handles storage errors gracefully (load/save)
- Updates a single setting

## 2. CalendarService
- Returns sample events when useSampleData is true
- Authenticates and fetches real events from Google Calendar
- Handles authentication errors
- Handles API fetch errors
- Generates correct number of sample events for given days

## 3. CalendarRenderer (UI)
- Renders calendar view with events
- Renders agenda view with events
- Handles empty events array (shows 'No events')
- Updates view toggle icon correctly

## 4. Main User Flows
- Loads calendar with user settings on startup
- Changes calendar view when toggle is clicked
- Opens and closes settings modal
- Changes days range and reloads calendar
- Persists settings across sessions

## 5. WidgetResizeService
- Adds resize handles to widgets
- Resets widget dimensions
- Loads and applies widget dimensions from storage

---

*Start by implementing tests for SettingsService and CalendarService, as these are core to business logic and user experience.* 