import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RegisterScreen from '../RegisterScreen';

describe('RegisterScreen', () => {
    it('should display error messages for invalid inputs', async () => {
        const { getByPlaceholderText, getByText } = render(<RegisterScreen />);

        fireEvent.changeText(getByPlaceholderText('Name'), '');
        fireEvent.changeText(getByPlaceholderText('Email'), 'invalidemail');
        fireEvent.changeText(getByPlaceholderText('Password'), 'short');
        fireEvent.press(getByText('Register'));

        expect(getByText('Name is required')).toBeTruthy();
        expect(getByText('Invalid email address')).toBeTruthy();
        expect(getByText('Password must be at least 6 characters')).toBeTruthy();
    });

    it('should call the register function with valid inputs', async () => {
        const mockRegister = jest.fn();
        const { getByPlaceholderText, getByText } = render(<RegisterScreen register={mockRegister} />);

        fireEvent.changeText(getByPlaceholderText('Name'), 'John Doe');
        fireEvent.changeText(getByPlaceholderText('Email'), 'john@example.com');
        fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
        fireEvent.press(getByText('Register'));

        expect(mockRegister).toHaveBeenCalledWith({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
        });
    });
});
