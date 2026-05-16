import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogClose,
} from '@/components/ui/dialog';

// Mock button used inside DialogContent
vi.mock('@/components/ui/button', () => ({
    Button: ({ children, onClick, variant, size, className }: any) => (
        <button onClick={onClick} className={className} data-variant={variant} data-size={size}>
            {children}
        </button>
    ),
}));

describe('DialogHeader', () => {
    it('renders children', () => {
        render(<DialogHeader><span>Header Content</span></DialogHeader>);
        expect(screen.getByText('Header Content')).toBeInTheDocument();
    });

    it('has data-slot="dialog-header"', () => {
        render(<DialogHeader data-testid="dh" />);
        expect(screen.getByTestId('dh')).toHaveAttribute('data-slot', 'dialog-header');
    });

    it('applies additional className', () => {
        render(<DialogHeader className="my-header" data-testid="dh" />);
        expect(screen.getByTestId('dh')).toHaveClass('my-header');
    });

    it('applies default flex flex-col gap-2 classes', () => {
        render(<DialogHeader data-testid="dh" />);
        const el = screen.getByTestId('dh');
        expect(el.className).toContain('flex');
        expect(el.className).toContain('flex-col');
    });
});

describe('DialogFooter', () => {
    it('renders children', () => {
        render(<DialogFooter><button>Submit</button></DialogFooter>);
        expect(screen.getByText('Submit')).toBeInTheDocument();
    });

    it('has data-slot="dialog-footer"', () => {
        render(<DialogFooter data-testid="df" />);
        expect(screen.getByTestId('df')).toHaveAttribute('data-slot', 'dialog-footer');
    });

    it('applies additional className', () => {
        render(<DialogFooter className="my-footer" data-testid="df" />);
        expect(screen.getByTestId('df')).toHaveClass('my-footer');
    });

    it('renders without showCloseButton by default', () => {
        render(<DialogFooter><button>OK</button></DialogFooter>);
        // Only the "OK" button should be present
        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(1);
        expect(buttons[0]).toHaveTextContent('OK');
    });
});

describe('Dialog components render without crashing', () => {
    it('Dialog renders without error', () => {
        expect(() => render(<Dialog><div>content</div></Dialog>)).not.toThrow();
    });

    it('DialogTrigger renders inside Dialog', () => {
        render(
            <Dialog>
                <DialogTrigger>Open</DialogTrigger>
            </Dialog>
        );
        expect(screen.getByText('Open')).toBeInTheDocument();
    });

    it('DialogTitle renders text correctly', () => {
        render(
            <Dialog open>
                <DialogContent>
                    <DialogTitle>My Dialog Title</DialogTitle>
                </DialogContent>
            </Dialog>
        );
        expect(screen.getByText('My Dialog Title')).toBeInTheDocument();
    });

    it('DialogDescription renders text correctly', () => {
        render(
            <Dialog open>
                <DialogContent>
                    <DialogTitle>Title</DialogTitle>
                    <DialogDescription>Some description text</DialogDescription>
                </DialogContent>
            </Dialog>
        );
        expect(screen.getByText('Some description text')).toBeInTheDocument();
    });

    it('DialogContent renders children when open', () => {
        render(
            <Dialog open>
                <DialogContent>
                    <DialogTitle>Title</DialogTitle>
                    <p>Dialog body content</p>
                </DialogContent>
            </Dialog>
        );
        expect(screen.getByText('Dialog body content')).toBeInTheDocument();
    });

    it('DialogContent shows close button by default', () => {
        render(
            <Dialog open>
                <DialogContent>
                    <DialogTitle>Title</DialogTitle>
                    <p>Content</p>
                </DialogContent>
            </Dialog>
        );
        expect(screen.getByText('Close')).toBeInTheDocument();
    });

    it('DialogContent hides close button when showCloseButton=false', () => {
        render(
            <Dialog open>
                <DialogContent showCloseButton={false}>
                    <DialogTitle>Title</DialogTitle>
                    <p>Content</p>
                </DialogContent>
            </Dialog>
        );
        expect(screen.queryByText('Close')).not.toBeInTheDocument();
    });

    it('DialogTitle has data-slot="dialog-title"', () => {
        render(
            <Dialog open>
                <DialogContent>
                    <DialogTitle>Test Title</DialogTitle>
                </DialogContent>
            </Dialog>
        );
        const title = screen.getByText('Test Title');
        expect(title).toHaveAttribute('data-slot', 'dialog-title');
    });

    it('DialogDescription has data-slot="dialog-description"', () => {
        render(
            <Dialog open>
                <DialogContent>
                    <DialogTitle>Title</DialogTitle>
                    <DialogDescription>Desc text</DialogDescription>
                </DialogContent>
            </Dialog>
        );
        const desc = screen.getByText('Desc text');
        expect(desc).toHaveAttribute('data-slot', 'dialog-description');
    });
});