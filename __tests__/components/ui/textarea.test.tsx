import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Textarea } from '@/components/ui/textarea';

describe('Textarea', () => {
    it('renders a textarea element', () => {
        render(<Textarea />);
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('has data-slot="textarea" attribute', () => {
        render(<Textarea />);
        const textarea = screen.getByRole('textbox');
        expect(textarea).toHaveAttribute('data-slot', 'textarea');
    });

    it('renders with placeholder', () => {
        render(<Textarea placeholder="Enter description" />);
        expect(screen.getByPlaceholderText('Enter description')).toBeInTheDocument();
    });

    it('applies default styling classes', () => {
        render(<Textarea />);
        const textarea = screen.getByRole('textbox');
        expect(textarea.className).toContain('rounded-lg');
        expect(textarea.className).toContain('border');
        expect(textarea.className).toContain('min-h-16');
    });

    it('merges additional className', () => {
        render(<Textarea className="custom-textarea" />);
        const textarea = screen.getByRole('textbox');
        expect(textarea.className).toContain('custom-textarea');
    });

    it('renders as disabled when disabled prop is set', () => {
        render(<Textarea disabled />);
        expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('renders with value', () => {
        render(<Textarea value="Some text content" onChange={() => {}} />);
        const textarea = screen.getByRole('textbox');
        expect(textarea).toHaveValue('Some text content');
    });

    it('passes additional props through', () => {
        render(<Textarea rows={5} />);
        const textarea = screen.getByRole('textbox');
        expect(textarea).toHaveAttribute('rows', '5');
    });

    it('renders as a textarea HTML element (not input)', () => {
        render(<Textarea />);
        const textarea = screen.getByRole('textbox');
        expect(textarea.tagName.toLowerCase()).toBe('textarea');
    });
});