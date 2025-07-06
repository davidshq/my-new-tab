class WidgetResizeService {
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

    init() {
        this.setupResizeHandles();
        this.setupEventListeners();
        this.loadWidgetDimensions();
    }

    setupResizeHandles() {
        const widgets = document.querySelectorAll('.widget');
        widgets.forEach(widget => {
            this.addResizeHandles(widget);
        });
    }

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

    stopResize() {
        if (this.currentWidget) {
            this.currentWidget.classList.remove('resizing');
            this.currentWidget = null;
        }
        
        this.isResizing = false;
        document.body.style.cursor = '';
    }

    getCursorForDirection(direction) {
        const cursors = {
            'nw': 'nw-resize',
            'ne': 'ne-resize',
            'sw': 'sw-resize',
            'se': 'se-resize'
        };
        return cursors[direction] || 'se-resize';
    }

    async saveWidgetDimensions(widgetId, width, height) {
        try {
            const settings = await chrome.storage.sync.get('widgetDimensions') || {};
            settings[widgetId] = { width, height };
            await chrome.storage.sync.set({ widgetDimensions: settings });
        } catch (error) {
            console.error('Error saving widget dimensions:', error);
        }
    }

    async loadWidgetDimensions() {
        try {
            const result = await chrome.storage.sync.get('widgetDimensions');
            const widgetDimensions = result.widgetDimensions || {};
            
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

    resetWidgetDimensions(widgetId) {
        const widget = document.getElementById(widgetId);
        if (widget) {
            widget.style.width = '';
            widget.style.height = '';
            this.saveWidgetDimensions(widgetId, null, null);
        }
    }
} 