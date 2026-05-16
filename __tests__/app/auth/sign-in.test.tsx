import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignIn from '@/app/(auth)/sign-in/page';

vi.mock('next/link', () => ({
    default: ({ children, href, className }: any) => (
        <a href={href} className={className}>{children}</a>
    ),
}));

vi.mock('@/components/ui/button', () => ({
    Button: ({ children, type, disabled, className }: any) => (
        <button type={type} disabled={disabled} className={className}>
            {children}
        </button>
    ),
}));

vi.mock('@/components/ui/label', () => ({
    Label: ({ children, htmlFor, className }: any) => (
        <label htmlFor={htmlFor} className={className}>{children}</label>
    ),
}));

describe('SignIn Page', () => {
    it('renders without crashing', () => {
        expect(() => render(<SignIn />)).not.toThrow();
    });

    it('renders the "Welcome Back" heading', () => {
        render(<SignIn />);
        expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    });

    it('renders the email input field', () => {
        render(<SignIn />);
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('renders the password input field', () => {
        render(<SignIn />);
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('email input has correct placeholder', () => {
        render(<SignIn />);
        expect(screen.getByPlaceholderText('example@gmail.com')).toBeInTheDocument();
    });

    it('password input has correct placeholder', () => {
        render(<SignIn />);
        expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    });

    it('password input has type=password', () => {
        render(<SignIn />);
        const passwordInput = screen.getByPlaceholderText('Enter your password');
        expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('renders the sign in submit button', () => {
        render(<SignIn />);
        expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    });

    it('submit button has type=submit', () => {
        render(<SignIn />);
        const button = screen.getByRole('button', { name: 'Sign In' });
        expect(button).toHaveAttribute('type', 'submit');
    });

    it('submit button is initially enabled', () => {
        render(<SignIn />);
        const button = screen.getByRole('button', { name: 'Sign In' });
        expect(button).not.toBeDisabled();
    });

    it('renders the footer link "Sign up"', () => {
        render(<SignIn />);
        expect(screen.getByRole('link', { name: 'Sign up' })).toBeInTheDocument();
    });

    it('footer link points to /sign-up', () => {
        render(<SignIn />);
        const link = screen.getByRole('link', { name: 'Sign up' });
        expect(link).toHaveAttribute('href', '/sign-up');
    });

    it('renders footer text about not having an account', () => {
        render(<SignIn />);
        expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    });

    it('shows email validation error when email is empty and form is submitted', async () => {
        const user = userEvent.setup();
        render(<SignIn />);
        const submitButton = screen.getByRole('button', { name: 'Sign In' });
        await user.click(submitButton);
        await waitFor(() => {
            expect(screen.getByText('Email is required')).toBeInTheDocument();
        });
    });

    it('shows password validation error when password is empty and form is submitted', async () => {
        const user = userEvent.setup();
        render(<SignIn />);
        // Fill email but leave password empty
        const emailInput = screen.getByPlaceholderText('example@gmail.com');
        await user.type(emailInput, 'test@example.com');
        const submitButton = screen.getByRole('button', { name: 'Sign In' });
        await user.click(submitButton);
        await waitFor(() => {
            expect(screen.getByText('Password is required')).toBeInTheDocument();
        });
    });

    it('shows invalid email error for malformed email', async () => {
        const user = userEvent.setup();
        render(<SignIn />);
        const emailInput = screen.getByPlaceholderText('example@gmail.com');
        await user.type(emailInput, 'not-an-email');
        await user.tab(); // trigger onBlur validation
        await waitFor(() => {
            expect(screen.getByText('Invalid email address')).toBeInTheDocument();
        });
    });

    it('does not show error messages on initial render', () => {
        render(<SignIn />);
        expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
        expect(screen.queryByText('Password is required')).not.toBeInTheDocument();
        expect(screen.queryByText('Invalid email address')).not.toBeInTheDocument();
    });
});