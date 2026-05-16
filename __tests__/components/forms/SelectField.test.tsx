import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import SelectField from '@/components/forms/SelectField';

// Mock radix-ui Select primitives with simple HTML elements
vi.mock('@/components/ui/select', () => ({
    Select: ({ children, value, onValueChange }: any) => (
        <div data-testid="select-root" data-value={value}>
            {children}
        </div>
    ),
    SelectTrigger: ({ children, className }: any) => (
        <button data-testid="select-trigger" className={className}>
            {children}
        </button>
    ),
    SelectValue: ({ placeholder }: any) => (
        <span data-testid="select-value">{placeholder}</span>
    ),
    SelectContent: ({ children, className }: any) => (
        <div data-testid="select-content" className={className}>
            {children}
        </div>
    ),
    SelectItem: ({ children, value, className }: any) => (
        <div data-testid={`select-item-${value}`} data-value={value} className={className}>
            {children}
        </div>
    ),
}));

vi.mock('@/components/ui/label', () => ({
    Label: ({ children, htmlFor, className }: any) => (
        <label htmlFor={htmlFor} className={className}>{children}</label>
    ),
}));

const TEST_OPTIONS = [
    { value: 'Growth', label: 'Growth' },
    { value: 'Income', label: 'Income' },
    { value: 'Balanced', label: 'Balanced' },
];

function SelectFieldWrapper(props: {
    name?: string;
    label?: string;
    placeholder?: string;
    options?: typeof TEST_OPTIONS;
    required?: boolean;
    error?: any;
}) {
    const { control } = useForm({
        defaultValues: { testSelect: '' },
    });
    return (
        <SelectField
            name={props.name ?? 'testSelect'}
            label={props.label ?? 'Test Select'}
            placeholder={props.placeholder ?? 'Select an option'}
            options={props.options ?? TEST_OPTIONS}
            control={control}
            error={props.error}
            required={props.required}
        />
    );
}

describe('SelectField', () => {
    it('renders the label', () => {
        render(<SelectFieldWrapper label="Investment Goals" />);
        expect(screen.getByText('Investment Goals')).toBeInTheDocument();
    });

    it('renders the placeholder text', () => {
        render(<SelectFieldWrapper placeholder="Pick a goal" />);
        expect(screen.getByText('Pick a goal')).toBeInTheDocument();
    });

    it('renders all provided options', () => {
        render(<SelectFieldWrapper options={TEST_OPTIONS} />);
        expect(screen.getByTestId('select-item-Growth')).toBeInTheDocument();
        expect(screen.getByTestId('select-item-Income')).toBeInTheDocument();
        expect(screen.getByTestId('select-item-Balanced')).toBeInTheDocument();
    });

    it('renders option labels correctly', () => {
        render(<SelectFieldWrapper options={TEST_OPTIONS} />);
        expect(screen.getByText('Growth')).toBeInTheDocument();
        expect(screen.getByText('Income')).toBeInTheDocument();
        expect(screen.getByText('Balanced')).toBeInTheDocument();
    });

    it('renders error message when error prop is provided', () => {
        const error = { message: 'Please select investment goals', type: 'required' };
        render(<SelectFieldWrapper error={error} />);
        expect(screen.getByText('Please select investment goals')).toBeInTheDocument();
    });

    it('does not render error message when no error prop', () => {
        render(<SelectFieldWrapper />);
        expect(screen.queryByText(/please select/i)).not.toBeInTheDocument();
    });

    it('error message has text-red-500 class', () => {
        const error = { message: 'Field is required', type: 'required' };
        render(<SelectFieldWrapper error={error} />);
        const errorEl = screen.getByText('Field is required');
        expect(errorEl.className).toContain('text-red-500');
    });

    it('label has htmlFor matching the field name', () => {
        render(<SelectFieldWrapper name="investmentGoals" label="Investment Goals" />);
        const label = screen.getByText('Investment Goals');
        expect(label).toHaveAttribute('for', 'investmentGoals');
    });

    it('renders the select-trigger with select-trigger class', () => {
        render(<SelectFieldWrapper />);
        const trigger = screen.getByTestId('select-trigger');
        expect(trigger).toHaveClass('select-trigger');
    });

    it('renders with an empty options array without crashing', () => {
        render(<SelectFieldWrapper options={[]} />);
        expect(screen.getByText('Test Select')).toBeInTheDocument();
        expect(screen.queryByTestId(/select-item-/)).not.toBeInTheDocument();
    });

    it('renders select-content with correct styling classes', () => {
        render(<SelectFieldWrapper />);
        const content = screen.getByTestId('select-content');
        expect(content.className).toContain('bg-gray-800');
        expect(content.className).toContain('border-gray-600');
    });
});