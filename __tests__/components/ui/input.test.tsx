import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input } from '@/components/ui/input';

describe('Input', () => {
    it('renders an input element', () => {
        render(<Input />);
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('has data-slot="input" attribute', () => {
        render(<Input />);
        const input = screen.getByRole('textbox');
        expect(input).toHaveAttribute('data-slot', 'input');
    });

    it('renders with type attribute', () => {
        render(<Input type="email" />);
        const input = screen.getByRole('textbox');
        expect(input).toHaveAttribute('type', 'email');
    });

    it('renders with password type', () => {
        render(<Input type="password" data-testid="pwd-input" />);
        const input = screen.getByTestId('pwd-input');
        expect(input).toHaveAttribute('type', 'password');
    });

    it('accepts and renders placeholder', () => {
        render(<Input placeholder="Enter your email" />);
        expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    });

    it('merges additional className with default classes', () => {
        render(<Input className="my-custom-class" />);
        const input = screen.getByRole('textbox');
        expect(input.className).toContain('my-custom-class');
    });

    it('applies default styling classes', () => {
        render(<Input />);
        const input = screen.getByRole('textbox');
        expect(input.className).toContain('rounded-lg');
        expect(input.className).toContain('border');
    });

    it('renders as disabled when disabled prop is set', () => {
        render(<Input disabled />);
        expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('passes additional props through', () => {
        render(<Input aria-label="Email input" />);
        const input = screen.getByRole('textbox', { name: 'Email input' });
        expect(input).toBeInTheDocument();
    });

    it('renders with a value', () => {
        render(<Input value="test@example.com" onChange={() => {}} />);
        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('test@example.com');
    });
});