const NewTabApp = require('../../../js/app/NewTabApp');

// Mock dependencies
jest.mock('../../../js/services/SettingsService', () => jest.fn().mockImplementation(() => ({
  loadSettings: jest.fn().mockResolvedValue({
    calendarDays: 7,
    calendarView: true,
    useSampleData: false,
    expandCalendarDays: false,
    daysPerRow: 4
  }),
  saveSettings: jest.fn().mockResolvedValue(true)
})));
jest.mock('../../../js/services/CalendarService', () => jest.fn().mockImplementation(() => ({
  getEvents: jest.fn().mockResolvedValue([])
})));
jest.mock('../../../js/components/CalendarRenderer', () => jest.fn().mockImplementation(() => ({
  updateViewToggleIcon: jest.fn(),
  renderCalendar: jest.fn()
})));
jest.mock('../../../js/components/SettingsModal', () => jest.fn());
jest.mock('../../../js/services/WidgetResizeService', () => jest.fn().mockImplementation(() => ({
  init: jest.fn()
})));

global.TimeUtils = {
  updateTimeDisplay: jest.fn(),
  isToday: () => false,
  isCurrentMonth: () => true,
  formatTime: () => '10:00 AM',
  formatEventTimeRangeMultiDay: () => '10:00 AM - 11:00 AM',
};

describe('NewTabApp', () => {
  let app;
  let viewToggleBtn;

  beforeEach(() => {
    // Mock DOM for SettingsModal
    const settingsModalDiv = document.createElement('div');
    settingsModalDiv.id = 'settingsModal';
    settingsModalDiv.classList.add('modal');
    document.body.appendChild(settingsModalDiv);

    const settingsBtn = document.createElement('button');
    settingsBtn.id = 'settingsBtn';
    document.body.appendChild(settingsBtn);

    const closeSettingsBtn = document.createElement('button');
    closeSettingsBtn.id = 'closeSettingsBtn';
    document.body.appendChild(closeSettingsBtn);

    const useSampleDataToggle = document.createElement('input');
    useSampleDataToggle.id = 'useSampleData';
    useSampleDataToggle.type = 'checkbox';
    document.body.appendChild(useSampleDataToggle);

    const expandCalendarDaysToggle = document.createElement('input');
    expandCalendarDaysToggle.id = 'expandCalendarDays';
    expandCalendarDaysToggle.type = 'checkbox';
    document.body.appendChild(expandCalendarDaysToggle);

    const daysPerRowSelect = document.createElement('select');
    daysPerRowSelect.id = 'daysPerRow';
    document.body.appendChild(daysPerRowSelect);

    const resetWidgetDimensionsBtn = document.createElement('button');
    resetWidgetDimensionsBtn.id = 'resetWidgetDimensions';
    document.body.appendChild(resetWidgetDimensionsBtn);

    // Mock DOM for NewTabApp
    viewToggleBtn = document.createElement('button');
    viewToggleBtn.id = 'viewToggleBtn';
    document.body.appendChild(viewToggleBtn);

    const daysSelect = document.createElement('select');
    daysSelect.id = 'daysSelect';
    document.body.appendChild(daysSelect);
    const refreshBtn = document.createElement('button');
    refreshBtn.id = 'refreshBtn';
    document.body.appendChild(refreshBtn);

    app = new NewTabApp();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should toggle view when viewToggleBtn is clicked', async () => {
    // Wait for async init
    await new Promise(resolve => setTimeout(resolve, 10));
    const initialView = app.isTraditionalView;
    viewToggleBtn.click();
    expect(app.isTraditionalView).toBe(!initialView);
  });
}); 