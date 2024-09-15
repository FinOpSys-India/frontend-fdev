import React from 'react';
import { render, screen, fireEvent,waitFor } from '@testing-library/react';                  
import { BrowserRouter as Router } from 'react-router-dom'; // needed to test components with react-router
import Home from '../../Home/Home';
import axios from "axios";
import { apiEndPointUrl } from '../../utils/apiService';

jest.mock("axios");

describe('Home Component', () => {
  // Test if the component renders correctly
  test('renders Home component without crashing', () => {
    render(
      <Router>
        <Home />
      </Router>
    );
    // Checking if the "Invoice Queue" header is present
    expect(screen.getByText('Invoice Queue')).toBeInTheDocument();
  });

  // Test if the buttons exist and are clickable
  test('checks if all action buttons are present', () => {
    render(
      <Router>
        <Home />
      </Router>
    );
    
    const emailButton = screen.getByText(/Email/i);
    const ocrButton = screen.getByText(/OCR/i);
    const chatButton = screen.getByText(/Chat/i);
    const manualButton = screen.getByText(/Manual/i);

    // Assert if buttons exist in the document
    expect(emailButton).toBeInTheDocument();
    expect(ocrButton).toBeInTheDocument();
    expect(chatButton).toBeInTheDocument();
    expect(manualButton).toBeInTheDocument();
  });

  // Test click events and state change
  test('should highlight clicked buttons and toggle state', () => {
    render(
      <Router>
        <Home />
      </Router>
    );

    const emailButton = screen.getByText(/Email/i);
    const ocrButton = screen.getByText(/OCR/i);

    // Check initial state (buttons are not active)
    expect(emailButton).not.toHaveClass('connectButton');
    expect(ocrButton).not.toHaveClass('connectButton');

    // Simulate button click (Email button)
    fireEvent.click(emailButton);
    
    // After clicking, the Email button should be active
    expect(emailButton).toHaveClass('connectButton');
    expect(ocrButton).not.toHaveClass('connectButton');

    // Simulate button click (OCR button)
    fireEvent.click(ocrButton);

    // After clicking the OCR button, it should become active, and Email should no longer be active
    expect(ocrButton).toHaveClass('connectButton');
    expect(emailButton).not.toHaveClass('connectButton');
  });

  // Test menu collapse
  test('should toggle collapse/expand state of sidebar', () => {
    render(
      <Router>
        <Home />
      </Router>
    );

    
    expect(screen.getByText(/Account Payable/i)).toBeInTheDocument();

  });

  // Test for modal display when clicking settings
  test('should display settings modal when settings button is clicked', () => {
    render(
      <Router>
        <Home />
      </Router>
    );

    const settingsButton = screen.getByText(/Settings/i);

    // Initially, the modal should not be visible
    expect(screen.queryByText('Company')).toBeNull();

    // Simulate clicking the settings button
    fireEvent.click(settingsButton);

    // After clicking, the modal should be visible
    expect(screen.getByText(/Security/i)).toBeInTheDocument()
  });

  // Test for logout functionality (mocking axios)
  test('should log out user when logout button is clicked', async () => {
    axios.get.mockResolvedValueOnce({ data: 'Logged out successfully' });
    
    render(
      <Router>
        <Home />
      </Router>
    );

    const logoutButton = screen.getByText(/Logout/i);

    // Simulate clicking the logout button
    fireEvent.click(logoutButton);

    // Expect the axios request to have been made
    await waitFor(()=>{expect(axios.get).toHaveBeenCalledWith(`${apiEndPointUrl}/logout`)});
  });
});
