# Utility Functions Refactoring Guide

This document outlines the similar functions found across the codebase that can be refactored into utility functions for better code organization and reusability.

## Summary of Findings

After analyzing the codebase, I identified **5 main categories** of similar functions that could be consolidated into utility classes:

1. **Time Formatting Functions** (Multiple files)
2. **Date Comparison Functions** (Duplicated across files)
3. **Chrome Storage Operations** (Scattered across files)
4. **Event Time Range Formatting** (Complex logic duplicated)
5. **DOM Operations** (Repeated patterns)

## 1. Time Formatting Functions

### Current State
Time formatting code is scattered across multiple files with similar patterns:

**Files with time formatting:**
- `js/components/CalendarRenderer.js` (lines 192, 281-285, 292, 299)
- `TimeUtils.js` (already has some, lines 20, 91, 118-122)

### Recommended Solution
**Use the enhanced `TimeUtils.js`** with these new methods:

```javascript
// Instead of repeating this pattern:
const timeString = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
});

// Use:
const timeString = TimeUtils.formatTime(now);
```

**New utility methods added:**
- `TimeUtils.formatTime(date)` - Consistent time formatting
- `TimeUtils.formatDate(date, options)` - Flexible date formatting
- `TimeUtils.formatShortDate(date)` - Compact date format
- `TimeUtils.formatShortDayName(date)` - Short day names
- `TimeUtils.formatEventTimeRangeMultiDay(event, currentDateString)` - Multi-day event formatting

## 2. Date Comparison Functions

### Current State
The `isToday()` and `isCurrentMonth()` functions are duplicated:

**Duplicated in:**
- `js/components/CalendarRenderer.js` (lines 411-426, 427-441)
- `TimeUtils.js` (already has these, lines 48-58, 65-75)

### Recommended Solution
**Remove duplicates and use `TimeUtils.js` versions:**

```javascript
// Instead of:
isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
}

// Use:
TimeUtils.isToday(date)
```

## 3. Chrome Storage Operations

### Current State
Storage operations are repeated across multiple files:

**Files with storage operations:**
- `js/app/NewTabApp.js` (lines 175-205, 207-225)
- `popup.js` (lines 33-40)
- `background.js` (lines 23-25, 50-56)
- `SettingsService.js` (lines 39-59, 81-102)
- `WidgetResizeService.js` (lines 254-256, 273)

### Recommended Solution
**Use the new `StorageUtils.js`:**

```javascript
// Instead of:
const result = await chrome.storage.sync.get(['calendarDays']);
await chrome.storage.sync.set({ calendarDays: 7 });

// Use:
const result = await StorageUtils.getSettings(['calendarDays']);
await StorageUtils.setSetting('calendarDays', 7);
```

**Available methods:**
- `StorageUtils.getSetting(key)` - Get single setting
- `StorageUtils.getSettings(keys)` - Get multiple settings
- `StorageUtils.setSetting(key, value)` - Set single setting
- `StorageUtils.setSettings(settings)` - Set multiple settings
- `StorageUtils.removeSetting(key)` - Remove setting
- `StorageUtils.clearSettings()` - Clear all settings
- `StorageUtils.getAllSettings()` - Get all settings

## 4. Event Time Range Formatting

### Current State
Complex event time range formatting is duplicated:

**Files with complex event formatting:**
- `js/components/CalendarRenderer.js` (lines 281-299) - Multi-day event logic
- `TimeUtils.js` (already has basic version, lines 118-122)

### Recommended Solution
**Use the enhanced `TimeUtils.formatEventTimeRangeMultiDay()`:**

```javascript
// Instead of complex multi-day logic in each file:
// (30+ lines of complex date comparison logic)

// Use:
const timeString = TimeUtils.formatEventTimeRangeMultiDay(event, currentDateString);
```

## 5. DOM Operations

### Current State
DOM operations are repeated with similar patterns:

**Common patterns found:**
- Element retrieval with null checking
- Class manipulation (add/remove/toggle)
- Modal show/hide operations
- Event listener management
- Style property setting

### Recommended Solution
**Use the new `DOMUtils.js`:**

