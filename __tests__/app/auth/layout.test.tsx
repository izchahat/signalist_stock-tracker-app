import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Layout from '@/app/(auth)/layout';

vi.mock('next/link', () => ({
    default: ({ children, href, className }: any) => (
        <a href={href} className={className}>{children}</a>
    ),
}));

vi.mock('next/image', () => ({
    default: ({ src, alt, width, height, className }: any) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} width={width} height={height} className={className} />
    ),
}));

describe('Auth Layout', () => {
    it('renders without crashing', () => {
        expect(() =>
            render(
                <Layout>
                    <div>Test Child</div>
                </Layout>
            )
        ).not.toThrow();
    });

    it('renders children content', () => {
        render(
            <Layout>
                <div>Sign In Form</div>
            </Layout>
        );
        expect(screen.getByText('Sign In Form')).toBeInTheDocument();
    });

    it('renders the Signalist logo with correct alt text', () => {
        render(
            <Layout>
                <div>Child</div>
            </Layout>
        );
        const logo = screen.getByAltText('Signalist logo');
        expect(logo).toBeInTheDocument();
    });

    it('renders logo with correct src', () => {
        render(
            <Layout>
                <div>Child</div>
            </Layout>
        );
        const logo = screen.getByAltText('Signalist logo');
        expect(logo).toHaveAttribute('src', '/assets/icons/logo.svg');
    });

    it('renders the logo link pointing to home (/)', () => {
        render(
            <Layout>
                <div>Child</div>
            </Layout>
        );
        const logoLink = screen.getByAltText('Signalist logo').closest('a');
        expect(logoLink).toHaveAttribute('href', '/');
    });

    it('renders the testimonial blockquote', () => {
        render(
            <Layout>
                <div>Child</div>
            </Layout>
        );
        expect(
            screen.getByText(/Signalist turned my watchlist into a warning list/)
        ).toBeInTheDocument();
    });

    it('renders the testimonial author', () => {
        render(
            <Layout>
                <div>Child</div>
            </Layout>
        );
        expect(screen.getByText('- Ethan R.')).toBeInTheDocument();
    });

    it('renders the author occupation text', () => {
        render(
            <Layout>
                <div>Child</div>
            </Layout>
        );
        expect(screen.getByText('Retail Investor')).toBeInTheDocument();
    });

    it('renders 5 star images', () => {
        render(
            <Layout>
                <div>Child</div>
            </Layout>
        );
        const stars = screen.getAllByAltText('Star');
        expect(stars).toHaveLength(5);
    });

    it('star images have correct src', () => {
        render(
            <Layout>
                <div>Child</div>
            </Layout>
        );
        const stars = screen.getAllByAltText('Star');
        stars.forEach((star) => {
            expect(star).toHaveAttribute('src', '/assets/icons/star.svg');
        });
    });

    it('renders the dashboard preview image', () => {
        render(
            <Layout>
                <div>Child</div>
            </Layout>
        );
        const dashboard = screen.getByAltText('Dashboard Preview');
        expect(dashboard).toBeInTheDocument();
        expect(dashboard).toHaveAttribute('src', '/assets/images/dashboard.png');
    });

    it('renders the main element with auth-layout class', () => {
        render(
            <Layout>
                <div>Child</div>
            </Layout>
        );
        const main = screen.getByRole('main');
        expect(main).toHaveClass('auth-layout');
    });

    it('renders multiple children', () => {
        render(
            <Layout>
                <div>First Child</div>
                <div>Second Child</div>
            </Layout>
        );
        expect(screen.getByText('First Child')).toBeInTheDocument();
        expect(screen.getByText('Second Child')).toBeInTheDocument();
    });
});