import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import InputField from '@/components/forms/InputField';
import { useForm } from 'react-hook-form';
import { act } from 'react';

vi.mock('next/link', () => ({
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    ),
}));

// Wrapper component to provide react-hook-form register
function InputFieldWrapper(props: Partial<Parameters<typeof InputField>[0]> & {
    name?: string;
    label?: string;
    placeholder?: string;
}) {
    const { register, formState: { errors } } = useForm();
    return (
        <InputField
            name={props.name ?? 'testField'}
            label={props.label ?? 'Test Label'}
            placeholder={props.placeholder ?? 'Test placeholder'}
            register={register}
            error={props.error}
            validation={props.validation}
            type={props.type}
            disabled={props.disabled}
            value={props.value}
        />
    );
}

describe('InputField', () => {
    it('renders the label', () => {
        render(<InputFieldWrapper label="Email" name="email" placeholder="Enter email" />);
        expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('renders the input with correct placeholder', () => {
        render(<InputFieldWrapper label="Email" name="email" placeholder="example@gmail.com" />);
        expect(screen.getByPlaceholderText('example@gmail.com')).toBeInTheDocument();
    });

    it('renders input with default type=text', () => {
        render(<InputFieldWrapper label="Name" name="name" placeholder="Your name" />);
        const input = screen.getByRole('textbox');
        expect(input).toHaveAttribute('type', 'text');
    });

    it('renders input with type=password when specified', () => {
        render(<InputFieldWrapper label="Password" name="password" placeholder="Enter password" type="password" />);
        const input = screen.getByPlaceholderText('Enter password');
        expect(input).toHaveAttribute('type', 'password');
    });

    it('renders label with htmlFor matching input id', () => {
        render(<InputFieldWrapper label="Email" name="email" placeholder="Enter email" />);
        const label = screen.getByText('Email');
        const input = screen.getByPlaceholderText('Enter email');
        expect(label).toHaveAttribute('for', 'email');
        expect(input).toHaveAttribute('id', 'email');
    });

    it('displays error message when error prop is provided', () => {
        const error = { message: 'Email is required', type: 'required' };
        render(
            <InputFieldWrapper
                label="Email"
                name="email"
                placeholder="Enter email"
                error={error as any}
            />
        );
        expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    it('does not display error message when error prop is absent', () => {
        render(<InputFieldWrapper label="Email" name="email" placeholder="Enter email" />);
        expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
    });

    it('renders input as disabled when disabled=true', () => {
        render(<InputFieldWrapper label="Email" name="email" placeholder="Enter email" disabled={true} />);
        const input = screen.getByPlaceholderText('Enter email');
        expect(input).toBeDisabled();
    });

    it('applies disabled CSS classes when disabled', () => {
        render(<InputFieldWrapper label="Email" name="email" placeholder="Enter email" disabled={true} />);
        const input = screen.getByPlaceholderText('Enter email');
        expect(input.className).toContain('opacity-50');
        expect(input.className).toContain('cursor-not-allowed');
    });

    it('does not apply disabled CSS classes when enabled', () => {
        render(<InputFieldWrapper label="Email" name="email" placeholder="Enter email" disabled={false} />);
        const input = screen.getByPlaceholderText('Enter email');
        expect(input.className).not.toContain('opacity-50');
    });

    it('renders with form-input class', () => {
        render(<InputFieldWrapper label="Email" name="email" placeholder="Enter email" />);
        const input = screen.getByPlaceholderText('Enter email');
        expect(input.className).toContain('form-input');
    });

    it('error message is styled with text-red-500', () => {
        const error = { message: 'Field required', type: 'required' };
        render(
            <InputFieldWrapper
                label="Field"
                name="field"
                placeholder="Enter value"
                error={error as any}
            />
        );
        const errorEl = screen.getByText('Field required');
        expect(errorEl.className).toContain('text-red-500');
    });
});