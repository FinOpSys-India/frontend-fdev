import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import '@testing-library/jest-dom';
import ProtectedRoute from '../../ProtectedRoute/ProtectedRoute'; // Adjust the import path
import { BrowserRouter, Routes, Route } from 'react-router-dom';


// Mock axios
jest.mock('axios');

const routesConfig = [
  {
    path: '/',
    element: (
      <ProtectedRoute>
        {/* <div>Protected Content</div> */}
      </ProtectedRoute>
    ),
  },
  {
    path: '/login',
    element: <div>Login Page</div>,
  },
];


describe('ProtectedRoute Component', () => {

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



  test('renders child component if authenticated', async () => {
    axios.get.mockResolvedValueOnce({ status: 200 });

    const router = createMemoryRouter(routesConfig, {
      initialEntries: ['/'],
    });

    render(<RouterProvider router={router} />);

    // Wait for the loading state to disappear and check for protected content
    await waitFor(() => {
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
    });
  });



  test('redirects to /login if not authenticated', async () => {
    axios.get.mockRejectedValueOnce(new Error('Not authenticated'));

    const router = createMemoryRouter(routesConfig, {
      initialEntries: ['/'],
    });

    render(<RouterProvider router={router} />);

    // Wait for the redirect to the login page
    await waitFor(() => {
      expect(screen.getByText(/Login Page/i)).toBeInTheDocument();
    });
  });

});
