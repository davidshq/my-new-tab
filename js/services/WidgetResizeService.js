const StorageUtils = require('../utils/StorageUtils');

/**
 * Service class for managing widget resize functionality.
 * Handles drag-to-resize operations for calendar widgets.
 * 
 * @class WidgetResizeService
 * @description Provides drag-to-resize functionality for widgets,
 * including corner handles and dimension persistence.
 */
class WidgetResizeService {
    /**
     * Initializes a new WidgetResizeService instance.
     * Sets up resize constraints and state management.
     * 
     * @constructor
     * @description Creates a new WidgetResizeService instance with
     * resize constraints and state management.
     */
    constructor() {
        this.isResizing = false;
        this.currentWidget = null;
        this.startX = 0;
        this.startY = 0;
        this.startWidth = 0;
        this.startHeight = 0;
        this.minWidth = 250;
        this.minHeight = 200;
        this.maxWidth = window.innerWidth - 20;
        this.maxHeight = window.innerHeight - 150;
    }

    /**
     * Initializes the widget resize functionality.
     * Sets up resize handles and event listeners.
     * 
     * @method init
     * @description Sets up the complete resize functionality including
     * handle creation, event listeners, and dimension loading.
     */
    init() {
        this.setupResizeHandles();
        this.setupEventListeners();
        this.loadWidgetDimensions();
    }

    /**
     * Sets up resize handles for all widgets.
     * Adds corner handles to each widget element.
     * 
     * @method setupResizeHandles
     * @description Finds all widget elements and adds resize handles
     * to enable drag-to-resize functionality.
     */
    setupResizeHandles() {
        const widgets = document.querySelectorAll('.widget');
        widgets.forEach(widget => {
            this.addResizeHandles(widget);
        });
    }

