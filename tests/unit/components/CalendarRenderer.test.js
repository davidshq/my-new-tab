const CalendarRenderer = require('../../../js/components/CalendarRenderer');

global.TimeUtils = {
  isToday: () => false,
  isCurrentMonth: () => true,
  formatTime: () => '10:00 AM',
  formatEventTimeRangeMultiDay: () => '10:00 AM - 11:00 AM',
};

describe('CalendarRenderer', () => {
  let renderer;
  let container;

  beforeEach(() => {
    renderer = new CalendarRenderer();
    container = document.createElement('div');
    container.id = 'calendarContent';
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should render calendar view with events', () => {
    const today = new Date();
    const isoDateTime = today.toISOString();
    const events = [
      {
        summary: 'Test Event',
        start: { dateTime: isoDateTime },
        end: { dateTime: isoDateTime }
      }
    ];
    renderer.renderCalendar(events, 'calendarContent', true);
    const calendarElement = document.getElementById('calendarContent');
    expect(calendarElement.innerHTML).toContain('Test Event');
    expect(calendarElement.innerHTML).toContain('traditional-calendar');
  });

  it('should render agenda view with events', () => {
    renderer.isTraditionalView = false;
    const today = new Date();
    const isoDateTime = today.toISOString();
    const events = [
      {
        summary: 'Agenda Event',
        start: { dateTime: isoDateTime },
        end: { dateTime: isoDateTime }
      }
    ];
    renderer.renderCalendar(events, 'calendarContent', false);
    const calendarElement = document.getElementById('calendarContent');
    expect(calendarElement.innerHTML).toContain('Agenda Event');
    expect(calendarElement.innerHTML).toContain('calendar-grid');
  });

  it('should handle empty events array and show no events message', () => {
    renderer.renderCalendar([], 'calendarContent', true);
    const calendarElement = document.getElementById('calendarContent');
    expect(calendarElement.innerHTML).toContain('No upcoming events');
  });

  it('should update view toggle icon for both views', () => {
    const icon = document.createElement('i');
    icon.id = 'viewToggleIcon';
    document.body.appendChild(icon);
    renderer.updateViewToggleIcon(true);
    expect(icon.innerHTML).toContain('M8 6h13'); // agenda icon path
    renderer.updateViewToggleIcon(false);
    expect(icon.innerHTML).toContain('M3 3h18'); // calendar icon path
    document.body.removeChild(icon);
  });
}); 