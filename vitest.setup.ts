import '@testing-library/jest-dom';

// Polyfill ResizeObserver for cmdk and other components that use it
global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
};

// Polyfill scrollIntoView for cmdk
window.HTMLElement.prototype.scrollIntoView = function () {};
