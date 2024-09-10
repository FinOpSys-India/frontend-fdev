// SignUp.test.js
import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import SignUp from '../src/SignUp/SignUp';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

// Mock axios to prevent actual API calls during tests
jest.mock('axios');

describe('SignUp Component', () => {
  beforeEach(() => {
    axios.post.mockClear(); // Clear any previous mock data before each test
  });

  test('TC1: Verify successful registration with valid inputs', async () => {
    // Mock successful API response
    axios.post.mockResolvedValueOnce({
      data: { Status: 'Successful' },
    });

    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    // Fill out the form with valid data
    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByLabelText(/Work Email/i), {
      target: { value: 'john.doe@company.com' },
    });
    fireEvent.change(screen.getByLabelText(/Company Name/i), {
      target: { value: 'Tech Solutions' },
    });
    fireEvent.change(screen.getByLabelText(/Company Type/i), {
      target: { value: 'Consulting' },
    });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), {
      target: { value: '1234567890' },
    });
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: 'Password@123' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'Password@123' },
    });

    // Submit the form
    fireEvent.click(screen.getByText(/Sign in/i));

    // Wait for axios.post to be called
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:9000/signup',
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          workEmail: 'john.doe@company.com',
          companyName: 'Tech Solutions',
          companyType: 'Consulting',
          phoneNumber: '+11234567890',
          password: 'Password@123',
          confirmPassword: 'Password@123',
        })
      );
    });

    // Optionally, check for navigation or success message
    // Since navigate() is used, mock the navigation if required
  });

  test('TC2: Registration fails when mandatory fields are missing', async () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    // Leave mandatory fields empty and attempt to submit the form
    fireEvent.click(screen.getByText(/Sign in/i));

    // Check that axios.post was not called
    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });

    // Check for validation messages
    expect(screen.getAllByText(/required/i).length).toBeGreaterThan(0);
  });

  test('TC3: Registration fails with invalid email format', async () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    // Enter invalid email
    fireEvent.change(screen.getByLabelText(/Work Email/i), {
      target: { value: 'john.doe@gmail.com' }, // Personal email domain
    });

    // Fill other mandatory fields
    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), {
      target: { value: '1234567890' },
    });
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: 'Password@123' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'Password@123' },
    });

    // Attempt to submit the form
    fireEvent.click(screen.getByText(/Sign in/i));

    // Check that axios.post was not called
    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });

    // Check for error message
    expect(
      screen.getByText(/Please enter your work email, not a personal email/i)
    ).toBeInTheDocument();
  });

  test('TC4: Registration fails with weak password', async () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    // Enter weak password
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: 'weakpass' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'weakpass' },
    });

    // Fill other mandatory fields
    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByLabelText(/Work Email/i), {
      target: { value: 'john.doe@company.com' },
    });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), {
      target: { value: '1234567890' },
    });

    // Attempt to submit the form
    fireEvent.click(screen.getByText(/Sign in/i));

    // Check that axios.post was not called
    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });

    // Check for error message
    expect(
      screen.getByText(
        /Password must be 8-16 characters and contain at least one alphabet/i
      )
    ).toBeInTheDocument();
  });
});
