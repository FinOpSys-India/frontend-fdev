import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import AccessControl from '../../../CompanyDetails/AccessControl/AccessControl';
// import AccessControl from './AccessControl';

// Mocking axios for the API call
jest.mock('axios');

describe('AccessControl Component', () => {

    beforeEach(() => {
        // Mock the axios.post function to avoid real API calls
        axios.post.mockResolvedValue({
          data: {
            message: 'Success',
            isCheckedNotification: {
              generalAccess: true,
              notification: false,
              page1: false,
            },
          },
        });
      });

    test('renders without crashing', async () => {
        render(<AccessControl />);
    
        // Using waitFor to handle any asynchronous behavior
        await waitFor(() => {
          expect(screen.getByText('Access Control')).toBeInTheDocument();
        });
    });


  test('dropdown button renders and toggles', () => {
    render(<AccessControl />);
    const dropdownButton = screen.getByText('Search Members');
    expect(dropdownButton).toBeInTheDocument();
    fireEvent.click(dropdownButton);
    expect(screen.getByRole('list')).toBeVisible(); // Check if dropdown is visible
  });


  

  test('toggles the general access switch', () => {
    render(<AccessControl />);
    
    const generalAccessSwitch = screen.getByTestId('general-access-switch'); // Use the test ID
  
    // Default state should be unchecked
  
    // Click the switch to toggle it
    fireEvent.click(generalAccessSwitch);
    expect(generalAccessSwitch).toBeChecked(); // Now it should be checked
  });
  
  

  test('toggles the notification access switch', () => {
    render(<AccessControl />);
    
    const notificationSwitch = screen.getByTestId('notification-switch'); // Use the test ID
  
    // Default state should be unchecked
  
    // Click the switch to toggle it
    fireEvent.click(notificationSwitch);
    expect(notificationSwitch).toBeChecked(); // Now it should be checked
  });
  

  test('axios call is made when toggling notification switch', async () => {
    render(<AccessControl />);
    const notificationSwitch = screen.getByTestId('notification-switch', { name: /notification/i });

    // Mock the axios post request
    axios.post.mockResolvedValue({ data: { message: 'Success' } });

    // Click to toggle the notification switch
    fireEvent.click(notificationSwitch);

    // Check if the axios call was made with correct payload
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:9000/update-notification',
      expect.objectContaining({
        notification: true // Assuming it was toggled on
      }),
      { withCredentials: true }
    );
  });




  test('Reset button calls the correct handler', () => {
    // Note: This test requires you to implement the Reset button functionality if not already done
    render(<AccessControl />);
    const resetButton = screen.getByText(/Reset1/i);
    fireEvent.click(resetButton);
    // Add your assertions here based on the Reset button's behavior
  });

  test('useEffect makes API call on notification change', async () => {
    // Mock axios post
    axios.post.mockResolvedValue({ data: { message: 'Success', isCheckedNotification: {} } });

    render(<AccessControl />);
    
    // Trigger state change
    fireEvent.click(screen.getByTestId('notification-switch'));
    
    // Await and verify the API call
    await waitFor(() => expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:9000/update-notification',
      expect.any(Object),
      { withCredentials: true }
    ));
  });
});
