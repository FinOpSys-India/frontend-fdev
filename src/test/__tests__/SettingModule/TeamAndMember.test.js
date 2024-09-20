import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import TeamAndMember from '../../../CompanyDetails/TeamAndMember/TeamAndMember';

// Mocking axios
jest.mock('axios');

describe('TeamAndMember Component', () => {
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders "Team" heading', async () => {
    render(<TeamAndMember />);
    
    await waitFor(() => {
      const heading = screen.getByText(/Send Invite/i);
      expect(heading).toBeInTheDocument();
    });
  });


  test('renders search bar', () => {
    render(<TeamAndMember />);
    const searchInput = screen.getByPlaceholderText(/Search/i);
    expect(searchInput).toBeInTheDocument();
  });
  

  test('fetches and displays company members', async () => {
    const mockMembers = [
      { eid: '1', firstName: 'abc', workEmail: 'a@example.com', memberPosition: 'developer' },
    ];
  
    // Mocking axios GET request and returning mock members
    axios.get.mockResolvedValueOnce({ data: mockMembers });
  
    // Render the TeamAndMember component
    render(<TeamAndMember />);
  
    // Wait for the axios call to finish and for the data to be rendered
    await waitFor(() => {
      // Ensure the API call was made to the expected endpoint
      expect(axios.get).toHaveBeenCalledWith('http://localhost:9000/get-company-member');
    });
  
    // Use waitFor to ensure elements appear after the fetch completes
    await waitFor(() => {
      // Verify that the member names and emails are displayed on the screen
      expect(screen.getByText(/abc/i)).toBeInTheDocument();
      expect(screen.getByText(/a@example.com/i)).toBeInTheDocument();
    });
  });
  



  test('displays "No Data Found" when no company members are returned', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<TeamAndMember />);

    await waitFor(() => {
      expect(screen.getByText(/No Data Found/i)).toBeInTheDocument();
    });
  });

  test('filters company members based on search input', async () => {
    const mockMembers = [
      { eid: '1', firstName: 'abc', workEmail: 'ab@example.com', memberPosition: 'developer' },
      { eid: '2', firstName: 'a', workEmail: 'c@example.com', memberPosition: 'developer' }
    ];

    axios.get.mockResolvedValueOnce({ data: mockMembers });

    render(<TeamAndMember />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:9000/get-company-member');
    });

    // Search for 'John'
    fireEvent.change(screen.getByPlaceholderText(/Search/i), { target: { value: 'abc' } });

    // Wait for the filtered results
    await waitFor(() => {
      expect(screen.getByText(/abc/i)).toBeInTheDocument();
    });


});




//   test('renders the avatar image with correct alt text', () => {
//     render(<TeamAndMember />);
//     const avatar = screen.getByAltText(/default-avatar/i); // Adjust if necessary
//     expect(avatar).toBeInTheDocument();
//   });




  test('renders and interacts with role select and toggle switch', async () => {
    const mockMembers = [
      { eid: '1', firstName: 'abc', workEmail: 'ab@example.com', memberPosition: 'developer' }
    ];

    axios.get.mockResolvedValueOnce({ data: mockMembers });

    render(<TeamAndMember />);

    await waitFor(() => {
      expect(screen.getByText(/abc/i)).toBeInTheDocument();
    });

    // Check the select role element
    const roleSelect = screen.getByRole('combobox');
    expect(roleSelect).toHaveValue('developer'); // Initial value

    fireEvent.change(roleSelect, { target: { value: 'cfo' } });
    expect(roleSelect).toHaveValue('cfo');

    // Check the toggle switch
    const toggleSwitch = screen.getByRole('checkbox');
    expect(toggleSwitch).not.toBeChecked();

    fireEvent.click(toggleSwitch);
    expect(toggleSwitch).toBeChecked();
  });
});
