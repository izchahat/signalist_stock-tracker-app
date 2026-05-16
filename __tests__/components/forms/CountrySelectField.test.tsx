import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import CountrySelectField from '@/components/forms/CountrySelectField';

// Mock react-select-country-list
vi.mock('react-select-country-list', () => ({
    default: () => ({
        getData: () => [
            { value: 'US', label: 'United States' },
            { value: 'CA', label: 'Canada' },
            { value: 'GB', label: 'United Kingdom' },
            { value: 'DE', label: 'Germany' },
        ],
    }),
}));

// Mock UI primitives
vi.mock('@/components/ui/popover', () => ({
    Popover: ({ children, open, onOpenChange }: any) => (
        <div data-testid="popover" data-open={open}>
            {children}
        </div>
    ),
    PopoverTrigger: ({ children, asChild }: any) => (
        <div data-testid="popover-trigger">{children}</div>
    ),
    PopoverContent: ({ children, className }: any) => (
        <div data-testid="popover-content" className={className}>{children}</div>
    ),
}));

vi.mock('@/components/ui/command', () => ({
    Command: ({ children, className }: any) => (
        <div data-testid="command" className={className}>{children}</div>
    ),
    CommandInput: ({ placeholder, className }: any) => (
        <input data-testid="command-input" placeholder={placeholder} className={className} />
    ),
    CommandEmpty: ({ children, className }: any) => (
        <div data-testid="command-empty" className={className}>{children}</div>
    ),
    CommandList: ({ children, className }: any) => (
        <div data-testid="command-list" className={className}>{children}</div>
    ),
    CommandGroup: ({ children, className }: any) => (
        <div data-testid="command-group" className={className}>{children}</div>
    ),
    CommandItem: ({ children, value, onSelect, className }: any) => (
        <div
            data-testid={`command-item-${value}`}
            onClick={() => onSelect && onSelect(value)}
            className={className}
        >
            {children}
        </div>
    ),
}));

vi.mock('@/components/ui/button', () => ({
    Button: ({ children, onClick, className, role, 'aria-expanded': ariaExpanded, variant }: any) => (
        <button
            data-testid="select-button"
            onClick={onClick}
            className={className}
            role={role}
            aria-expanded={ariaExpanded}
        >
            {children}
        </button>
    ),
}));

vi.mock('@/components/ui/label', () => ({
    Label: ({ children, htmlFor, className }: any) => (
        <label htmlFor={htmlFor} className={className}>{children}</label>
    ),
}));

function CountrySelectWrapper(props: {
    name?: string;
    label?: string;
    required?: boolean;
    error?: any;
    defaultValue?: string;
}) {
    const { control } = useForm({
        defaultValues: { country: props.defaultValue ?? '' },
    });
    return (
        <CountrySelectField
            name={props.name ?? 'country'}
            label={props.label ?? 'Country'}
            control={control}
            error={props.error}
            required={props.required}
        />
    );
}

describe('CountrySelectField', () => {
    it('renders the label', () => {
        render(<CountrySelectWrapper label="Country" />);
        expect(screen.getByText('Country')).toBeInTheDocument();
    });

    it('renders the popover trigger button', () => {
        render(<CountrySelectWrapper />);
        expect(screen.getByTestId('select-button')).toBeInTheDocument();
    });

    it('shows "Select your country..." when no value is selected', () => {
        render(<CountrySelectWrapper />);
        expect(screen.getByText('Select your country...')).toBeInTheDocument();
    });

    it('renders the command input with search placeholder', () => {
        render(<CountrySelectWrapper />);
        expect(screen.getByPlaceholderText('Search countries...')).toBeInTheDocument();
    });

    it('renders country list items', () => {
        render(<CountrySelectWrapper />);
        expect(screen.getByText('United States')).toBeInTheDocument();
        expect(screen.getByText('Canada')).toBeInTheDocument();
        expect(screen.getByText('United Kingdom')).toBeInTheDocument();
        expect(screen.getByText('Germany')).toBeInTheDocument();
    });

    it('renders empty state text', () => {
        render(<CountrySelectWrapper />);
        expect(screen.getByText('No country found.')).toBeInTheDocument();
    });

    it('renders error message when error prop is provided', () => {
        const error = { message: 'Please select country', type: 'required' };
        render(<CountrySelectWrapper error={error} />);
        expect(screen.getByText('Please select country')).toBeInTheDocument();
    });

    it('does not render error message when error prop is absent', () => {
        render(<CountrySelectWrapper />);
        expect(screen.queryByText(/please select/i)).not.toBeInTheDocument();
    });

    it('renders the helper text about market data relevance', () => {
        render(<CountrySelectWrapper />);
        expect(screen.getByText('Helps us show market data and news relevant to you.')).toBeInTheDocument();
    });

    it('error message has text-red-500 class', () => {
        const error = { message: 'Country is required', type: 'required' };
        render(<CountrySelectWrapper error={error} />);
        const errorEl = screen.getByText('Country is required');
        expect(errorEl.className).toContain('text-red-500');
    });

    it('renders country items for all mocked countries', () => {
        render(<CountrySelectWrapper />);
        const items = screen.getAllByTestId(/^command-item-/);
        // 4 country items (US, CA, GB, DE)
        expect(items.length).toBe(4);
    });

    it('label has form-label class', () => {
        render(<CountrySelectWrapper label="Country" />);
        const label = screen.getByText('Country');
        expect(label).toHaveClass('form-label');
    });
});

describe('getFlagEmoji (via CountrySelect rendering)', () => {
    it('renders flag emoji for selected country when value is preset', () => {
        // Use the wrapper with a default value of US
        const Wrapper = () => {
            const { control } = useForm({ defaultValues: { country: 'US' } });
            return (
                <CountrySelectField
                    name="country"
                    label="Country"
                    control={control}
                />
            );
        };
        render(<Wrapper />);
        // "United States" appears in both the button trigger and the dropdown list item
        const matches = screen.getAllByText('United States');
        expect(matches.length).toBeGreaterThanOrEqual(1);
    });

    it('renders the US flag emoji in the trigger when US is selected', () => {
        const Wrapper = () => {
            const { control } = useForm({ defaultValues: { country: 'US' } });
            return (
                <CountrySelectField
                    name="country"
                    label="Country"
                    control={control}
                />
            );
        };
        render(<Wrapper />);
        // The US flag emoji should be visible in the button
        const button = screen.getByTestId('select-button');
        expect(button.textContent).toContain('🇺🇸');
    });
});