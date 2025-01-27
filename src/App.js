import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route , Routes} from 'react-router-dom';
import Login from './Login/Login';
import SignUp from './SignUp/SignUp';
import Home from './Home/Home.js';
import Reset from './Reset/Reset';
import UpdateSuccessfully from './UpdateSuccessfully/UpdateSuccessfully';
import CodeVerification from './CodeVerification/CodeVerification';
import Demo from './CompanyDetails/Demo/Demo.js';
import SignUpMember from './MemberComponent/SignUp/SignUpMember.js';
import LoginMember from './MemberComponent/Login/LoginMember.js';
import ResetMember from './MemberComponent/Reset/Reset.js';
import MemberUpdateSuccessfully from './MemberComponent/UpdateSuccessfully/UpdateSuccessfully.js';
import MemberHome from './MemberComponent/MemberHome/MemberHome.js';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute.js';
import RedirectIfAuthenticated from './ProtectedRoute/RedirectIfAuthenticated.js';
import MemberRedirectIfAuthenticated from './MemberComponent/MemberProtectedRoute/MemberRedirectIfAuthenticated.js';
import MemberProtectedRoute from './MemberComponent/MemberProtectedRoute/MemberProtectedRoute.js';
import MemberCodeVerification from './MemberComponent/CodeVerification/MemberCodeVerification.js';
import AQ from './AccountPayable/AQ/AQ.js';
import PendingBills from './AccountPayable/Bills/PendingBills/PendingBills.js';
import ApprovedBills from './AccountPayable/Bills/ApprovedBills/ApprovedBills.js';
import DeclineBills from './AccountPayable/Bills/DeclineBills/DeclineBills.js';
import AllBills from './AccountPayable/Bills/AllBills/AllBills.js';
import AllVendorForm from './AccountPayable/VendorForm/AllVendorForm/AllVendorForm.js';
import InsightMainChat from './AccountPayable/Insight/InsightMainChat/InsightMainChat.js';

const App = () => {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={ <RedirectIfAuthenticated> <SignUp/> </RedirectIfAuthenticated> } />
        <Route path="/login" element={ <RedirectIfAuthenticated> <Login /> </RedirectIfAuthenticated> } />
        <Route path="/reset" element={ <RedirectIfAuthenticated> <Reset/></RedirectIfAuthenticated> } />
        <Route path="/update" element={ <RedirectIfAuthenticated><UpdateSuccessfully/> </RedirectIfAuthenticated> } />
        <Route path="/codeVerification" element={ <RedirectIfAuthenticated><CodeVerification/> </RedirectIfAuthenticated> } />
        <Route path='/invoiceQueue' element={ <ProtectedRoute><AQ /></ProtectedRoute>} />
        <Route path='/billAQButton' element={ <ProtectedRoute><PendingBills /></ProtectedRoute>} />
        <Route path='/approved-Bills' element={ <ProtectedRoute><ApprovedBills /></ProtectedRoute>} />
        <Route path='/decline-Bills' element={ <ProtectedRoute><DeclineBills /></ProtectedRoute>} />
        <Route path='/all-Bills' element={ <ProtectedRoute><AllBills /></ProtectedRoute>} />
        <Route path='/vendor' element={ <ProtectedRoute><AllVendorForm /></ProtectedRoute>} />
        <Route path="/"  element={ <ProtectedRoute>  <Home /> </ProtectedRoute> }/>
        <Route path="/insight"  element={ <ProtectedRoute>  <InsightMainChat /> </ProtectedRoute> }/>
        {/* -----not needed---------- */}
        <Route path="/demo"  element={ <ProtectedRoute><Demo/> </ProtectedRoute> }/>
  

        {/* -------------Members details------------- */}
        {/* <Route path="/signup-member"  element={ <SignUpMember/>} />
        <Route path="/login-member"  element={ <LoginMember/> } />
        <Route path="/reset-member"  element={ <ResetMember/> } />
        <Route path="/update-member"  element={ <MemberUpdateSuccessfully/> } />
        <Route path="/codeVerification-member"  element={ <MemberCodeVerification/> } /> */}

        {/* -------------Members details------------- */}
       <Route path="/signup-member"  element={<MemberRedirectIfAuthenticated> <SignUpMember/></MemberRedirectIfAuthenticated>} />
       <Route path="/login-member"  element={<MemberRedirectIfAuthenticated> <LoginMember/> </MemberRedirectIfAuthenticated>} />
       <Route path="/reset-member"  element={<MemberRedirectIfAuthenticated> <ResetMember/> </MemberRedirectIfAuthenticated>} />
       <Route path="/update-member"  element={<MemberRedirectIfAuthenticated> <MemberUpdateSuccessfully/> </MemberRedirectIfAuthenticated>} />
       <Route path="/codeVerification-member"  element={<MemberRedirectIfAuthenticated> <MemberCodeVerification/> </MemberRedirectIfAuthenticated>} />
       <Route path="/home-member"  element={<MemberProtectedRoute> <MemberHome/> </MemberProtectedRoute>} />

        {/* <Route path="/home-member"  element={<MemberHome/> } /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;




{/* <Route path="/signup" element={<SignUp/>} /> */}
{/* <Route path="/reset"  element={<Reset/>} />
<Route path="/update"  element={<UpdateSuccessfully/>} />
<Route path="/codeVerification"  element={<CodeVerification/>} /> */}

 {/* -------------Members details------------- */}
//  <Route path="/signup-member"  element={<MemberRedirectIfAuthenticated> <SignUpMember/></MemberRedirectIfAuthenticated>} />
//  <Route path="/login-member"  element={<MemberRedirectIfAuthenticated> <LoginMember/> </MemberRedirectIfAuthenticated>} />
//  <Route path="/reset-member"  element={<MemberRedirectIfAuthenticated> <ResetMember/> </MemberRedirectIfAuthenticated>} />
//  <Route path="/update-member"  element={<MemberRedirectIfAuthenticated> <MemberUpdateSuccessfully/> </MemberRedirectIfAuthenticated>} />
//  <Route path="/codeVerification-member"  element={<MemberRedirectIfAuthenticated> <MemberCodeVerification/> </MemberRedirectIfAuthenticated>} />

//  <Route path="/home-member"  element={<MemberProtectedRoute> <MemberHome/> </MemberProtectedRoute>} />

// import React from 'react'

// class App extends React.Component {
//   constructor(props){
//     super(props);
    
//     window.intuit.ipp.anywhere.setup({
//       grantUrl: 'http://www.mycompany.com/HelloWorld/RequestTokenServlet',
//       datasources: {
//         quickbooks : true,
//         payments : true
//       },
//       paymentOptions:{
//         intuitReferred : true
//       }
//     })
//   }

//   callQuickBooks() {
//    return await require("@pipedreamhq/platform").axios(this, {
// 	  url: `https://quickbooks.api.intuit.com/v3/company/${auths.quickbooks.company_id}/companyinfo/${auths.quickbooks.company_id}`,
// 	  headers: {
// 	    Authorization: `Bearer ${auths.quickbooks.oauth_access_token}`,
// 	    "accept": `application/json`,
// 	    "content-type": `application/json`,
// 	  },
// 	})
//   }


//   render(){
//       return (
//           <div onClick={callQuickBooks}></div>
//       )
//   }
// }

// export default App