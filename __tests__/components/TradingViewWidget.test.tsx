import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import TradingViewWidget from '@/components/TradingViewWidget';

// Mock the useTradingViewWidget hook
vi.mock('@/hooks/useTradingViewWidget', () => ({
    default: vi.fn(() => ({ current: null })),
}));

const DEFAULT_PROPS = {
    scriptUrl: 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js',
    config: { colorTheme: 'dark' },
};

describe('TradingViewWidget', () => {
    it('renders without crashing', () => {
        expect(() => render(<TradingViewWidget {...DEFAULT_PROPS} />)).not.toThrow();
    });

    it('renders the title when provided', () => {
        render(<TradingViewWidget {...DEFAULT_PROPS} title="Market Overview" />);
        expect(screen.getByText('Market Overview')).toBeInTheDocument();
    });

    it('does not render a title element when title prop is omitted', () => {
        render(<TradingViewWidget {...DEFAULT_PROPS} />);
        expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument();
    });

    it('does not render a title element when title is an empty string', () => {
        render(<TradingViewWidget {...DEFAULT_PROPS} title="" />);
        expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument();
    });

    it('renders the title in an h3 element', () => {
        render(<TradingViewWidget {...DEFAULT_PROPS} title="Heat Map" />);
        const heading = screen.getByRole('heading', { level: 3 });
        expect(heading).toHaveTextContent('Heat Map');
    });

    it('title h3 has correct styling classes', () => {
        render(<TradingViewWidget {...DEFAULT_PROPS} title="My Widget" />);
        const heading = screen.getByRole('heading', { level: 3 });
        expect(heading.className).toContain('font-semibold');
        expect(heading.className).toContain('text-2xl');
        expect(heading.className).toContain('text-gray-100');
        expect(heading.className).toContain('mb-5');
    });

    it('renders the tradingview widget container', () => {
        render(<TradingViewWidget {...DEFAULT_PROPS} />);
        const container = document.querySelector('.tradingview-widget-container');
        expect(container).toBeTruthy();
    });

    it('renders the inner widget div', () => {
        render(<TradingViewWidget {...DEFAULT_PROPS} />);
        const innerWidget = document.querySelector('.tradingview-widget-container__widget');
        expect(innerWidget).toBeTruthy();
    });

    it('inner widget div has default height of 600px', () => {
        render(<TradingViewWidget {...DEFAULT_PROPS} />);
        const innerWidget = document.querySelector('.tradingview-widget-container__widget') as HTMLElement;
        expect(innerWidget.style.height).toBe('600px');
    });

    it('inner widget div has custom height when height prop is provided', () => {
        render(<TradingViewWidget {...DEFAULT_PROPS} height={400} />);
        const innerWidget = document.querySelector('.tradingview-widget-container__widget') as HTMLElement;
        expect(innerWidget.style.height).toBe('400px');
    });

    it('inner widget div has width of 100%', () => {
        render(<TradingViewWidget {...DEFAULT_PROPS} />);
        const innerWidget = document.querySelector('.tradingview-widget-container__widget') as HTMLElement;
        expect(innerWidget.style.width).toBe('100%');
    });

    it('applies additional className to the container', () => {
        render(<TradingViewWidget {...DEFAULT_PROPS} className="my-custom-widget" />);
        const container = document.querySelector('.tradingview-widget-container');
        expect(container?.className).toContain('my-custom-widget');
    });

    it('renders the outer wrapper with w-full class', () => {
        const { container } = render(<TradingViewWidget {...DEFAULT_PROPS} />);
        const outerWrapper = container.firstChild as HTMLElement;
        expect(outerWrapper.className).toContain('w-full');
    });

    it('renders different titles correctly', () => {
        const { rerender } = render(<TradingViewWidget {...DEFAULT_PROPS} title="First Title" />);
        expect(screen.getByText('First Title')).toBeInTheDocument();

        rerender(<TradingViewWidget {...DEFAULT_PROPS} title="Second Title" />);
        expect(screen.getByText('Second Title')).toBeInTheDocument();
        expect(screen.queryByText('First Title')).not.toBeInTheDocument();
    });
});