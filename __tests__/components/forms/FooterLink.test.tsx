import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import FooterLink from '@/components/forms/FooterLink';

vi.mock('next/link', () => ({
    default: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
        <a href={href} className={className}>{children}</a>
    ),
}));

describe('FooterLink', () => {
    it('renders the descriptive text', () => {
        render(<FooterLink text="Don't have an account?" linkText="Sign up" href="/sign-up" />);
        expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    });

    it('renders the link text', () => {
        render(<FooterLink text="Don't have an account?" linkText="Sign up" href="/sign-up" />);
        expect(screen.getByText('Sign up')).toBeInTheDocument();
    });

    it('renders a link with the correct href', () => {
        render(<FooterLink text="Don't have an account?" linkText="Sign up" href="/sign-up" />);
        const link = screen.getByRole('link', { name: 'Sign up' });
        expect(link).toHaveAttribute('href', '/sign-up');
    });

    it('renders link with the footer-link class', () => {
        render(<FooterLink text="Don't have an account?" linkText="Sign up" href="/sign-up" />);
        const link = screen.getByRole('link', { name: 'Sign up' });
        expect(link).toHaveClass('footer-link');
    });

    it('renders descriptive text with text-gray-500 class', () => {
        render(<FooterLink text="Already have an account?" linkText="Sign in" href="/sign-in" />);
        const p = screen.getByText('Already have an account?', { exact: false }).closest('p');
        expect(p).toHaveClass('text-gray-500');
    });

    it('renders for sign-in scenario with correct href', () => {
        render(<FooterLink text="Already have an account?" linkText="Sign in" href="/sign-in" />);
        const link = screen.getByRole('link', { name: 'Sign in' });
        expect(link).toHaveAttribute('href', '/sign-in');
    });

    it('renders container with text-center and pt-4 classes', () => {
        render(<FooterLink text="Text" linkText="Link" href="/some-path" />);
        const container = screen.getByText('Text', { exact: false }).closest('div');
        expect(container).toHaveClass('text-center');
        expect(container).toHaveClass('pt-4');
    });

    it('renders different href values correctly', () => {
        render(<FooterLink text="Go here" linkText="Click me" href="/dashboard" />);
        const link = screen.getByRole('link', { name: 'Click me' });
        expect(link).toHaveAttribute('href', '/dashboard');
    });
});