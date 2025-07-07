/**
 * Utility class for DOM operations.
 * Provides static methods for common DOM manipulations across the extension.
 * 
 * @class DOMUtils
 * @description Contains utility functions for handling DOM operations
 * including element creation, event handling, and UI updates.
 */
class DOMUtils {
    /**
     * Safely gets an element by ID.
     * Returns null if element doesn't exist.
     * 
     * @static
     * @method getElement
     * @param {string} id - Element ID to find
     * @returns {HTMLElement|null} The element or null if not found
     * @description Safely retrieves an element by ID with null checking.
     */
    static getElement(id) {
        return document.getElementById(id);
    }

    /**
     * Safely gets an element by ID and throws if not found.
     * Useful for critical elements that must exist.
     * 
     * @static
     * @method getRequiredElement
     * @param {string} id - Element ID to find
     * @returns {HTMLElement} The element
     * @throws {Error} If element is not found
     * @description Retrieves an element by ID and throws an error if not found.
     */
    static getRequiredElement(id) {
        const element = document.getElementById(id);
        if (!element) {
            throw new Error(`Required element with ID '${id}' not found`);
        }
        return element;
    }

    /**
     * Creates an element with specified attributes and content.
     * 
     * @static
     * @method createElement
     * @param {string} tagName - HTML tag name
     * @param {Object} attributes - Object containing attributes
     * @param {string} content - Text content for the element
     * @returns {HTMLElement} The created element
     * @description Creates an HTML element with specified attributes and content.
     */
    static createElement(tagName, attributes = {}, content = '') {
        const element = document.createElement(tagName);
        
        // Set attributes
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'textContent') {
                element.textContent = value;
            } else if (key === 'innerHTML') {
                element.innerHTML = value;
            } else {
                element.setAttribute(key, value);
            }
        });
        
        // Set content
        if (content) {
            element.textContent = content;
        }
        
        return element;
    }

    /**
     * Sets the text content of an element safely.
     * 
     * @static
     * @method setTextContent
     * @param {string} id - Element ID
     * @param {string} text - Text content to set
     * @returns {boolean} True if successful, false if element not found
     * @description Safely sets the text content of an element by ID.
     */
    static setTextContent(id, text) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = text;
            return true;
        }
        return false;
    }

    /**
     * Sets the inner HTML of an element safely.
     * 
     * @static
     * @method setInnerHTML
     * @param {string} id - Element ID
     * @param {string} html - HTML content to set
     * @returns {boolean} True if successful, false if element not found
     * @description Safely sets the inner HTML of an element by ID.
     */
    static setInnerHTML(id, html) {
        const element = document.getElementById(id);
        if (element) {
            element.innerHTML = html;
            return true;
        }
        return false;
    }

    /**
     * Adds a CSS class to an element safely.
     * 
     * @static
     * @method addClass
     * @param {string} id - Element ID
     * @param {string} className - CSS class to add
     * @returns {boolean} True if successful, false if element not found
     * @description Safely adds a CSS class to an element by ID.
     */
    static addClass(id, className) {
        const element = document.getElementById(id);
        if (element) {
            element.classList.add(className);
            return true;
        }
        return false;
    }

    /**
     * Removes a CSS class from an element safely.
     * 
     * @static
     * @method removeClass
     * @param {string} id - Element ID
     * @param {string} className - CSS class to remove
     * @returns {boolean} True if successful, false if element not found
     * @description Safely removes a CSS class from an element by ID.
     */
    static removeClass(id, className) {
        const element = document.getElementById(id);
        if (element) {
            element.classList.remove(className);
            return true;
        }
        return false;
    }

    /**
     * Toggles a CSS class on an element safely.
     * 
     * @static
     * @method toggleClass
     * @param {string} id - Element ID
     * @param {string} className - CSS class to toggle
     * @returns {boolean} True if successful, false if element not found
     * @description Safely toggles a CSS class on an element by ID.
     */
    static toggleClass(id, className) {
        const element = document.getElementById(id);
        if (element) {
            element.classList.toggle(className);
            return true;
        }
        return false;
    }

    /**
     * Shows an element by removing 'hidden' class.
     * 
     * @static
     * @method showElement
     * @param {string} id - Element ID
     * @returns {boolean} True if successful, false if element not found
     * @description Shows an element by removing the 'hidden' CSS class.
     */
    static showElement(id) {
        return this.removeClass(id, 'hidden');
    }

    /**
     * Hides an element by adding 'hidden' class.
     * 
     * @static
     * @method hideElement
     * @param {string} id - Element ID
     * @returns {boolean} True if successful, false if element not found
     * @description Hides an element by adding the 'hidden' CSS class.
     */
    static hideElement(id) {
        return this.addClass(id, 'hidden');
    }

    /**
     * Shows a modal by adding 'show' class.
     * 
     * @static
     * @method showModal
     * @param {string} id - Modal element ID
     * @returns {boolean} True if successful, false if element not found
     * @description Shows a modal by adding the 'show' CSS class.
     */
    static showModal(id) {
        const success = this.addClass(id, 'show');
        if (success) {
            document.body.style.overflow = 'hidden';
        }
        return success;
    }

    /**
     * Hides a modal by removing 'show' class.
     * 
     * @static
     * @method hideModal
     * @param {string} id - Modal element ID
     * @returns {boolean} True if successful, false if element not found
     * @description Hides a modal by removing the 'show' CSS class.
     */
    static hideModal(id) {
        const success = this.removeClass(id, 'show');
        if (success) {
            document.body.style.overflow = '';
        }
        return success;
    }

    /**
     * Adds an event listener safely.
     * 
     * @static
     * @method addEventListener
     * @param {string} id - Element ID
     * @param {string} event - Event type
     * @param {Function} handler - Event handler function
     * @returns {boolean} True if successful, false if element not found
     * @description Safely adds an event listener to an element by ID.
     */
    static addEventListener(id, event, handler) {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener(event, handler);
            return true;
        }
        return false;
    }

    /**
     * Removes an event listener safely.
     * 
     * @static
     * @method removeEventListener
     * @param {string} id - Element ID
     * @param {string} event - Event type
     * @param {Function} handler - Event handler function
     * @returns {boolean} True if successful, false if element not found
     * @description Safely removes an event listener from an element by ID.
     */
    static removeEventListener(id, event, handler) {
        const element = document.getElementById(id);
        if (element) {
            element.removeEventListener(event, handler);
            return true;
        }
        return false;
    }

    /**
     * Sets a CSS style property safely.
     * 
     * @static
     * @method setStyle
     * @param {string} id - Element ID
     * @param {string} property - CSS property name
     * @param {string} value - CSS property value
     * @returns {boolean} True if successful, false if element not found
     * @description Safely sets a CSS style property on an element by ID.
     */
    static setStyle(id, property, value) {
        const element = document.getElementById(id);
        if (element) {
            element.style[property] = value;
            return true;
        }
        return false;
    }

    /**
     * Gets a CSS style property value safely.
     * 
     * @static
     * @method getStyle
     * @param {string} id - Element ID
     * @param {string} property - CSS property name
     * @returns {string|null} The style value or null if element not found
     * @description Safely gets a CSS style property value from an element by ID.
     */
    static getStyle(id, property) {
        const element = document.getElementById(id);
        if (element) {
            return element.style[property];
        }
        return null;
    }
} 