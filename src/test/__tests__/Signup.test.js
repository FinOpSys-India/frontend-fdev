import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUp from '../../SignUp/SignUp';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

// Mock axios for post request
jest.mock('axios');
jest.mock('bootstrap/dist/css/bootstrap.min.css');

describe('SignUp Component', () => {


test('renders the signup form with all fields', () => {
  render(
    <BrowserRouter>
      <SignUp />
    </BrowserRouter>
  );  
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Work Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Company Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Company Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter the Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
  });
  test('shows error if work email is personal', async () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByLabelText(/Work Email/i), {
      target: { value: 'test@gmail.com' }, // invalid work email
    });
    fireEvent.change(screen.getByLabelText(/Company Name/i), {
      target: { value: 'Company' },
    });
    fireEvent.change(screen.getByLabelText(/Company Type/i), {
      target: { value: 'IT' },
    });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), {
      target: { value: '1234567890' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter the Password/i), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'Password123!' },
    });  
    
  
    fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));
  
    await waitFor(() => {
      expect(screen.getByText(/Please enter your work email/i)).toBeInTheDocument();
    });
  });
  test('submits form successfully if all inputs are valid', async () => {
    axios.post.mockResolvedValueOnce({ data: { Status: 'Successful' } });
  
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );  
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
      target: { value: 'Company' },
    });
    fireEvent.change(screen.getByLabelText(/Company Type/i), {
      target: { value: 'IT' },
    });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), {
      target: { value: '1234567890' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter the Password/i), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'Password123!' },
    });
  
    fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));
  
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:9000/signup', expect.any(Object));
    });
  });
  test('shows error if Password not matched', async () => {
    axios.post.mockRejectedValueOnce(new Error('Signup failed'));
  
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );  
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
      target: { value: 'Company' },
    });
    fireEvent.change(screen.getByLabelText(/Company Type/i), {
      target: { value: 'IT' },
    });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), {
      target: { value: '1234567890' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter the Password/i), {
      target: { value: 'Password12!' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'Password123!' },
    });
  
    fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));
  
    await waitFor(() => {
      expect(screen.getByText(/Password not matched/i)).toBeInTheDocument();
    });
  });
          
  
});