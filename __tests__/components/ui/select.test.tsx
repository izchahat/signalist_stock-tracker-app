import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
    Select,
    SelectGroup,
    SelectValue,
    SelectTrigger,
    SelectContent,
    SelectLabel,
    SelectItem,
    SelectSeparator,
} from '@/components/ui/select';

describe('Select components render without crashing', () => {
    it('Select renders without error', () => {
        expect(() => render(<Select><div>content</div></Select>)).not.toThrow();
    });

    it('SelectTrigger renders and has data-slot="select-trigger"', () => {
        render(
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="Pick one" />
                </SelectTrigger>
            </Select>
        );
        const trigger = screen.getByRole('combobox');
        expect(trigger).toHaveAttribute('data-slot', 'select-trigger');
    });

    it('SelectTrigger shows placeholder text', () => {
        render(
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                </SelectTrigger>
            </Select>
        );
        expect(screen.getByText('Select an option')).toBeInTheDocument();
    });

    it('SelectTrigger applies default styling', () => {
        render(
            <Select>
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
            </Select>
        );
        const trigger = screen.getByRole('combobox');
        expect(trigger.className).toContain('rounded-lg');
    });

    it('SelectTrigger applies custom className', () => {
        render(
            <Select>
                <SelectTrigger className="select-trigger">
                    <SelectValue />
                </SelectTrigger>
            </Select>
        );
        const trigger = screen.getByRole('combobox');
        expect(trigger.className).toContain('select-trigger');
    });

    it('SelectTrigger has size data-attribute', () => {
        render(
            <Select>
                <SelectTrigger size="sm">
                    <SelectValue />
                </SelectTrigger>
            </Select>
        );
        const trigger = screen.getByRole('combobox');
        expect(trigger).toHaveAttribute('data-size', 'sm');
    });

    it('SelectTrigger defaults to size=default', () => {
        render(
            <Select>
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
            </Select>
        );
        const trigger = screen.getByRole('combobox');
        expect(trigger).toHaveAttribute('data-size', 'default');
    });

    it('SelectTrigger is disabled when disabled prop is set', () => {
        render(
            <Select>
                <SelectTrigger disabled>
                    <SelectValue />
                </SelectTrigger>
            </Select>
        );
        expect(screen.getByRole('combobox')).toBeDisabled();
    });
});

describe('SelectGroup', () => {
    it('renders with data-slot="select-group"', () => {
        render(<SelectGroup data-testid="sg" />);
        expect(screen.getByTestId('sg')).toHaveAttribute('data-slot', 'select-group');
    });

    it('renders children', () => {
        render(<SelectGroup><span>Item</span></SelectGroup>);
        expect(screen.getByText('Item')).toBeInTheDocument();
    });
});

describe('SelectSeparator', () => {
    it('renders with data-slot="select-separator"', () => {
        render(<SelectSeparator data-testid="sep" />);
        expect(screen.getByTestId('sep')).toHaveAttribute('data-slot', 'select-separator');
    });
});