```javascript
// Instead of:
const element = document.getElementById('timeDisplay');
if (element) {
    element.textContent = timeString;
}

// Use:
DOMUtils.setTextContent('timeDisplay', timeString);

// Instead of:
const modal = document.getElementById('settingsModal');
modal.classList.add('show');
document.body.style.overflow = 'hidden';

// Use:
DOMUtils.showModal('settingsModal');
```

**Available methods:**
- `DOMUtils.getElement(id)` - Safe element retrieval
- `DOMUtils.setTextContent(id, text)` - Safe text setting
- `DOMUtils.setInnerHTML(id, html)` - Safe HTML setting
- `DOMUtils.addClass(id, className)` - Safe class addition
- `DOMUtils.removeClass(id, className)` - Safe class removal
- `DOMUtils.toggleClass(id, className)` - Safe class toggle
- `DOMUtils.showModal(id)` - Show modal with overflow handling
- `DOMUtils.hideModal(id)` - Hide modal with overflow handling
- `DOMUtils.addEventListener(id, event, handler)` - Safe event listener
- `DOMUtils.setStyle(id, property, value)` - Safe style setting

## Implementation Priority

### High Priority (Immediate Benefits)
1. **Replace duplicated date comparison functions** - Use `TimeUtils.isToday()` and `TimeUtils.isCurrentMonth()`
2. **Consolidate storage operations** - Use `StorageUtils` methods
3. **Replace complex event time formatting** - Use `TimeUtils.formatEventTimeRangeMultiDay()`

### Medium Priority (Code Quality)
4. **Replace time formatting patterns** - Use `TimeUtils.formatTime()` and `TimeUtils.formatDate()`
5. **Replace DOM operations** - Use `DOMUtils` methods

### Low Priority (Future Enhancement)
6. **Replace date key generation** - Use `TimeUtils.getDateKey()` everywhere

## Files to Update

### Primary Files (High Impact)
1. `js/app/NewTabApp.js` - Main application (modular structure)
2. `js/components/CalendarRenderer.js` - Remove duplicated functions, use utilities
3. `popup.js` - Use `StorageUtils` for storage operations
4. `background.js` - Use `StorageUtils` for storage operations

### Secondary Files (Medium Impact)
5. `js/services/SettingsService.js` - Use `StorageUtils` methods
6. `js/services/WidgetResizeService.js` - Use `StorageUtils` methods

## Benefits of Refactoring

1. **Reduced Code Duplication** - Eliminate ~200 lines of duplicated code
2. **Improved Maintainability** - Single source of truth for common operations
3. **Better Error Handling** - Centralized error handling in utility functions
4. **Consistent Behavior** - Same logic across all files
5. **Easier Testing** - Test utility functions independently
6. **Better Documentation** - Centralized documentation for common operations

## Migration Strategy

1. **Phase 1**: Replace storage operations with `StorageUtils`
2. **Phase 2**: Replace date comparison functions with `TimeUtils`
3. **Phase 3**: Replace complex event formatting with `TimeUtils`
4. **Phase 4**: Replace time formatting patterns with `TimeUtils`
5. **Phase 5**: Replace DOM operations with `DOMUtils`

## Example Migration

### Before (js/components/CalendarRenderer.js):
```javascript
renderEvent(event, currentDateString) {
    const startTime = new Date(event.start.dateTime || event.start.date);
    const endTime = new Date(event.end.dateTime || event.end.date);
    
    // 50+ lines of complex date parsing, comparison, and formatting logic
    // ... complex date comparison logic ...
    if (isFirstDay && isLastDay) {
        timeString = `${startTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })} - ${endTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })}`;
    }
    // ... more complex logic ...
}
```

### After (js/components/CalendarRenderer.js):
```javascript
renderEvent(event, currentDateString) {
    const timeString = TimeUtils.formatEventTimeRangeMultiDay(event, currentDateString);
    
    return `
        <div class="event-item">
            <div class="event-time">${timeString}</div>
            <div class="event-title">${event.summary}</div>
            ${event.location ? `<div class="event-location">📍 ${event.location}</div>` : ''}
        </div>
    `;
}
```

This refactoring will significantly improve code quality, reduce duplication, and make the codebase more maintainable. 