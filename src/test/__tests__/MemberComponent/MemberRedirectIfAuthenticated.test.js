import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import MemberRedirectIfAuthenticated from '../../../MemberComponent/MemberProtectedRoute/MemberRedirectIfAuthenticated';
import LoginMember from '../../../MemberComponent/Login/LoginMember';
import MemberHome from "../../../MemberComponent/MemberHome/MemberHome";


// Mock axios
jest.mock('axios');


const routesConfig = [
    {
      path: '/home-member',
      element: (
        <MemberRedirectIfAuthenticated>
          <div>Account Payable</div> {/* Adjust based on your actual component */}
        </MemberRedirectIfAuthenticated>
      ),
    },
    {
      path:  '/login-member',
      element: (
            <LoginMember >
          <div> Welcome Back</div> {/* Content that should be visible when not authenticated */}
           </LoginMember>
      ),
    },
  ];


describe('RedirectIfAuthenticated Component', () => {

  test('shows loading state initially', async () => {
    axios.get.mockResolvedValueOnce({ status: 200 });

    const router = createMemoryRouter(routesConfig, {
      initialEntries: ['/home-member'],
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
      initialEntries: ['/login-member'],
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
      initialEntries: ['/home-member'],
    });

    render(<RouterProvider router={router} />);

    // Wait for the loading state to disappear and check for protected content
    await waitFor(() => {
      expect(screen.getByText(/Account Payable/i)).toBeInTheDocument();
    });
  });

});
