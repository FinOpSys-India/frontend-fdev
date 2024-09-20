import { render, screen, fireEvent } from '@testing-library/react';
import PersonSetting from '../../../CompanyDetails/PersonSetting';
import AccessControl from '../../../CompanyDetails/AccessControl/AccessControl';
import Profile from '../../../CompanyDetails/Profile/Profile';
import TeamAndMember from '../../../CompanyDetails/TeamAndMember/TeamAndMember';
import CompaniesDetails from '../../../CompanyDetails/CompaniesDetails/CompaniesDetails';
import Integration from '../../../CompanyDetails/Integration/Integration';



// jest.mock('AccessControl');
// jest.mock('Profile');
// // jest.mock('../../../CompanyDetails/TeamAndMember/TeamAndMember', () => () => <div>TeamAndMember Component</div>);
// jest.mock('CompaniesDetails');
// jest.mock('../../../CompanyDetails/Integration/Integration', () => () => <div>Integration Component</div>);

describe('PersonSetting Component', () => {


  test('renders the component', async () => {
    render(<PersonSetting/>);
    expect(screen.getByText('Dashboard Settings')).toBeInTheDocument();
  });



  test('renders the correct component when buttons are clicked', async () => {
    render(<PersonSetting />);

    // Click the Profile button
    fireEvent.click(screen.getByText(/Profiles/i));
    expect(await screen.findByText('Profiles')).toBeInTheDocument();

    // Click the Companies button
    fireEvent.click(screen.getByText(/Company/i));
    expect(await screen.findByText('Company')).toBeInTheDocument();

    // // Click the Access Control button
    // fireEvent.click(screen.getByRole('button', { name: /Access Control/i }));
    // expect(await screen.findByText('Members')).toBeInTheDocument();
    
    
    // Click the Access Control button
     fireEvent.click(screen.getByRole('button', { name: /Team & Members/i }));
     expect(await screen.findByText('Team & Members')).toBeInTheDocument();



    // Click the Access Control button
    fireEvent.click(screen.getByRole('button', { name: /Notifications/i }));
    expect(await screen.findByText('Notifications')).toBeInTheDocument();

    // Click the Access Control button
    fireEvent.click(screen.getByRole('button', { name: /Security/i }));
    expect(await screen.findByText('Security')).toBeInTheDocument();

    // Click the Access Control button
    fireEvent.click(screen.getByRole('button', { name: /Integration/i }));
    expect(await screen.findByText('Connection')).toBeInTheDocument();

});



  test('highlights the active button', async () => {
    render(<PersonSetting />);

    // Click the Profile button
    const profileButton = screen.getByText(/Profiles/i);
    fireEvent.click(profileButton);
    expect(profileButton).toHaveClass('clickedButton');

    // Click the Companies button
    const companiesButton = screen.getByText(/Companies/i);
    fireEvent.click(companiesButton);
    expect(companiesButton).toHaveClass('clickedButton');
    expect(profileButton).not.toHaveClass('clickedButton');
  });




  test('matches the snapshot', async () => {
    const { asFragment } = render(<PersonSetting />);
    expect(asFragment()).toMatchSnapshot();
  });
});
