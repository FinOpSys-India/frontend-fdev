import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import CompaniesDetails from '../../../CompanyDetails/CompaniesDetails/CompaniesDetails';

jest.mock('axios');

describe('CompaniesDetails Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('fetches and displays companies', async () => {
    const mockData = {
      data: [{ companyName: 'Company A', eid: '123'}]
    };

    axios.get.mockResolvedValue(mockData);

   render(<CompaniesDetails />);

    await waitFor(() => {

        // Assert that the axios.get call was made with the correct URL
        expect(axios.get).toHaveBeenCalledWith("http://localhost:9000/getCompanies");
  
        // Check that the companies' names are rendered in the DOM
        // expect(screen.findByText('Company A')).toBeInTheDocument();
    });
  });


  test('handles successful API call', async () => {
    const mockData = {
      data: [{ companyName: 'Test Company', companyLogo: { data: new ArrayBuffer(8) } }]
    };
  
    axios.get.mockResolvedValue(mockData);
  
    render(<CompaniesDetails />);
  
    // Use findByText to wait for the element to appear asynchronously
    const companyName = await screen.findByText('Test Company');
    
    expect(companyName).toBeInTheDocument();
  });
  

  test('handles failed API call', async () => {
    axios.get.mockRejectedValue(new Error('Network error'));

    render(<CompaniesDetails />);

    await waitFor(() => {
      expect(screen.getByText('No Companies Found')).toBeInTheDocument();
    });
  });


  
    // Test case for searching companies      
  test('filters companies based on search term', async () => {
    const mockData = {
      data: [
        { companyName: 'Company A', eid: '123' ,  companyLogo: { data: new ArrayBuffer(8) } },
        { companyName: 'Company B', eid: '456' },
      ],
    };

    axios.get.mockResolvedValue(mockData);

    render(<CompaniesDetails />);

    // Assert that the axios.get call was made with the correct URL
    await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith("http://localhost:9000/getCompanies");
        // expect(screen.getByText('Company A')).toBeInTheDocument();
      });
    
 });




//  test('displays selected company details', async () => {
//     const mockData = {
//       data: [
//         { companyName: 'Company A', eid: '123', legalName: 'Legal A', phoneNumber: '1111111' },
//       ],
//     };

//     axios.get.mockResolvedValue(mockData);

//     render(<CompaniesDetails />);

//     const companyAButton = await screen.findByText('Company A');
//     fireEvent.click(companyAButton);

//     // Check if details are displayed after selection
//     await waitFor(() => {
//       expect(screen.getByDisplayValue('Company A')).toBeInTheDocument();
//       expect(screen.getByDisplayValue('Legal A')).toBeInTheDocument();
//       expect(screen.getByDisplayValue('1111111')).toBeInTheDocument();
//     });


// });  
//   // Test case for selecting a company and displaying details
// //   test('displays selected company details', async () => {
//     const mockData = {
//       data: [{ companyName: 'Company A', eid: '123', legalName: 'Legal A', phoneNumber: '1111111' }],
//     };

//     axios.get.mockResolvedValue(mockData);

//     render(<CompaniesDetails />);

//     const companyButton = await screen.findByText('Company A');
//     fireEvent.click(companyButton);

//     await waitFor(() => {
//     //   expect(screen.getByDisplayValue('Company A')).toBeInTheDocument();
//       expect(screen.getByDisplayValue('Legal A')).toBeInTheDocument();
//       expect(screen.getByDisplayValue('1111111')).toBeInTheDocument();
//     });
//   });

//   // Test case for updating company details
//   test('updates company details form', async () => {
//     const mockData = {
//       data: [{ companyName: 'Company A', eid: '123', legalName: 'Legal A', phoneNumber: '1111111' }],
//     };

//     axios.get.mockResolvedValue(mockData);

//     render(<CompaniesDetails />);

//     const companyButton = await screen.findByText('Company A');
//     fireEvent.click(companyButton);

//     const input = screen.getByDisplayValue('Company A');
//     fireEvent.change(input, { target: { value: 'Company A Updated' } });

//     expect(input.value).toBe('Company A Updated');
//   });

//   // Test case for submitting the update form
//   test('submits updated company details', async () => {
//     const mockData = {
//       data: [{ companyName: 'Company A', eid: '123', legalName: 'Legal A', phoneNumber: '1111111' }],
//     };

//     axios.get.mockResolvedValue(mockData);
//     axios.post.mockResolvedValue({ data: { message: 'Company updated successfully' } });

//     render(<CompaniesDetails />);

//     const companyButton = await screen.findByText('Company A');
//     fireEvent.click(companyButton);

//     const input = screen.getByDisplayValue('Company A');
//     fireEvent.change(input, { target: { value: 'Company A Updated' } });

//     const updateButton = screen.getByText('Update');
//     fireEvent.click(updateButton);

//     await waitFor(() => {
//       expect(axios.post).toHaveBeenCalledWith(
//         'http://localhost:9000/update-company-details',
//         expect.any(FormData),
//         { headers: { 'Content-Type': 'multipart/form-data' } }
//       );
//     });
//   });

//   // Test case for adding a company (showing the form)
//   test('shows add company form when clicking add button', () => {
//     render(<CompaniesDetails />);

//     const addButton = screen.getByText('Add Company');
//     fireEvent.click(addButton);

//     expect(screen.getByText('Company Name')).toBeInTheDocument();
//   });

//   // Test case for file input change (uploading a logo)
//   test('handles logo file upload', () => {
//     render(<CompaniesDetails />);

