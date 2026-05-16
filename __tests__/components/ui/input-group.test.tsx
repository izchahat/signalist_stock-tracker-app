import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupText,
    InputGroupInput,
    InputGroupTextarea,
} from '@/components/ui/input-group';

describe('InputGroup', () => {
    it('renders the group container', () => {
        render(<InputGroup data-testid="ig" />);
        expect(screen.getByTestId('ig')).toBeInTheDocument();
    });

    it('has data-slot="input-group" attribute', () => {
        render(<InputGroup data-testid="ig" />);
        expect(screen.getByTestId('ig')).toHaveAttribute('data-slot', 'input-group');
    });

    it('has role="group"', () => {
        render(<InputGroup />);
        expect(screen.getByRole('group')).toBeInTheDocument();
    });

    it('applies additional className', () => {
        render(<InputGroup className="extra-class" data-testid="ig" />);
        expect(screen.getByTestId('ig')).toHaveClass('extra-class');
    });

    it('renders children', () => {
        render(
            <InputGroup>
                <span>Content</span>
            </InputGroup>
        );
        expect(screen.getByText('Content')).toBeInTheDocument();
    });
});

describe('InputGroupAddon', () => {
    it('renders with data-slot="input-group-addon"', () => {
        render(<InputGroupAddon data-testid="addon">$</InputGroupAddon>);
        expect(screen.getByTestId('addon')).toHaveAttribute('data-slot', 'input-group-addon');
    });

    it('renders children content', () => {
        render(<InputGroupAddon>$</InputGroupAddon>);
        expect(screen.getByText('$')).toBeInTheDocument();
    });

    it('renders with default align=inline-start', () => {
        render(<InputGroupAddon data-testid="addon">$</InputGroupAddon>);
        expect(screen.getByTestId('addon')).toHaveAttribute('data-align', 'inline-start');
    });

    it('renders with custom align prop', () => {
        render(<InputGroupAddon align="inline-end" data-testid="addon">$</InputGroupAddon>);
        expect(screen.getByTestId('addon')).toHaveAttribute('data-align', 'inline-end');
    });

    it('applies additional className', () => {
        render(<InputGroupAddon className="custom" data-testid="addon">$</InputGroupAddon>);
        expect(screen.getByTestId('addon')).toHaveClass('custom');
    });
});

describe('InputGroupText', () => {
    it('renders text content', () => {
        render(<InputGroupText>https://</InputGroupText>);
        expect(screen.getByText('https://')).toBeInTheDocument();
    });

    it('applies additional className', () => {
        render(<InputGroupText className="text-class" data-testid="txt">$</InputGroupText>);
        expect(screen.getByTestId('txt')).toHaveClass('text-class');
    });
});

describe('InputGroupInput', () => {
    it('renders an input element', () => {
        render(<InputGroupInput />);
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('has data-slot="input-group-control"', () => {
        render(<InputGroupInput />);
        const input = screen.getByRole('textbox');
        expect(input).toHaveAttribute('data-slot', 'input-group-control');
    });

    it('renders with placeholder', () => {
        render(<InputGroupInput placeholder="Enter URL" />);
        expect(screen.getByPlaceholderText('Enter URL')).toBeInTheDocument();
    });

    it('applies additional className', () => {
        render(<InputGroupInput className="my-input" />);
        const input = screen.getByRole('textbox');
        expect(input.className).toContain('my-input');
    });
});

describe('InputGroupTextarea', () => {
    it('renders a textarea element', () => {
        render(<InputGroupTextarea />);
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('has data-slot="input-group-control"', () => {
        render(<InputGroupTextarea />);
        const textarea = screen.getByRole('textbox');
        expect(textarea).toHaveAttribute('data-slot', 'input-group-control');
    });

    it('renders with placeholder', () => {
        render(<InputGroupTextarea placeholder="Enter notes" />);
        expect(screen.getByPlaceholderText('Enter notes')).toBeInTheDocument();
    });

    it('is a textarea element', () => {
        render(<InputGroupTextarea />);
        const textarea = screen.getByRole('textbox');
        expect(textarea.tagName.toLowerCase()).toBe('textarea');
    });
});

describe('InputGroup composition', () => {
    it('renders InputGroup with InputGroupAddon and InputGroupInput together', () => {
        render(
            <InputGroup>
                <InputGroupAddon>$</InputGroupAddon>
                <InputGroupInput placeholder="Amount" />
            </InputGroup>
        );
        expect(screen.getByText('$')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Amount')).toBeInTheDocument();
    });
});