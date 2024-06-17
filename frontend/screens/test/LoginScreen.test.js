import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LoginScreen from '../LoginScreen';

describe('LoginScreen', () => {
    it('should display error messages for invalid inputs', async () => {
        const { getByPlaceholderText, getByText } = render(<LoginScreen />);

        fireEvent.changeText(getByPlaceholderText('Email'), 'invalidemail');
        fireEvent.changeText(getByPlaceholderText('Password'), '');
        fireEvent.press(getByText('Login'));

        expect(getByText('Invalid email address')).toBeTruthy();
        expect(getByText('Password is required')).toBeTruthy();
    });

    it('should call the login function with valid inputs', async () => {
        const mockLogin = jest.fn();
        const { getByPlaceholderText, getByText } = render(<LoginScreen login={mockLogin} />);

        fireEvent.changeText(getByPlaceholderText('Email'), 'john@example.com');
        fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
        fireEvent.press(getByText('Login'));

        expect(mockLogin).toHaveBeenCalledWith({
            email: 'john@example.com',
            password: 'password123',
        });
    });
});
