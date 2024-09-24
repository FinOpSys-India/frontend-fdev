import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import Login from '../../Login/Login';


// Mock axios for post request
jest.mock('axios');
jest.mock('bootstrap/dist/css/bootstrap.min.css');
jest.mock('js-cookie');



describe('Login Component', () => {

    beforeEach(() => {
        Cookies.get.mockClear();
        Cookies.set.mockClear();
        Cookies.remove.mockClear();
      }); 



    test('renders login page with empty fields', () => {
        render(
            <BrowserRouter>
            <Login />
            </BrowserRouter>
        );
        expect(screen.getByPlaceholderText('Enter your email')).toHaveValue('');
        expect(screen.getByPlaceholderText('Enter your password')).toHaveValue('');
    });


    // test('shows validation error on empty submission', () => {
    //     render(
    //         <BrowserRouter>
    //         <Login />
    //         </BrowserRouter>
    //     );
    //     fireEvent.click(screen.getByRole('button', { name: /Log In/i }));

    //     expect(screen.getByPlaceholderText('Enter your email')).toBeInvalid();
    //     expect(screen.getByPlaceholderText('Enter your password')).toBeInvalid();
    // });

    test('renders the signup form with all fields', () => {
    render(
        <BrowserRouter>
        <Login />
        </BrowserRouter>
    );  
        expect(screen.getByLabelText(/Work Email/i)).toBeInTheDocument();
        // expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter your Password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Log In/i })).toBeInTheDocument();
    });



    test('shows error if work email does not exist', async () => {
    // Mock the axios post request to return an error response
        axios.post.mockResolvedValue({
            data: { Error: 'No email exists' }  // Error should be in res.data.Error as per your code
        });

    render(
        <BrowserRouter>
        <Login />
        </BrowserRouter>
    );

    // Simulate entering an invalid email and password
    fireEvent.change(screen.getByLabelText(/Work Email/i), {
        target: { value: 'test@gmail.com' }, // invalid work email
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), {
        target: { value: 'Password123!' },
    });

    // Simulate clicking the login button
    fireEvent.click(screen.getByRole('button', { name: /Log In/i }));

        await waitFor(() => {
        expect(screen.getByText(/No email exists/i)).toBeInTheDocument();
        });
    });


    


    test('shows error if Password does not match', async () => {
    
        axios.post.mockResolvedValue({
            data: { Error: 'Password not matched' },
        });

        render(
        <BrowserRouter>
            <Login />
        </BrowserRouter>
        );
    
        // Simulate entering a valid email and an incorrect password
        fireEvent.change(screen.getByLabelText(/Work Email/i), {
        target: { value: 'john.doe@company.com' },
        });
        fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), {
        target: { value: 'Passwordjvgfg!' },
        });
    
        // Simulate clicking the login button
        fireEvent.click(screen.getByRole('button', { name: /Log In/i }));
    
        // Wait for the error message to be displayed
        await waitFor(() => {
            expect(screen.getByText('Password not matched')).toBeInTheDocument()
        });
        
        
    });

    
    // knjnjnnjbj

    test('logs in with valid credentials and remembers user', async () => {
            axios.post.mockResolvedValue({
            data: { message: 'OTP sent successfully!', phoneNumber: '+911234567890' },
        });
        render(
        <BrowserRouter>
            <Login />
        </BrowserRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
        target: { value: 'user@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
        target: { value: 'password@123' },
        });
        fireEvent.click(screen.getByLabelText('Remember me'));
        fireEvent.click(screen.getByText('Log In'));

        await waitFor(() =>
        expect(Cookies.set).toHaveBeenCalledWith('workEmail', 'user@example.com', { expires: 7 })
        );
        await waitFor(() =>
        expect(Cookies.set).toHaveBeenCalledWith('password', 'password@123', { expires: 7 })
        );
    });

    test('logs in with valid credentials without remember me', async () => {
        axios.post.mockResolvedValue({
        data: { message: 'OTP sent successfully!', phoneNumber: '+911234567890' },
        });
        render(
        <BrowserRouter>
            <Login />
        </BrowserRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
        target: { value: 'user@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
        target: { value: 'password123' },
        });
        fireEvent.click(screen.getByText('Log In'));

        await waitFor(() => expect(Cookies.set).not.toHaveBeenCalled());
    });




    test('handles server error', async () => {
        axios.post.mockRejectedValue(new Error('Network Error'));
        render(
        <BrowserRouter>
            <Login />
        </BrowserRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
        target: { value: 'user@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
        target: { value: 'password123' },
        });
        fireEvent.click(screen.getByText('Log In'));

        await waitFor(() =>
        expect(screen.getByText('Network Error')).toBeInTheDocument()
        );
    });




      test('submits form successfully if all inputs are valid', async () => {
        axios.post.mockResolvedValueOnce({ data: { Status: 'Successful' } });
    
        render(
          <BrowserRouter>
            <Login />
          </BrowserRouter>
        );  
        fireEvent.change(screen.getByLabelText(/Work Email/i), {
          target: { value: 'john.doe@company.com' },
        });
        fireEvent.change(screen.getByPlaceholderText(/Enter your Password/i), {
          target: { value: 'Password123!' },
        });
    
        fireEvent.click(screen.getByRole('button', { name: /Log In/i }));
    
        await waitFor(() => {
          expect(axios.post).toHaveBeenCalledWith('http://localhost:9000/codeVerfication', expect.any(Object), { withCredentials: true });
        });
      });



});