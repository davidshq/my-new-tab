# Most Important Test Cases for My New Tab Extension

## 1. SettingsService
- [x] Loads settings with defaults when storage is empty
- [x] Loads settings from storage and merges with defaults
- [x] Saves settings to storage successfully
- [x] Handles storage errors gracefully (load/save)
- [x] Updates a single setting

## 2. CalendarService
- [x] Returns sample events when useSampleData is true
- [x] Authenticates and fetches real events from Google Calendar
- [x] Handles authentication errors
- [x] Handles API fetch errors
- [x] Generates correct number of sample events for given days

## 3. CalendarRenderer (UI)
- [ ] Renders calendar view with events
- [ ] Renders agenda view with events
- [ ] Handles empty events array (shows 'No events')
- [ ] Updates view toggle icon correctly

## 4. Main User Flows
- [ ] Loads calendar with user settings on startup
- [ ] Changes calendar view when toggle is clicked
- [ ] Opens and closes settings modal
- [ ] Changes days range and reloads calendar
- [ ] Persists settings across sessions

## 5. WidgetResizeService
- [x] Adds resize handles to widgets
- [x] Resets widget dimensions
- [x] Loads and applies widget dimensions from storage

---

**Status:**
- SettingsService and CalendarService core test cases are implemented and passing.
- Next focus: CalendarRenderer component and main user flows. 