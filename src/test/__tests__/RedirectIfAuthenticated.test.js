import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import '@testing-library/jest-dom';
// import RedirectIfAuthenticated from '../../RedirectIfAuthenticated/RedirectIfAuthenticated'; // Adjust the import path
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import RedirectIfAuthenticated from '../../ProtectedRoute/RedirectIfAuthenticated';
import Login from '../../Login/Login';
import Home from '../../Home/Home';


// Mock axios
jest.mock('axios');


const routesConfig = [
    {
      path: '/',
      element: (
        <RedirectIfAuthenticated>
          <div>Account Payable</div> {/* Adjust based on your actual component */}
        </RedirectIfAuthenticated>
      ),
    },
    {
      path:  '/login',
      element: (
            <Login >
          <div> Welcome Back</div> {/* Content that should be visible when not authenticated */}
           </Login>
      ),
    },
  ];


describe('RedirectIfAuthenticated Component', () => {

  test('shows loading state initially', async () => {
    axios.get.mockResolvedValueOnce({ status: 200 });

    const router = createMemoryRouter(routesConfig, {
      initialEntries: ['/'],
    });

    render(<RouterProvider router={router} />);

    // Wait for the loading state to be displayed
    await waitFor(() => {
      expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    });
  });



  test('redirects to / if authenticated', async () => {
    // Mocking axios to simulate an authenticated user
    axios.get.mockResolvedValueOnce({ status: 200 });

    // Setup the router with initial entry
    const router = createMemoryRouter(routesConfig, {
      initialEntries: ['/login'],
    });

    render(<RouterProvider router={router} />);

    // Wait for the redirection to happen
    await waitFor(() => {
      // Check for the content on the redirected page
      expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
    });
  });


  test('renders children if not authenticated', async () => {
    axios.get.mockRejectedValueOnce(new Error('Not authenticated'));

    const router = createMemoryRouter(routesConfig, {
      initialEntries: ['/'],
    });

    render(<RouterProvider router={router} />);

    // Wait for the loading state to disappear and check for protected content
    await waitFor(() => {
      expect(screen.getByText(/Account Payable/i)).toBeInTheDocument();
    });
  });

});
