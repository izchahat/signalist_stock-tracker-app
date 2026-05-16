import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignUp from '@/app/(auth)/sign-up/page';

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

// Mock CountrySelectField since it uses complex Radix/cmdk/country-list
vi.mock('@/components/forms/CountrySelectField', () => ({
    default: ({ name, label, error }: any) => (
        <div data-testid="country-select-field">
            <label htmlFor={name}>{label}</label>
            <select id={name} name={name} data-testid="country-select">
                <option value="US">United States</option>
                <option value="CA">Canada</option>
            </select>
            {error && <p className="text-sm text-red-500">{error.message}</p>}
        </div>
    ),
}));

// Mock SelectField since it uses Radix Select
vi.mock('@/components/forms/SelectField', () => ({
    default: ({ name, label, placeholder, options, error }: any) => (
        <div data-testid={`select-field-${name}`}>
            <label htmlFor={name}>{label}</label>
            <select id={name} name={name}>
                <option value="">{placeholder}</option>
                {options?.map((opt: any) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            {error && <p className="text-sm text-red-500">{error.message}</p>}
        </div>
    ),
}));

describe('SignUp Page', () => {
    it('renders without crashing', () => {
        expect(() => render(<SignUp />)).not.toThrow();
    });

    it('renders the "Sign Up & Personalize" heading', () => {
        render(<SignUp />);
        expect(screen.getByText('Sign Up & Personalize')).toBeInTheDocument();
    });

    it('renders the Full Name input field', () => {
        render(<SignUp />);
        expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    });

    it('renders the Email input field', () => {
        render(<SignUp />);
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('renders the Password input field', () => {
        render(<SignUp />);
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('full name input has correct placeholder', () => {
        render(<SignUp />);
        expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument();
    });

    it('email input has correct placeholder', () => {
        render(<SignUp />);
        expect(screen.getByPlaceholderText('example@gmail.com')).toBeInTheDocument();
    });

    it('password input has correct placeholder', () => {
        render(<SignUp />);
        expect(screen.getByPlaceholderText('Enter a strong password')).toBeInTheDocument();
    });

    it('password input has type=password', () => {
        render(<SignUp />);
        const passwordInput = screen.getByPlaceholderText('Enter a strong password');
        expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('renders the Country select field', () => {
        render(<SignUp />);
        expect(screen.getByTestId('country-select-field')).toBeInTheDocument();
    });

    it('renders the Investment Goals select field', () => {
        render(<SignUp />);
        expect(screen.getByTestId('select-field-investmentGoals')).toBeInTheDocument();
    });

    it('renders the Risk Tolerance select field', () => {
        render(<SignUp />);
        expect(screen.getByTestId('select-field-riskTolerance')).toBeInTheDocument();
    });

    it('renders the Preferred Industry select field', () => {
        render(<SignUp />);
        expect(screen.getByTestId('select-field-preferredIndustry')).toBeInTheDocument();
    });

    it('renders the submit button with correct label', () => {
        render(<SignUp />);
        expect(screen.getByRole('button', { name: 'Start Your Investing Journey' })).toBeInTheDocument();
    });

    it('submit button has type=submit', () => {
        render(<SignUp />);
        const button = screen.getByRole('button', { name: 'Start Your Investing Journey' });
        expect(button).toHaveAttribute('type', 'submit');
    });

    it('submit button is initially enabled', () => {
        render(<SignUp />);
        const button = screen.getByRole('button', { name: 'Start Your Investing Journey' });
        expect(button).not.toBeDisabled();
    });

    it('renders the footer link "Sign in"', () => {
        render(<SignUp />);
        expect(screen.getByRole('link', { name: 'Sign in' })).toBeInTheDocument();
    });

    it('footer link points to /sign-in', () => {
        render(<SignUp />);
        const link = screen.getByRole('link', { name: 'Sign in' });
        expect(link).toHaveAttribute('href', '/sign-in');
    });

    it('renders footer text about existing account', () => {
        render(<SignUp />);
        expect(screen.getByText('Already have an account?')).toBeInTheDocument();
    });

    it('shows full name validation error when submitted empty', async () => {
        const user = userEvent.setup();
        render(<SignUp />);
        const submitButton = screen.getByRole('button', { name: 'Start Your Investing Journey' });
        await user.click(submitButton);
        await waitFor(() => {
            expect(screen.getByText('Full name is required')).toBeInTheDocument();
        });
    });

    it('does not show validation errors on initial render', () => {
        render(<SignUp />);
        expect(screen.queryByText('Full name is required')).not.toBeInTheDocument();
        expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
    });

    it('renders Investment Goals label', () => {
        render(<SignUp />);
        expect(screen.getByText('Investment GoalS')).toBeInTheDocument();
    });

    it('renders Risk Tolerance label', () => {
        render(<SignUp />);
        expect(screen.getByText('Risk Tolerance')).toBeInTheDocument();
    });

    it('renders Preferred Industry label', () => {
        render(<SignUp />);
        expect(screen.getByText('Preferred Industry')).toBeInTheDocument();
    });

    it('renders Country label', () => {
        render(<SignUp />);
        expect(screen.getByText('Country')).toBeInTheDocument();
    });
});