import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DashboardScreen from '../DashboardScreen';
import axios from 'axios';

jest.mock('axios');

describe('DashboardScreen', () => {
    it('should display campaigns', async () => {
        axios.get.mockResolvedValue({
            data: [
                {
                    _id: '1',
                    title: 'Test Campaign',
                    description: 'Test Description',
                    goalAmount: 1000,
                    amountRaised: 100,
                },
            ],
        });

        const { getByText } = render(<DashboardScreen />);

        expect(await getByText('Test Campaign')).toBeTruthy();
        expect(getByText('Test Description')).toBeTruthy();
        expect(getByText('Goal: $1000')).toBeTruthy();
        expect(getByText('Raised: $100')).toBeTruthy();
    });

    it('should create a new campaign', async () => {
        axios.post.mockResolvedValue({
            data: {
                _id: '2',
                title: 'New Campaign',
                description: 'New Description',
                goalAmount: 2000,
                amountRaised: 0,
            },
        });

        const { getByPlaceholderText, getByText } = render(<DashboardScreen />);

        fireEvent.changeText(getByPlaceholderText('Title'), 'New Campaign');
        fireEvent.changeText(getByPlaceholderText('Description'), 'New Description');
        fireEvent.changeText(getByPlaceholderText('Goal Amount'), '2000');
        fireEvent.changeText(getByPlaceholderText('Tilt Point'), '1000');
        fireEvent.press(getByText('Create Campaign'));

        expect(await getByText('New Campaign')).toBeTruthy();
        expect(getByText('New Description')).toBeTruthy();
        expect(getByText('Goal: $2000')).toBeTruthy();
        expect(getByText('Raised: $0')).toBeTruthy();
    });
});
