import React, { useState, useEffect } from "react";
import axios from "axios";
import './CompaniesDetails.css';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { apiEndPointUrl } from "../../utils/apiService";

const CompaniesDetails = () => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [updatedLogo, SetUpdatedLogo] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [showAddCompanyForm, setShowAddCompanyForm] = useState(false);
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState("");
  const [formData, setFormData] = useState({
    companyName: "",
    legalName: "",
    eid: "",
    phoneNumber: "",
    email: "",
    industryType: "",
    taxForm: "",
  });


  function arrayBufferToBase64(buffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }


// -----------------------get company details----------------------

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(`${apiEndPointUrl}/getCompanies`);
        setCompanies(response.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);



function companySearchBar(e){

  const searchValue = e.target.value;
  setSearchTerm(searchValue);
  console.log(searchValue);

  let filtered = [];
  if (searchValue) {
    filtered = companies.filter(company => 
      company.companyName.toLowerCase().includes(searchValue.toLowerCase())
    );
  }

  setFilteredCompanies(filtered);
  console.log(filtered);
  
}





  
  // ---------------------- getting the data matched with the EID -------------------------------
  async function handleCompanyClick(eid) {
    try {
      const url = `${apiEndPointUrl}/getCompanies?eid=${eid}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const company = data.find((company) => company.eid === eid);

      if (company) {
        setSelectedCompany(company);
      } else {
        console.log(`Company with EID ${eid} not found.`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }



  const handleBackToList = () => {
    setSelectedCompany(null);
  };



  const handleAddCompanyClick = () => {
    setShowAddCompanyForm(true);
    setSelectedCompany(null);
  };



  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("companyLogo", logo);
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
        const response = await axios.post(
          `${apiEndPointUrl}/insertData`,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("Successfully submitted");
        // fetchCompanies();
      } 
      catch (error) {
        console.error("There was an error submitting the form!", error);
      }

      setShowAddCompanyForm(false);
      setLogo(null);
      setPreview("");
      setFormData({  companyName: "", legalName: "",  eid: "", phoneNumber: "",  email: "",  industryType: "",  taxForm: "", });
  };


  const handleCancelClick = () => {

      setLogo(null);
      setPreview("");
      setFormData({  companyName: "", legalName: "", eid: "",  phoneNumber: "", email: "",   industryType: "", taxForm: "", });
  };



  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    console.log(file)
    if (file) {
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };





  // ----------------------------------------------------------handle update--------------------------------------------------


  

  const handleLogoUpdate = (e) => {
    const file = e.target.files[0];
    console.log(file)
    if (file) {
      SetUpdatedLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleInputUpdate = (e) => {
    const { name, value } = e.target;
  
    // Ensure that the 'id' is preserved when updating the selectedCompany state
    setSelectedCompany((prevCompany) => ({
      ...prevCompany,
      [name]: value,
    }));
  };
  


  const  handleUpdateForm = async (e)=>{
    e.preventDefault();

      const formUpdateData = {
        
        id: selectedCompany.id,
        companyLogo: selectedCompany.companyLogo,
        companyName: selectedCompany.companyName,
        legalName: selectedCompany.legalName,
        phoneNumber: selectedCompany.phoneNumber,
        eid: selectedCompany.eid,
        email: selectedCompany.email,
        industryType: selectedCompany.industryType,
        taxForm: selectedCompany.taxForm,

      };

      const data = new FormData();
      if(updatedLogo){
        data.delete("companyLogo")
        data.append("companyLogo", updatedLogo);
      }
      Object.keys(formUpdateData).forEach((key) => {
        data.append(key, formUpdateData[key]);
      });

      try{
        const response = await axios.post(
        `${apiEndPointUrl}/update-company-details`,
         data ,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        if(response){
          console.log('Company updated successfully:');
        }
      }catch(err){
        console.log(err)
      }
      

  }




  return (
    <>
      {
          selectedCompany 
                  ? 
    // ---------------------------company details with update buttom -----------------------
        <div className="companyDetails">
            <p className="companyName">   Company Name </p>

            <div className="addCompanyForm">
                <form onSubmit={handleUpdateForm}>
                    <p className="heading" style={{ marginTop: "0px" }}>Company Logo</p>
                    <div className="firstCompany styling">
                      <div className="companyLogoSection">
                          <div className="logo">
                            {
                                          preview 
                                             ? 
                                <img src={preview} alt={`${selectedCompany.companyName} Logo`} style={{ width: "55px", height: "55px",borderRadius: "79%", }}/>
                                            : 
                                  selectedCompany.companyLogo 
                                          && 
                                <img src={`data:image/png;base64,${arrayBufferToBase64(selectedCompany.companyLogo.data)}`} alt={`${selectedCompany.companyName} Logo`}
                                  style={{
                                    width: "55px",
                                    height: "55px",
                                    borderRadius: "79%",
                                  }}
                                />
                            }
                          </div>
                          <div className="custom-file-upload">
                            <label  htmlFor="file-upload" className="fontSize logo"  style={{ marginBottom: "10px" }}  >  Logo </label>
                            <input type="file" accept="image/*"  onChange={handleLogoUpdate} id="file-upload"  name="companyLogo" style={{ display: "none" }}  />
                            <label htmlFor="file-upload " className="custom-file-label ">Change Logo </label>
                          </div>
                      </div>

                      <div className="secondCompany">
                          <div className="firstBox">
                            <label  htmlFor="companyName" className="fontSize"   >  User Name</label>
                            <div className="editable-field">
                              <input className="companyNameInput" name="companyName" type="text" value={selectedCompany.companyName} onChange={handleInputUpdate} id="companyName" />
                              <span className="edit-icon">Edit</span>
                            </div>
                          </div>
                      </div>
                    </div>

                    <p className="heading2">Information</p>
                    <div className="firstCompany second">
                        <div>
                          <div style={{ marginBottom: "15px" }}>
                            <div style={{ lineHeight: "30px" }}>
                              <label htmlFor="legalName" className="fontSize" >   Legal Name</label>
                            </div>
                            
                            
                            <div className="editable-field">
                              <input className="companyNameInput" name="legalName" type="text" value={selectedCompany.legalName} onChange={handleInputUpdate} id="legalName" />
                              <span className="edit-icon">Edit</span>
                            </div>
                          </div>
                            
                          <div>
                            <div>
                              <div style={{ lineHeight: "30px" }}>
                                <label htmlFor="phoneNumber" className="fontSize" >
                                  Phone Number
                                </label>
                                <div className="phoneDiv editable-field">
                                  <input className="companyNameInput" name="phoneNumber" type="text" value={selectedCompany.phoneNumber} onChange={handleInputUpdate} id="phoneNumber" />
                                  <span className="edit-icon">Edit</span>
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>

                        <div className=" ">
                          <div>
                            <div style={{ marginBottom: "15px" }}>
                              <div style={{ lineHeight: "30px" }}>
                                <label htmlFor="eid" className="fontSize" >
                                  Employer Identification Number
                                </label>
                              </div>

                              <div className="editable-field">
                                <input className="companyNameInput" name="eid" type="text" value={selectedCompany.eid} onChange={handleInputUpdate} id="eid" />
                                <span className="edit-icon">Edit</span>
                              </div>
                            </div>

                            <div>
                              <div>
                                <div style={{ lineHeight: "30px" }}>
                                  <label htmlFor="email" className="fontSize" >
                                    Email Address
                                  </label>
                                    <input className="companyNameInput" name="email" type="text" value={selectedCompany.email} disabled id="email" />
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                    </div>

                    <p className="heading3">Company Type</p>
                    <div className="firstCompany " >
                        <div>
                          <div>
                            <label  htmlFor="industryType" className="fontSize"   >
                              Select Industry
                            </label>
                          </div>
                          
                          {/* onMouseEnter={() => handleMouseEnter('industryType')} onMouseLeave={handleMouseLeave} */}

                          <div className="editable-field" >
                            <input className="companyNameInput" name="industryType" style={{ paddingLeft: "5px" }} value={selectedCompany.industryType} onChange={handleInputUpdate} id="industryType"/>
                            <span className="edit-icon">Edit</span>
                          </div>
                        </div>

                        <div >
                          <div>
                            <div>
                              <label htmlFor="taxForm" className="h fontSize" >
                                Tax Form
                              </label>
                              <div className="editable-field">
                                <input className="companyNameInput" name="taxForm" style={{ paddingLeft: "5px" }} value={selectedCompany.taxForm} onChange={handleInputUpdate} id="taxForm"/>
                                <span className="edit-icon">Edit</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                    </div>

                    <div className="endButtons">
                      <button className="save" type="submit" > Update  </button>
                      <button className="backToList" onClick={handleBackToList}>  Back To List  </button>
                    </div>
                </form>
            </div>
        </div>
      
                                                    : 

        <>
          {
              showAddCompanyForm 
                      ? 
              <div className="addCompanyForm">
                  <p className="ds">Add Company</p>
                  <form onSubmit={handleFormSubmit}>
                      <p className="heading">Company name</p>
                      <div className="firstCompany styling">
                        <div className="companyLogoSection">
                          <div className="logo">
                              {
                                  preview 
                                     && 
                                  <img src={preview} alt="Logo Preview"  style={{  width: "70px",  height: "70px", borderRadius: "50%", }} />
                              }
                          </div>

                          <div className="custom-file-upload">
                            <label htmlFor="file-upload" className="fontSize" style={{ marginBottom: "10px" }}>Company Logo </label>
                            <input  type="file" accept="image/*" onChange={handleLogoChange} id="file-upload" name="companyLogo"  style={{ display: "none" }} />
                            <label htmlFor="file-upload"className="custom-file-label"> Browse  </label>
                          </div>
                        </div>

                        <div className="secondCompany">
                          <div className="firstBox" style={{paddingRight: '12px'}}>
                            <label htmlFor="companyName" className="fontSize"  style={{ marginBottom: "8px" }} >Company Name </label>
                            <input className="companyNameInput"   name="companyName" type="text"  value={formData.companyName}  onChange={handleInputChange} id="companyName" />
                          </div>
                        </div>
                      </div>

                      <p className="heading2" >Information</p>
                      <div className="firstCompany second">
                        <div>
                          <div style={{ marginBottom: "15px" }}>
                            <div style={{ lineHeight: "30px" }}>
                              <label htmlFor="legalName" className="fontSize"> Legal Name </label>  </div>
                            <div>
                              <input className="companyNameInput" name="legalName" type="text" value={formData.legalName}  onChange={handleInputChange} id="legalName" />
                            </div>
                          </div>

                          <div>
                            <div>
                              <div style={{ lineHeight: "30px" }}>
                                <label htmlFor="phoneNumber" className="fontSize">  Phone Number</label>
                                <div className="phoneDiv">
                                  <input className="enp" name="extensionPhoneNumber"  type="number"  pattern="[0-9]*" inputMode="numeric"
                                    style={{
                                      WebkitAppearance: "none",
                                      MozAppearance: "none",
                                    }}
                                  />
                                  <input className="companyNameInput" name="phoneNumber" type="text" value={formData.phoneNumber}  onChange={handleInputChange}  id="phoneNumber"
                                    style={{ width: "302px" }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>

                        <div className="firstCompany second" style={{padding:"0"}}>
                          <div>
                            <div style={{ marginBottom: "15px" }}>
                              <div style={{ lineHeight: "30px" }}>
                                <label htmlFor="eid" className="fontSize">  Employer Identification Number  </label>
                              </div>
                              <div>
                                <input  className="companyNameInput" name="eid" type="text" value={formData.eid} onChange={handleInputChange} id="eid" />
                              </div>
                            </div>

                            <div>
                              <div>
                                <div style={{ lineHeight: "30px" }}>
                                  <label htmlFor="email" className="fontSize">Email Address </label>
                                  <div>
                                    <input  className="companyNameInput" name="email" type="text" value={formData.email}  onChange={handleInputChange} id="email"/>
                                  </div>
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                        
                      </div>

                      <p className="heading3" >Company Type</p>
                      <div className="firstCompany">
                        <div>
                          <div>
                            <label htmlFor="industryType"  className="fontSize" style={{ lineHeight: "30px" }} > Select Industry</label>
                          </div>

                          <div>
                            <select className="companyNameInput" name="industryType" style={{ paddingLeft: "5px" }}  value={formData.industryType} onChange={handleInputChange}id="industryType" >
                              <option value="" disabled></option>
                              <option value="IT">IT</option>
                              <option value="Finance">Finance</option>
                              <option value="Healthcare">Healthcare</option>
                              <option value="Retail">Retail</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <div>
                            <div>
                              <label  htmlFor="taxForm" className="h fontSize" style={{ lineHeight: "30px" }} > Tax Form  </label>
                              <select className="companyNameInput" name="taxForm" style={{ paddingLeft: "5px" }}value={formData.taxForm} onChange={handleInputChange}  id="taxForm">
                                <option value="" disabled></option>
                                <option value="IT">IT</option>
                                <option value="Finance">Finance</option>
                                <option value="Healthcare">Healthcare</option>
                                <option value="Retail">Retail</option>
                              </select>
                            </div>
                          </div>
                        </div>

                      </div>

                      <div className="endButtons">
                        <button className="save" type="submit"> Save </button>
                        <button  className="reset" type="button" onClick={handleCancelClick} style={{ marginRight: "35px" }} >  < RestartAltIcon />  </button>
                      </div>
                  </form>
              </div>
          
                           : 

            <>
              <div className="company-line">
                <p className="text">Companies</p>
                <div className="buttons">
                  <SearchIcon style={{fontSize:"16.9px", position:"absolute", marginLeft:"12px", marginTop:"6px"}}/>
                  <input className="but-searchList "  id="search"  onChange={companySearchBar}  value={searchTerm} placeholder="Search" />
                  <button onClick={handleAddCompanyClick} id="companyAdd" className="add" > <AddCircleOutlineIcon style={{fontSize:"16px"}}/> Add Company </button>
                </div>
              </div>

              <div className="main">
                <div className="companiesList">
                  {
                    searchTerm.length === 0
                          ?
                      companies.length > 0 
                            ? 
                      companies.map((company) => {
                        const imageDataBytes = company.companyLogo ? company.companyLogo.data :null ;
                        const imageDataBase64 = arrayBufferToBase64(imageDataBytes);
                        const logoSrc = imageDataBase64  ?  `data:image/png;base64,${imageDataBase64}` :"path_to_default_logo.png";
                        return (
                          <div key={company.eid}  className="companyItem" onClick={() => handleCompanyClick(company.eid)} >
                            
                            <DragIndicatorIcon style={{fontSize:"15px", marginLeft:"-9px"}}/>
                            <img src={logoSrc} style={{ width: "15px",  height: "15px",  marginRight: "10px",}} alt={`${company.companyName} Logo`} />
                            <div className="details">
                                <p className="cName">{company.companyName}</p>
                                <p className="cEid">{company.eid}</p>
                            </div>

                            <div className="arrow"> <KeyboardArrowRightIcon/></div>
                          </div>
                        );
                      })
                                : 
                    <p>No Companies Found</p>

                             : 
                    filteredCompanies.length > 0 
                             ? 
                       filteredCompanies.map((company) => {
 
                         const imageDataBytes =  company.companyLogo ? company.companyLogo.data : null ;
                         const imageDataBase64 = arrayBufferToBase64(imageDataBytes);
                         const logoSrc = imageDataBase64  ?  `data:image/png;base64,${imageDataBase64}` :"path_to_default_logo.png";
 
                         return (
                           <div key={company.eid}  className="companyItem" onClick={() => handleCompanyClick(company.eid)} >
                             
                             <DragIndicatorIcon style={{fontSize:"15px", marginLeft:"-9px"}}/>
                             <img src={logoSrc} style={{width: "15px", height: "15px", marginRight: "10px",}} alt={`${company.companyName} Logo`} />
                             <div className="details">
                                 <p className="cName">{company.companyName}</p>
                                 <p className="cEid">{company.eid}</p>
                             </div>
 
                             <div className="arrow"> <KeyboardArrowRightIcon/></div>
                           </div>
                         );
                       })

                            : 
                    <p>No Companies Found</p>
                  }
                </div>
              </div>

            </>
          }

        </>    
      }
    </>

  );
};

export default CompaniesDetails;