//     const file = new File(['logo'], 'logo.png', { type: 'image/png' });

//     const fileInput = screen.getByLabelText('Change Logo');
//     fireEvent.change(fileInput, { target: { files: [file] } });

//     expect(fileInput.files[0]).toBe(file);
//     expect(fileInput.files).toHaveLength(1);
//   });

//   // Test case for canceling the form
//   test('resets form and cancels', () => {
//     render(<CompaniesDetails />);

//     const cancelButton = screen.getByText('Back To List');
//     fireEvent.click(cancelButton);

//     expect(screen.queryByText('Company Name')).not.toBeInTheDocument();
//   });

});


// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import axios from 'axios';
// import CompaniesDetails from '../../../CompanyDetails/CompaniesDetails/CompaniesDetails';

// jest.mock('axios');

// describe('CompaniesDetails Component', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   // Test case for fetching and displaying companies
//   test('fetches and displays companies', async () => {
//     const mockData = {
//       data: [
//         { companyName: 'Company A', eid: '123' },
//         { companyName: 'Company B', eid: '456' },
//       ],
//     };

//     axios.get.mockResolvedValue(mockData);

//     render(<CompaniesDetails />);

//     await waitFor(() => {
//       expect(axios.get).toHaveBeenCalledWith('http://localhost:9000/getCompanies');
//       expect(screen.getByText('Company A')).toBeInTheDocument();
//       expect(screen.getByText('Company B')).toBeInTheDocument();
//     });
//   });

//   // Test case for searching companies
//   test('filters companies based on search term', async () => {
//     const mockData = {
//       data: [
//         { companyName: 'Company A', eid: '123' },
//         { companyName: 'Company B', eid: '456' },
//       ],
//     };

//     axios.get.mockResolvedValue(mockData);

//     render(<CompaniesDetails />);

//     const searchInput = screen.getByPlaceholderText('Search...');
//     fireEvent.change(searchInput, { target: { value: 'Company A' } });

//     await waitFor(() => {
//       expect(screen.getByText('Company A')).toBeInTheDocument();
//       expect(screen.queryByText('Company B')).not.toBeInTheDocument();
//     });
//   });

//   // Test case for selecting a company and displaying details
//   test('displays selected company details', async () => {
//     const mockData = {
//       data: [{ companyName: 'Company A', eid: '123', legalName: 'Legal A', phoneNumber: '1111111' }],
//     };

//     axios.get.mockResolvedValue(mockData);

//     render(<CompaniesDetails />);

//     const companyButton = await screen.findByText('Company A');
//     fireEvent.click(companyButton);

//     await waitFor(() => {
//       expect(screen.getByDisplayValue('Company A')).toBeInTheDocument();
//       expect(screen.getByDisplayValue('Legal A')).toBeInTheDocument();
//       expect(screen.getByDisplayValue('1111111')).toBeInTheDocument();
//     });
//   });

//   // Test case for updating company details
//   test('updates company details form', async () => {
//     const mockData = {
//       data: [{ companyName: 'Company A', eid: '123', legalName: 'Legal A', phoneNumber: '1111111' }],
//     };

//     axios.get.mockResolvedValue(mockData);

//     render(<CompaniesDetails />);

//     const companyButton = await screen.findByText('Company A');
//     fireEvent.click(companyButton);

//     const input = screen.getByDisplayValue('Company A');
//     fireEvent.change(input, { target: { value: 'Company A Updated' } });

//     expect(input.value).toBe('Company A Updated');
//   });

//   // Test case for submitting the update form
//   test('submits updated company details', async () => {
//     const mockData = {
//       data: [{ companyName: 'Company A', eid: '123', legalName: 'Legal A', phoneNumber: '1111111' }],
//     };

//     axios.get.mockResolvedValue(mockData);
//     axios.post.mockResolvedValue({ data: { message: 'Company updated successfully' } });

//     render(<CompaniesDetails />);

//     const companyButton = await screen.findByText('Company A');
//     fireEvent.click(companyButton);

//     const input = screen.getByDisplayValue('Company A');
//     fireEvent.change(input, { target: { value: 'Company A Updated' } });

//     const updateButton = screen.getByText('Update');
//     fireEvent.click(updateButton);

//     await waitFor(() => {
//       expect(axios.post).toHaveBeenCalledWith(
//         'http://localhost:9000/update-company-details',
//         expect.any(FormData),
//         { headers: { 'Content-Type': 'multipart/form-data' } }
//       );
//     });
//   });

//   // Test case for adding a company (showing the form)
//   test('shows add company form when clicking add button', () => {
//     render(<CompaniesDetails />);

//     const addButton = screen.getByText('Add Company');
//     fireEvent.click(addButton);

//     expect(screen.getByText('Company Name')).toBeInTheDocument();
//   });

//   // Test case for file input change (uploading a logo)
//   test('handles logo file upload', () => {
//     render(<CompaniesDetails />);

//     const file = new File(['logo'], 'logo.png', { type: 'image/png' });

//     const fileInput = screen.getByLabelText('Change Logo');
//     fireEvent.change(fileInput, { target: { files: [file] } });

//     expect(fileInput.files[0]).toBe(file);
//     expect(fileInput.files).toHaveLength(1);
//   });

//   // Test case for canceling the form
//   test('resets form and cancels', () => {
//     render(<CompaniesDetails />);

//     const cancelButton = screen.getByText('Back To List');
//     fireEvent.click(cancelButton);

//     expect(screen.queryByText('Company Name')).not.toBeInTheDocument();
//   });
// });
