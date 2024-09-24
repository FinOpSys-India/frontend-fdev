import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
// import CodeVerification from './CodeVerification'; // Adjust the import path
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import CodeVerification from '../../CodeVerification/CodeVerification';

// Mock axios
jest.mock('axios');

// Mock react-router-dom's useLocation and useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useNavigate: () => jest.fn(),
}));

describe('CodeVerification Component', () => {
  let router;

  beforeEach(() => {
    // Mock the location state to simulate phone number passed from previous page
    jest.requireMock('react-router-dom').useLocation.mockReturnValue({
      state: '1234567890',
    });

    // Define the router for testing using `createMemoryRouter`
    const routesConfig = [
      {
        path: '/',
        element: <CodeVerification/>,
      },
    ];

    router = createMemoryRouter(routesConfig, {
        initialEntries: ['/'], // Simulate starting at the root
      });
  
      // Mock localStorage.setItem
      jest.spyOn(window.localStorage.__proto__, 'setItem');
    });
  
    afterEach(() => {
      jest.clearAllMocks(); // Clear all mocks after each test
    });

  

  test('renders correctly with phone number from location.state', () => {
    render(<RouterProvider router={router} />);

    // Check if the phone number from location.state is displayed
    expect(screen.getByText(/A code sent to 1234567890/i)).toBeInTheDocument();
  });


  test('handles OTP input correctly', () => {
    render(<RouterProvider router={router} />);

    const otpInputs = screen.getAllByRole('textbox');

    // Simulate entering OTP digits
    fireEvent.change(otpInputs[0], { target: { value: '1' } });
    fireEvent.change(otpInputs[1], { target: { value: '2' } });
    fireEvent.change(otpInputs[2], { target: { value: '3' } });
    fireEvent.change(otpInputs[3], { target: { value: '4' } });
    fireEvent.change(otpInputs[4], { target: { value: '5' } });
    fireEvent.change(otpInputs[5], { target: { value: '6' } });

    // Check if all OTP inputs have the correct values
    expect(otpInputs[0].value).toBe('1');
    expect(otpInputs[1].value).toBe('2');
    expect(otpInputs[2].value).toBe('3');
    expect(otpInputs[3].value).toBe('4');
    expect(otpInputs[4].value).toBe('5');
    expect(otpInputs[5].value).toBe('6');
  });



  test('submits form successfully with correct OTP', async () => {
    // Mock a successful login response
    axios.post.mockResolvedValueOnce({
      data: { Status: 'OTP verified successfully', phoneNumber: '1234567890' }
    });

    render(<RouterProvider router={router} />);

    // Simulate filling in OTP and submitting the form
    const otpInputs = screen.getAllByRole('textbox');
    fireEvent.change(otpInputs[0], { target: { value: '1' } });
    fireEvent.change(otpInputs[1], { target: { value: '2' } });
    fireEvent.change(otpInputs[2], { target: { value: '3' } });
    fireEvent.change(otpInputs[3], { target: { value: '4' } });
    fireEvent.change(otpInputs[4], { target: { value: '5' } });
    fireEvent.change(otpInputs[5], { target: { value: '6' } });

    // Submit the form
    fireEvent.click(screen.getByText(/Submit/i));

    // Wait for async response and check if the form submitted successfully
    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify('1234567890'));
    });
  });

  
  test('shows error message when OTP is incorrect', async () => {
    // Mock a failed login response
    axios.post.mockResolvedValueOnce({
      data: { Status: 'OTP not matched', phoneNumber: '1234567890' }
    });

    render(<RouterProvider router={router} />);

    // Simulate filling in OTP and submitting the form
    const otpInputs = screen.getAllByRole('textbox');
    fireEvent.change(otpInputs[0], { target: { value: '1' } });
    fireEvent.change(otpInputs[1], { target: { value: '2' } });
    fireEvent.change(otpInputs[2], { target: { value: '3' } });
    fireEvent.change(otpInputs[3], { target: { value: '4' } });
    fireEvent.change(otpInputs[4], { target: { value: '5' } });
    fireEvent.change(otpInputs[5], { target: { value: '6' } });

    // Submit the form
    fireEvent.click(screen.getByText(/Submit/i));

    // Wait for the error message
    await waitFor(() => {
      expect(screen.getByText(/Otp not matched/i)).toBeInTheDocument();
    });
  });

  test('resends OTP when "Send Again" is clicked', async () => {
    // Mock the resend OTP response
    axios.post.mockResolvedValueOnce({
      data: { message: 'OTP sent successfully!' }
    });

    render(<RouterProvider router={router} />);

    // Click the "Send Again" link
    fireEvent.click(screen.getByText(/Send Again/i));

    // Wait for the success message to appear
    await waitFor(() => {
      expect(screen.getByText(/Otp sent successfully/i)).toBeInTheDocument();
    });
  });
});
