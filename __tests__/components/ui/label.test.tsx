import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Label } from '@/components/ui/label';

describe('Label', () => {
    it('renders label text', () => {
        render(<Label>Email</Label>);
        expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('has data-slot="label" attribute', () => {
        render(<Label>Email</Label>);
        const label = screen.getByText('Email');
        expect(label).toHaveAttribute('data-slot', 'label');
    });

    it('renders with htmlFor attribute', () => {
        render(<Label htmlFor="email-input">Email</Label>);
        const label = screen.getByText('Email');
        expect(label).toHaveAttribute('for', 'email-input');
    });

    it('applies default styling classes', () => {
        render(<Label>Test Label</Label>);
        const label = screen.getByText('Test Label');
        expect(label.className).toContain('text-sm');
        expect(label.className).toContain('font-medium');
    });

    it('merges additional className', () => {
        render(<Label className="form-label">Custom Label</Label>);
        const label = screen.getByText('Custom Label');
        expect(label.className).toContain('form-label');
    });

    it('renders children content', () => {
        render(
            <Label>
                <span>Password</span>
            </Label>
        );
        expect(screen.getByText('Password')).toBeInTheDocument();
    });

    it('is associated with an input via htmlFor', () => {
        render(
            <div>
                <Label htmlFor="name-input">Name</Label>
                <input id="name-input" type="text" />
            </div>
        );
        const label = screen.getByText('Name');
        const input = screen.getByRole('textbox');
        expect(label).toHaveAttribute('for', 'name-input');
        expect(input).toHaveAttribute('id', 'name-input');
    });
});