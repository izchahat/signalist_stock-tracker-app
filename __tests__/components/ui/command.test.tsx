import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
    CommandShortcut,
    CommandSeparator,
} from '@/components/ui/command';

// Mock the dialog components used in CommandDialog
vi.mock('@/components/ui/dialog', () => ({
    Dialog: ({ children }: any) => <div data-testid="dialog">{children}</div>,
    DialogContent: ({ children, className }: any) => (
        <div data-testid="dialog-content" className={className}>{children}</div>
    ),
    DialogHeader: ({ children, className }: any) => (
        <div data-testid="dialog-header" className={className}>{children}</div>
    ),
    DialogTitle: ({ children }: any) => <h2 data-testid="dialog-title">{children}</h2>,
    DialogDescription: ({ children }: any) => <p data-testid="dialog-description">{children}</p>,
}));

vi.mock('@/components/ui/input-group', () => ({
    InputGroup: ({ children, className }: any) => (
        <div data-testid="input-group" className={className}>{children}</div>
    ),
    InputGroupAddon: ({ children }: any) => <div data-testid="input-group-addon">{children}</div>,
}));

describe('Command', () => {
    it('renders without crashing', () => {
        expect(() => render(<Command />)).not.toThrow();
    });

    it('has data-slot="command"', () => {
        render(<Command data-testid="cmd" />);
        expect(screen.getByTestId('cmd')).toHaveAttribute('data-slot', 'command');
    });

    it('renders children', () => {
        render(<Command><span>Command Content</span></Command>);
        expect(screen.getByText('Command Content')).toBeInTheDocument();
    });

    it('applies default styling classes', () => {
        render(<Command data-testid="cmd" />);
        const el = screen.getByTestId('cmd');
        expect(el.className).toContain('flex');
        expect(el.className).toContain('overflow-hidden');
    });

    it('merges additional className', () => {
        render(<Command className="custom-cmd" data-testid="cmd" />);
        expect(screen.getByTestId('cmd')).toHaveClass('custom-cmd');
    });
});

describe('CommandEmpty', () => {
    it('renders text content', () => {
        render(
            <Command>
                <CommandEmpty>No results found.</CommandEmpty>
            </Command>
        );
        expect(screen.getByText('No results found.')).toBeInTheDocument();
    });

    it('has data-slot="command-empty"', () => {
        render(
            <Command>
                <CommandEmpty data-testid="ce">Empty</CommandEmpty>
            </Command>
        );
        expect(screen.getByTestId('ce')).toHaveAttribute('data-slot', 'command-empty');
    });
});

describe('CommandGroup', () => {
    it('renders children', () => {
        render(
            <Command>
                <CommandGroup><span>Group Content</span></CommandGroup>
            </Command>
        );
        expect(screen.getByText('Group Content')).toBeInTheDocument();
    });

    it('has data-slot="command-group"', () => {
        render(
            <Command>
                <CommandGroup data-testid="cg" />
            </Command>
        );
        expect(screen.getByTestId('cg')).toHaveAttribute('data-slot', 'command-group');
    });
});

describe('CommandList', () => {
    it('renders children', () => {
        render(
            <Command>
                <CommandList><span>List Content</span></CommandList>
            </Command>
        );
        expect(screen.getByText('List Content')).toBeInTheDocument();
    });

    it('has data-slot="command-list"', () => {
        render(
            <Command>
                <CommandList data-testid="cl" />
            </Command>
        );
        expect(screen.getByTestId('cl')).toHaveAttribute('data-slot', 'command-list');
    });

    it('applies default styling classes', () => {
        render(
            <Command>
                <CommandList data-testid="cl" />
            </Command>
        );
        const el = screen.getByTestId('cl');
        expect(el.className).toContain('max-h-72');
        expect(el.className).toContain('overflow-y-auto');
    });
});

describe('CommandItem', () => {
    it('renders children', () => {
        render(
            <Command>
                <CommandList>
                    <CommandGroup>
                        <CommandItem>Item Text</CommandItem>
                    </CommandGroup>
                </CommandList>
            </Command>
        );
        expect(screen.getByText('Item Text')).toBeInTheDocument();
    });

    it('has data-slot="command-item"', () => {
        render(
            <Command>
                <CommandList>
                    <CommandGroup>
                        <CommandItem data-testid="ci">Item</CommandItem>
                    </CommandGroup>
                </CommandList>
            </Command>
        );
        expect(screen.getByTestId('ci')).toHaveAttribute('data-slot', 'command-item');
    });

    it('applies custom className', () => {
        render(
            <Command>
                <CommandList>
                    <CommandGroup>
                        <CommandItem className="custom-item" data-testid="ci">Item</CommandItem>
                    </CommandGroup>
                </CommandList>
            </Command>
        );
        expect(screen.getByTestId('ci')).toHaveClass('custom-item');
    });
});

describe('CommandShortcut', () => {
    it('renders shortcut text', () => {
        render(<CommandShortcut>⌘K</CommandShortcut>);
        expect(screen.getByText('⌘K')).toBeInTheDocument();
    });

    it('has data-slot="command-shortcut"', () => {
        render(<CommandShortcut data-testid="cs">⌘K</CommandShortcut>);
        expect(screen.getByTestId('cs')).toHaveAttribute('data-slot', 'command-shortcut');
    });

    it('applies tracking-widest class', () => {
        render(<CommandShortcut data-testid="cs">⌘K</CommandShortcut>);
        expect(screen.getByTestId('cs').className).toContain('tracking-widest');
    });
});

describe('CommandSeparator', () => {
    it('renders without crashing', () => {
        expect(() =>
            render(
                <Command>
                    <CommandSeparator />
                </Command>
            )
        ).not.toThrow();
    });

    it('has data-slot="command-separator"', () => {
        render(
            <Command>
                <CommandSeparator data-testid="csep" />
            </Command>
        );
        expect(screen.getByTestId('csep')).toHaveAttribute('data-slot', 'command-separator');
    });
});