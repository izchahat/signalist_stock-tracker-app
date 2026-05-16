import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
    Popover,
    PopoverTrigger,
    PopoverHeader,
    PopoverTitle,
    PopoverDescription,
} from '@/components/ui/popover';

describe('Popover', () => {
    it('renders without crashing', () => {
        expect(() => render(<Popover><div>content</div></Popover>)).not.toThrow();
    });

    it('PopoverTrigger renders its children', () => {
        render(
            <Popover>
                <PopoverTrigger>
                    <button>Open Popover</button>
                </PopoverTrigger>
            </Popover>
        );
        expect(screen.getByText('Open Popover')).toBeInTheDocument();
    });
});

describe('PopoverHeader', () => {
    it('renders children', () => {
        render(<PopoverHeader><span>Header</span></PopoverHeader>);
        expect(screen.getByText('Header')).toBeInTheDocument();
    });

    it('has data-slot="popover-header"', () => {
        render(<PopoverHeader data-testid="ph" />);
        expect(screen.getByTestId('ph')).toHaveAttribute('data-slot', 'popover-header');
    });

    it('applies default styling classes', () => {
        render(<PopoverHeader data-testid="ph" />);
        const el = screen.getByTestId('ph');
        expect(el.className).toContain('flex');
        expect(el.className).toContain('flex-col');
        expect(el.className).toContain('text-sm');
    });

    it('merges additional className', () => {
        render(<PopoverHeader className="my-header" data-testid="ph" />);
        expect(screen.getByTestId('ph')).toHaveClass('my-header');
    });
});

describe('PopoverTitle', () => {
    it('renders text content', () => {
        render(<PopoverTitle>Popover Title</PopoverTitle>);
        expect(screen.getByText('Popover Title')).toBeInTheDocument();
    });

    it('has data-slot="popover-title"', () => {
        render(<PopoverTitle data-testid="pt" />);
        expect(screen.getByTestId('pt')).toHaveAttribute('data-slot', 'popover-title');
    });

    it('applies font-medium class', () => {
        render(<PopoverTitle data-testid="pt">Title</PopoverTitle>);
        expect(screen.getByTestId('pt').className).toContain('font-medium');
    });
});

describe('PopoverDescription', () => {
    it('renders text content', () => {
        render(<PopoverDescription>Some description</PopoverDescription>);
        expect(screen.getByText('Some description')).toBeInTheDocument();
    });

    it('has data-slot="popover-description"', () => {
        render(<PopoverDescription data-testid="pd" />);
        expect(screen.getByTestId('pd')).toHaveAttribute('data-slot', 'popover-description');
    });

    it('applies text-muted-foreground class', () => {
        render(<PopoverDescription data-testid="pd">Desc</PopoverDescription>);
        expect(screen.getByTestId('pd').className).toContain('text-muted-foreground');
    });
});