    /**
     * Adds resize handles to a specific widget.
     * Creates corner handles for multi-directional resizing.
     * 
     * @method addResizeHandles
     * @param {HTMLElement} widget - Widget element to add handles to
     * @description Adds resize handles to the specified widget,
     * including corner handles for different resize directions.
     */
    addResizeHandles(widget) {
        // Add resize handle to bottom-right corner
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'resize-handle';
        resizeHandle.title = 'Drag to resize widget';
        resizeHandle.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 22L13 13M13 22L22 13"/>
            </svg>
        `;
        widget.appendChild(resizeHandle);

        // Add resize handles to corners
        const corners = ['nw', 'ne', 'sw', 'se'];
        corners.forEach(corner => {
            const cornerHandle = document.createElement('div');
            cornerHandle.className = `resize-handle resize-handle-${corner}`;
            cornerHandle.dataset.corner = corner;
            cornerHandle.title = `Drag to resize from ${corner.toUpperCase()} corner`;
            widget.appendChild(cornerHandle);
        });
    }

    /**
     * Sets up event listeners for resize operations.
     * Handles mouse events for drag-to-resize functionality.
     * 
     * @method setupEventListeners
     * @description Sets up mouse event listeners for handling
     * resize operations and window resize events.
     */
    setupEventListeners() {
        document.addEventListener('mousedown', (e) => {
            if (e.target.closest('.resize-handle')) {
                this.startResize(e);
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (this.isResizing) {
                this.handleResize(e);
            }
        });

        document.addEventListener('mouseup', () => {
            if (this.isResizing) {
                this.stopResize();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.maxWidth = window.innerWidth - 20;
            this.maxHeight = window.innerHeight - 150;
        });
    }

    /**
     * Starts a resize operation.
     * Initializes resize state and captures initial dimensions.
     * 
     * @method startResize
     * @param {MouseEvent} e - Mouse event that triggered the resize
     * @description Begins a resize operation by capturing initial
     * mouse position and widget dimensions.
     */
    startResize(e) {
        e.preventDefault();
        this.isResizing = true;
        this.currentWidget = e.target.closest('.widget');
        this.startX = e.clientX;
        this.startY = e.clientY;
        
        const rect = this.currentWidget.getBoundingClientRect();
        this.startWidth = rect.width;
        this.startHeight = rect.height;
        
        // Determine resize direction based on handle
        const handle = e.target.closest('.resize-handle');
        this.resizeDirection = handle.dataset.corner || 'se';
        
        document.body.style.cursor = this.getCursorForDirection(this.resizeDirection);
        this.currentWidget.classList.add('resizing');
    }

    /**
     * Handles resize operations during mouse movement.
     * Updates widget dimensions based on mouse position.
     * 
     * @method handleResize
     * @param {MouseEvent} e - Mouse event during resize
     * @description Updates widget dimensions during resize operation
     * based on mouse movement and resize direction.
     */
    handleResize(e) {
        if (!this.currentWidget) return;

        const deltaX = e.clientX - this.startX;
        const deltaY = e.clientY - this.startY;
        
        let newWidth = this.startWidth;
        let newHeight = this.startHeight;
        
        // Handle different resize directions
        switch (this.resizeDirection) {
            case 'se':
                newWidth = this.startWidth + deltaX;
                newHeight = this.startHeight + deltaY;
                break;
            case 'sw':
                newWidth = this.startWidth - deltaX;
                newHeight = this.startHeight + deltaY;
                break;
            case 'ne':
                newWidth = this.startWidth + deltaX;
                newHeight = this.startHeight - deltaY;
                break;
            case 'nw':
                newWidth = this.startWidth - deltaX;
                newHeight = this.startHeight - deltaY;
                break;
        }
        
        // Apply constraints
        newWidth = Math.max(this.minWidth, Math.min(this.maxWidth, newWidth));
        newHeight = Math.max(this.minHeight, Math.min(this.maxHeight, newHeight));
        
        this.currentWidget.style.width = `${newWidth}px`;
        this.currentWidget.style.height = `${newHeight}px`;
        
        // Save dimensions to storage
        this.saveWidgetDimensions(this.currentWidget.id, newWidth, newHeight);
    }

    /**
     * Stops the current resize operation.
     * Cleans up resize state and restores cursor.
     * 
     * @method stopResize
     * @description Ends the current resize operation and
     * cleans up the resize state.
     */
    stopResize() {
        if (this.currentWidget) {
            this.currentWidget.classList.remove('resizing');
            this.currentWidget = null;
        }
        
        this.isResizing = false;
        document.body.style.cursor = '';
    }

    /**
     * Gets the appropriate cursor for a resize direction.
     * Returns the CSS cursor value for the specified direction.
     * 
     * @method getCursorForDirection
     * @param {string} direction - Resize direction ('nw', 'ne', 'sw', 'se')
     * @returns {string} CSS cursor value for the direction
     * @description Returns the appropriate cursor style for
     * the specified resize direction.
     */
    getCursorForDirection(direction) {
        const cursors = {
            'nw': 'nw-resize',
            'ne': 'ne-resize',
            'sw': 'sw-resize',
            'se': 'se-resize'
        };
        return cursors[direction] || 'se-resize';
    }

    /**
     * Saves widget dimensions to storage.
     * Persists widget size preferences for future sessions.
     * 
     * @async
     * @method saveWidgetDimensions
     * @param {string} widgetId - ID of the widget to save dimensions for
     * @param {number} width - Widget width in pixels
     * @param {number} height - Widget height in pixels
     * @description Saves widget dimensions to Chrome sync storage
     * for persistence across browser sessions.
     */
    async saveWidgetDimensions(widgetId, width, height) {
        try {
            const settings = await StorageUtils.getSetting('widgetDimensions') || {};
            settings[widgetId] = { width, height };
            await StorageUtils.setSetting('widgetDimensions', settings);
        } catch (error) {
            console.error('Error saving widget dimensions:', error);
        }
    }

    /**
     * Loads widget dimensions from storage.
     * Applies saved dimensions to widgets on page load.
     * 
     * @async
     * @method loadWidgetDimensions
     * @description Loads saved widget dimensions from storage and
     * applies them to the corresponding widgets.
     */
    async loadWidgetDimensions() {
        try {
            const result = await StorageUtils.getSetting('widgetDimensions');
            const widgetDimensions = result || {};
            
            Object.keys(widgetDimensions).forEach(widgetId => {
                const widget = document.getElementById(widgetId);
                if (widget && widgetDimensions[widgetId]) {
                    const { width, height } = widgetDimensions[widgetId];
                    widget.style.width = `${width}px`;
                    widget.style.height = `${height}px`;
                }
            });
        } catch (error) {
            console.error('Error loading widget dimensions:', error);
        }
    }

    /**
     * Resets widget dimensions to default.
     * Removes custom dimensions and saves null values.
     * 
     * @method resetWidgetDimensions
     * @param {string} widgetId - ID of the widget to reset
     * @description Resets a widget's dimensions to default values
     * and removes the saved dimensions from storage.
     */
    resetWidgetDimensions(widgetId) {
        const widget = document.getElementById(widgetId);
        if (widget) {
            widget.style.width = '';
            widget.style.height = '';
            this.saveWidgetDimensions(widgetId, null, null);
        }
    }
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WidgetResizeService;
} 