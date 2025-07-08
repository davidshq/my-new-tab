const SettingsModal = require('../../../js/components/SettingsModal');

// Mock SettingsService
const mockSettingsService = {
  updateSetting: jest.fn().mockResolvedValue(true),
  loadSettings: jest.fn().mockResolvedValue({
    useSampleData: false,
    expandCalendarDays: false,
    daysPerRow: 4
  })
};

describe('SettingsModal', () => {
  let modal;
  let container;

  beforeEach(() => {
    // Create mock DOM elements that SettingsModal expects
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

    container = document.createElement('div');
    container.id = 'settingsModal';
    container.classList.add('modal');
    document.body.appendChild(container);

    modal = new SettingsModal(mockSettingsService);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should open settings modal', () => {
    modal.open();
    expect(modal.isOpen).toBe(true);
    expect(container.classList.contains('show')).toBe(true);
  });

  it('should close settings modal', () => {
    modal.open();
    modal.close();
    expect(modal.isOpen).toBe(false);
    expect(container.classList.contains('show')).toBe(false);
  });
}); 