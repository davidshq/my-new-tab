const WidgetResizeService = require('../../../js/services/WidgetResizeService');

describe('WidgetResizeService', () => {
  let widgetResizeService;

  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `
      <div id="testWidget" class="widget" style="width: 300px; height: 200px;">
        <div class="widget-content">Test Widget</div>
      </div>
    `;

    widgetResizeService = new WidgetResizeService();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('constructor', () => {
    it('should initialize with default values', () => {
      expect(widgetResizeService.isResizing).toBe(false);
      expect(widgetResizeService.currentWidget).toBeNull();
      expect(widgetResizeService.minWidth).toBe(250);
      expect(widgetResizeService.minHeight).toBe(200);
    });
  });

  describe('addResizeHandles', () => {
    it('should add resize handles to the widget', () => {
      const widget = document.getElementById('testWidget');
      widgetResizeService.addResizeHandles(widget);

      // There should be 1 main handle and 4 corner handles
      const handles = widget.querySelectorAll('.resize-handle');
      expect(handles.length).toBe(5);

      // Check for each corner handle
      ['nw', 'ne', 'sw', 'se'].forEach(corner => {
        const cornerHandle = widget.querySelector(`.resize-handle-${corner}`);
        expect(cornerHandle).not.toBeNull();
        expect(cornerHandle.dataset.corner).toBe(corner);
      });
    });
  });

  describe('setupResizeHandles', () => {
    it('should add handles to all widgets on the page', () => {
      // Add a second widget
      const secondWidget = document.createElement('div');
      secondWidget.id = 'testWidget2';
      secondWidget.className = 'widget';
      document.body.appendChild(secondWidget);

      widgetResizeService.setupResizeHandles();

      // Both widgets should have 5 handles each
      const widget1 = document.getElementById('testWidget');
      const widget2 = document.getElementById('testWidget2');
      expect(widget1.querySelectorAll('.resize-handle').length).toBe(5);
      expect(widget2.querySelectorAll('.resize-handle').length).toBe(5);
    });
  });

  describe('getCursorForDirection', () => {
    it('should return correct cursor for each direction', () => {
      expect(widgetResizeService.getCursorForDirection('nw')).toBe('nw-resize');
      expect(widgetResizeService.getCursorForDirection('ne')).toBe('ne-resize');
      expect(widgetResizeService.getCursorForDirection('sw')).toBe('sw-resize');
      expect(widgetResizeService.getCursorForDirection('se')).toBe('se-resize');
    });
    it('should return default cursor for unknown direction', () => {
      expect(widgetResizeService.getCursorForDirection('unknown')).toBe('se-resize');
      expect(widgetResizeService.getCursorForDirection(undefined)).toBe('se-resize');
    });
  });

  describe('resetWidgetDimensions', () => {
    it('should reset widget dimensions and call saveWidgetDimensions', () => {
      const widget = document.getElementById('testWidget');
      widget.style.width = '400px';
      widget.style.height = '300px';
      const spy = jest.spyOn(widgetResizeService, 'saveWidgetDimensions').mockImplementation(() => {});

      widgetResizeService.resetWidgetDimensions('testWidget');

      expect(widget.style.width).toBe('');
      expect(widget.style.height).toBe('');
      expect(spy).toHaveBeenCalledWith('testWidget', null, null);
      spy.mockRestore();
    });
  });

  describe('saveWidgetDimensions', () => {
    it('should call StorageUtils.getSetting and setSetting with correct args', async () => {
      const getSetting = jest.spyOn(require('../../../js/utils/StorageUtils'), 'getSetting').mockResolvedValue({});
      const setSetting = jest.spyOn(require('../../../js/utils/StorageUtils'), 'setSetting').mockResolvedValue();

      await widgetResizeService.saveWidgetDimensions('testWidget', 123, 456);

      expect(getSetting).toHaveBeenCalledWith('widgetDimensions');
      expect(setSetting).toHaveBeenCalledWith('widgetDimensions', { testWidget: { width: 123, height: 456 } });

      getSetting.mockRestore();
      setSetting.mockRestore();
    });
  });

  describe('loadWidgetDimensions', () => {
    it('should load and apply dimensions to widgets from storage', async () => {
      const getSetting = jest.spyOn(require('../../../js/utils/StorageUtils'), 'getSetting').mockResolvedValue({
        testWidget: { width: 321, height: 654 }
      });
      const widget = document.getElementById('testWidget');
      widget.style.width = '';
      widget.style.height = '';

      await widgetResizeService.loadWidgetDimensions();

      expect(getSetting).toHaveBeenCalledWith('widgetDimensions');
      expect(widget.style.width).toBe('321px');
      expect(widget.style.height).toBe('654px');
      getSetting.mockRestore();
    });
  });
}); 