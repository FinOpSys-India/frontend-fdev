import { render, screen, waitFor, within } from '@testing-library/react';
// import Profile from '../Profile'; // Adjust the path to where your Profile component is located
import axios from 'axios';
import Profile from '../../CompanyDetails/Profile/Profile';
import Cookies from 'js-cookie';

// Mocking axios
jest.mock('axios');

describe('Profile Component', () => {
  
    afterEach(() => {
        jest.clearAllMocks(); // Clear any mock calls between tests
      });
      
      test('renders "Profile" heading', async () => {
        render(<Profile />);
        const profileHeading = await screen.findByText(/Profile/i);
        expect(profileHeading).toBeInTheDocument();
      });



//   test('renders "User Name" label', () => {
//     render(<Profile />);
//     const userName = screen.findByText(/User Name/i);
//     expect(userName).toBeInTheDocument();
//   });

// test('fetches and displays person details', async () => {
//   const personData = [
//     {
//       FIRSTNAME: 'abc',
//       LASTNAME: 'e',
//       PHONENUMBER: '123-456-7890',
//       WORKMAIL: 'a@example.com'
//     }
//   ];

//   const email = 'a@example.com';

//   // Mock Cookies.get to return the email
//   Cookies.get = jest.fn().mockReturnValue(email);

//   // Mock axios.get to return the personData
//   axios.get.mockResolvedValueOnce({ data: personData });

//   render(<Profile />);

//   await waitFor(() => {
//     expect(axios.get).toHaveBeenCalledWith('http://localhost:9000/get-person-details', { params: { workEmail: email } });
//   });

//   screen.debug();

//   // Using findByText to match the required fields
//   const firstName = await screen.findByText(/abc/i);
//   expect(firstName).toBeInTheDocument();

//   const lastName = await screen.findByText(/e/i);
//   expect(lastName).toBeInTheDocument();

//   const phoneNumber = await screen.findByText(/123-456-7890/i);
//   expect(phoneNumber).toBeInTheDocument();

//   const emailAddress = await screen.findByText(/a@example.com/i);
//   expect(emailAddress).toBeInTheDocument();
    
// });



  // test('displays a message when no person data is available', async () => {
  //   axios.get.mockResolvedValueOnce({ data: [] });

  //   render(<Profile />);

  //   const noDataMessage = await screen.findByText(/No person data available/i);
  //   expect(noDataMessage).toBeInTheDocument();
  // });

  test('renders avatar image with correct alt text', () => {
    render(<Profile />);
    const avatar = screen.getByAltText(/default avatar/i);
    expect(avatar).toBeInTheDocument();
  });


  test('renders "Change Avatar" text', () => {
    render(<Profile />);
    const changeAvatarText = screen.getByText(/Change Avatar/i);
    expect(changeAvatarText).toBeInTheDocument();
  });

  test('renders the correct profile information fields', async () => {
    const mockPersonData = [
      {
        FIRSTNAME: 'John',
        LASTNAME: 'Doe',
        PHONENUMBER: '123-456-7890',
        WORKMAIL: 'john.doe@example.com',
        DESIGNATION: 'Developer',
        ADDRESS: '123 Main St'
      }
    ];

    axios.get.mockResolvedValueOnce({ data: mockPersonData });

    render(<Profile />);

    // Wait for the component to finish fetching and rendering data
    await waitFor(() => {
      // Check if the fields are rendered
      expect(screen.getByText(/First Name/i)).toBeInTheDocument();
      expect(screen.getByText(/Middle Name/i)).toBeInTheDocument();
      expect(screen.getByText(/Last Name/i)).toBeInTheDocument();
      expect(screen.getByText(/Phone Number/i)).toBeInTheDocument();
      expect(screen.getByText(/Email Address/i)).toBeInTheDocument();
      expect(screen.getByText(/DESIGNATION/i)).toBeInTheDocument();
      // expect(screen.getByText(/Address/i)).toBeInTheDocument();
      // expect(screen.getByText(/Password /i)).toBeInTheDocument();
    });
  })

})