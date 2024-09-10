import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import Login  from './Login/Login';
import SignUp from './SignUp/SignUp';
import Home from './Home/Home';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';
import RedirectIfAuthenticated from './ProtectedRoute/RedirectIfAuthenticated';

jest.mock('./Login/Login', () => () => <div>Login Page</div>);
jest.mock('./SignUp/SignUp', () => () => <div>Sign Up Page</div>);
jest.mock('./Home/Home', () => () => <div>Home Page</div>);
jest.mock('./ProtectedRoute/ProtectedRoute', () => ({ children }) => <div>{children}</div>);
jest.mock('./ProtectedRoute/RedirectIfAuthenticated', () => ({ children }) => <div>{children}</div>);

describe('App Routing', () => {
  test('renders login page on /login route', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  test('renders sign up page on /signup route', () => {
    render(
      <MemoryRouter initialEntries={['/signup']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Sign Up Page')).toBeInTheDocument();
  });

  test('renders home page on / route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  test('renders protected route with home page on /home route', () => {
    render(
      <MemoryRouter initialEntries={['/home']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });
});
