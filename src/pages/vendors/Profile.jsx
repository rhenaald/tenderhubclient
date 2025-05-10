import React, { useState, useEffect } from "react";
import { apiClient } from "../../api/apiService";
import ProfileHeader from "../../components/profile/vendor/ProfileHeader";
import ProfileEditForm from "../../components/profile/vendor/ProfileEditForm";
import ProfileView from "../../components/profile/vendor/ProfileView";
import ProfileTabs from "../../components/profile/vendor/ProfileTabs";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    profile_picture: null,
    bio: "",
    location: "",
    language: "",
    email: "",
    username: "",
    is_client: false,
    is_vendor: false,
    id: null,
  });
  const [vendorData, setVendorData] = useState({
    hourly_rate: null
  });
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [educationItems, setEducationItems] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeTab, setActiveTab] = useState("projects");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Portfolio state
  const [isAddingPortfolio, setIsAddingPortfolio] = useState(false);
  const [newPortfolio, setNewPortfolio] = useState({
    title: "",
    description: "",
    image: null,
    link: "",
    date_created: ""
  });
  const [portfolioPreview, setPortfolioPreview] = useState(null);

  // Certification state
  const [isAddingCertification, setIsAddingCertification] = useState(false);
  const [newCertification, setNewCertification] = useState({
    title: "",
    issuing_organization: "",
    issue_date: "",
    expiry_date: "",
    credential_id: ""
  });

  // Education state
  const [isAddingEducation, setIsAddingEducation] = useState(false);
  const [newEducation, setNewEducation] = useState({
    institution: "",
    degree: "",
    field_of_study: "",
    start_date: "",
    end_date: ""
  });

  useEffect(() => {
    getProfileData();
  }, []);

  const getProfileData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.get("/users/profile/");
      if (res.status === 200) {
        const userData = {
          ...res.data,
          profile_picture: res.data.profile_picture || "https://storage.googleapis.com/a1aa/image/83dab614-f2ce-4beb-4850-b9d7499cd5d3.jpg"
        };
        setProfileData(userData);

        if (res.data.is_vendor) {
          await getVendorData();
          await getVendorPortfolios();
          await getVendorCertifications();
          await getVendorEducation();
        }
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      setError("Gagal memuat data profil. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const getVendorData = async () => {
    try {
      const res = await apiClient.get("/users/vendors/me/");
      if (res.status === 200) {
        setVendorData({
          hourly_rate: res.data.hourly_rate
        });
      }
    } catch (error) {
      console.error("Error fetching vendor data:", error);
    }
  };

  const getVendorPortfolios = async () => {
    try {
      const res = await apiClient.get("/users/vendors/me/portfolios/");
      if (res.status === 200) {
        setPortfolioItems(res.data);
      }
    } catch (error) {
      console.error("Error fetching vendor portfolios:", error);
    }
  };

  const getVendorCertifications = async () => {
    try {
      const res = await apiClient.get("/users/vendors/me/certifications/");
      if (res.status === 200) {
        setCertifications(res.data);
      }
    } catch (error) {
      console.error("Error fetching vendor certifications:", error);
    }
  };

  const getVendorEducation = async () => {
    try {
      const res = await apiClient.get("/users/vendors/me/education/");
      if (res.status === 200) {
        setEducationItems(res.data);
      }
    } catch (error) {
      console.error("Error fetching vendor education:", error);
    }
  };

  const handleDeletePortfolio = async (portfolioId) => {
    setError(null);
    try {
      // Get the user id from profileData
      const userId = profileData.id;

      // Using the new URL format for deleting portfolio
      const res = await apiClient.delete(`/users/vendors/me/delete_portfolio/?portfolio_id=${portfolioId}`);

      if (res.status === 204 || res.status === 200) {
        // Update portfolioItems state by filtering out the deleted item
        setPortfolioItems(current => current.filter(item => item.id !== portfolioId));
        setSuccessMessage("Portfolio berhasil dihapus!");

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      }
    } catch (error) {
      console.error("Error deleting portfolio:", error);
      if (error.response) {
        const errorMessage = error.response.data?.detail ||
          error.response.data?.message ||
          "Gagal menghapus portfolio. Silakan coba lagi.";
        setError(errorMessage);
      } else {
        setError("Gagal menghapus portfolio. Silakan coba lagi.");
      }
    }
  };

  const handleDeleteCertification = async (certificationId) => {
    setError(null);
    try {
      const res = await apiClient.delete(`/users/vendors/me/certifications/${certificationId}/`);

      if (res.status === 204 || res.status === 200) {
        // Update certifications state by filtering out the deleted item
        setCertifications(current => current.filter(item => item.id !== certificationId));
        setSuccessMessage("Sertifikasi berhasil dihapus!");

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      }
    } catch (error) {
      console.error("Error deleting certification:", error);
      if (error.response) {
        const errorMessage = error.response.data?.detail ||
          error.response.data?.message ||
          "Gagal menghapus sertifikasi. Silakan coba lagi.";
        setError(errorMessage);
      } else {
        setError("Gagal menghapus sertifikasi. Silakan coba lagi.");
      }
    }
  };

  const handleDeleteEducation = async (educationId) => {
    setError(null);
    try {
      const res = await apiClient.delete(`/users/vendors/me/education/${educationId}/`);

      if (res.status === 204 || res.status === 200) {
        // Update educationItems state by filtering out the deleted item
        setEducationItems(current => current.filter(item => item.id !== educationId));
        setSuccessMessage("Pendidikan berhasil dihapus!");

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      }
    } catch (error) {
      console.error("Error deleting education:", error);
      if (error.response) {
        const errorMessage = error.response.data?.detail ||
          error.response.data?.message ||
          "Gagal menghapus pendidikan. Silakan coba lagi.";
        setError(errorMessage);
      } else {
        setError("Gagal menghapus pendidikan. Silakan coba lagi.");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleVendorDataChange = (e) => {
    const { name, value } = e.target;
    setVendorData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (!file.type.startsWith('image/')) {
        setError("Harap pilih file gambar");
        return;
      }

      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        setTempImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      Object.keys(profileData).forEach(key => {
        if (key !== 'profile_picture' && key !== 'is_client' && key !== 'is_vendor' && key !== 'id') {
          formData.append(key, profileData[key]);
        }
      });

      if (selectedFile) {
        formData.append('profile_picture', selectedFile);
      }

      const res = await apiClient.put("/users/profile/", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.status === 200) {
        if (profileData.is_vendor) {
          try {
            await apiClient.put("/users/vendors/me/", {
              hourly_rate: vendorData.hourly_rate
            });
          } catch (vendorError) {
            console.error("Error updating vendor data:", vendorError);
            setError("Gagal menyimpan data vendor. Silakan coba lagi.");
            setIsLoading(false);
            return;
          }
        }

        setEditMode(false);
        setTempImage(null);
        setSelectedFile(null);
        setSuccessMessage("Profil berhasil diperbarui!");

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);

        getProfileData();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Gagal menyimpan profil. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePortfolioInputChange = (e) => {
    const { name, value } = e.target;
    setNewPortfolio(prev => ({ ...prev, [name]: value }));
  };

  const handlePortfolioImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (!file.type.startsWith('image/')) {
        setError("Harap pilih file gambar");
        return;
      }

      setNewPortfolio(prev => ({ ...prev, image: file }));

      const reader = new FileReader();
      reader.onload = (event) => {
        setPortfolioPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPortfolio = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!newPortfolio.title || !newPortfolio.description || !newPortfolio.date_created) {
      setError("Judul, deskripsi, dan tanggal dibuat wajib diisi");
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', newPortfolio.title);
      formData.append('description', newPortfolio.description);
      formData.append('link', newPortfolio.link || "");

      const formattedDate = new Date(newPortfolio.date_created).toISOString().split('T')[0];
      formData.append('date_created', formattedDate);

      if (newPortfolio.image) {
        formData.append('image', newPortfolio.image);
      }

      const res = await apiClient.post("/users/vendors/me/add_portfolio/", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.status === 201 || res.status === 200) {
        setIsAddingPortfolio(false);
        setNewPortfolio({
          title: "",
          description: "",
          image: null,
          link: "",
          date_created: ""
        });
        setPortfolioPreview(null);
        setSuccessMessage("Portfolio berhasil ditambahkan!");
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
        await getVendorPortfolios();
      }
    } catch (error) {
      console.error("Error adding portfolio:", error);
      if (error.response) {
        const errorMessage = error.response.data?.detail ||
          error.response.data?.message ||
          "Gagal menambahkan portfolio. Silakan coba lagi.";
        setError(errorMessage);
      } else {
        setError("Gagal menambahkan portfolio. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCertificationInputChange = (e) => {
    const { name, value } = e.target;
    setNewCertification(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCertification = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!newCertification.title || !newCertification.issuing_organization || !newCertification.issue_date) {
      setError("Judul, organisasi penerbit, dan tanggal penerbitan wajib diisi");
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        title: newCertification.title,
        issuing_organization: newCertification.issuing_organization,
        issue_date: newCertification.issue_date
      };

      // Only add these fields if they have values
      if (newCertification.expiry_date) {
        payload.expiry_date = newCertification.expiry_date;
      }

      if (newCertification.credential_id) {
        payload.credential_id = newCertification.credential_id;
      }

      const res = await apiClient.post("/users/vendors/me/add_certification/", payload);

      if (res.status === 201 || res.status === 200) {
        setIsAddingCertification(false);
        setNewCertification({
          title: "",
          issuing_organization: "",
          issue_date: "",
          expiry_date: "",
          credential_id: ""
        });
        setSuccessMessage("Sertifikasi berhasil ditambahkan!");
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
        await getVendorCertifications();
      }
    } catch (error) {
      console.error("Error adding certification:", error);
      if (error.response) {
        const errorMessage = error.response.data?.detail ||
          error.response.data?.message ||
          "Gagal menambahkan sertifikasi. Silakan coba lagi.";
        setError(errorMessage);
      } else {
        setError("Gagal menambahkan sertifikasi. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEducationInputChange = (e) => {
    const { name, value } = e.target;
    setNewEducation(prev => ({ ...prev, [name]: value }));
  };

  const handleAddEducation = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!newEducation.institution || !newEducation.degree || !newEducation.field_of_study || !newEducation.start_date) {
      setError("Institusi, gelar, bidang studi, dan tanggal mulai wajib diisi");
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        institution: newEducation.institution,
        degree: newEducation.degree,
        field_of_study: newEducation.field_of_study,
        start_date: newEducation.start_date
      };

      // Only add end_date if it has value
      if (newEducation.end_date) {
        payload.end_date = newEducation.end_date;
      }

      const res = await apiClient.post("/users/vendors/me/add_education/", payload);

      if (res.status === 201 || res.status === 200) {
        setIsAddingEducation(false);
        setNewEducation({
          institution: "",
          degree: "",
          field_of_study: "",
          start_date: "",
          end_date: ""
        });
        setSuccessMessage("Pendidikan berhasil ditambahkan!");
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
        await getVendorEducation();
      }
    } catch (error) {
      console.error("Error adding education:", error);
      if (error.response) {
        const errorMessage = error.response.data?.detail ||
          error.response.data?.message ||
          "Gagal menambahkan pendidikan. Silakan coba lagi.";
        setError(errorMessage);
      } else {
        setError("Gagal menambahkan pendidikan. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto mt-28 flex flex-col space-y-6 mb-12 px-4">
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md" role="alert">
          <p>{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md" role="alert">
          <p>{successMessage}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-6">
        <ProfileHeader
          profileData={profileData}
          editMode={editMode}
          tempImage={tempImage}
          handleImageChange={handleImageChange}
        />
        {
          editMode ? (
            <ProfileEditForm
              profileData={profileData}
              vendorData={vendorData}
              handleInputChange={handleInputChange}
              handleVendorDataChange={handleVendorDataChange}
              isVendor={profileData.is_vendor}
            />
          ) : (
            <ProfileView
              profileData={profileData}
              vendorData={vendorData}
              isVendor={profileData.is_vendor}
            />
          )
        }

        <div className="flex justify-center">
          {editMode ? (
            <div className="flex space-x-4 w-full max-w-md">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`flex-1 ${isLoading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'} text-white font-medium rounded-lg py-2 text-lg transition duration-200 flex justify-center items-center`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Menyimpan...
                  </>
                ) : "Simpan"}
              </button>
              <button
                onClick={() => {
                  setEditMode(false);
                  setTempImage(null);
                  setSelectedFile(null);
                  setError(null);
                }}
                disabled={isLoading}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg py-2 text-lg transition duration-200"
              >
                Batal
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="w-full max-w-md bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg py-2 text-lg transition duration-200 flex items-center justify-center"
              type="button"
            >
              <i className="fas fa-edit mr-2"></i>
              Edit Profil
            </button>
          )}
        </div>
      </div >

      <div className="mt-8">
        <ProfileTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isVendor={profileData.is_vendor}
          isAddingPortfolio={isAddingPortfolio}
          setIsAddingPortfolio={setIsAddingPortfolio}
          portfolioItems={portfolioItems}
          newPortfolio={newPortfolio}
          portfolioPreview={portfolioPreview}
          handlePortfolioInputChange={handlePortfolioInputChange}
          handlePortfolioImageChange={handlePortfolioImageChange}
          handleAddPortfolio={handleAddPortfolio}
          handleDeletePortfolio={handleDeletePortfolio}
          isLoading={isLoading}
          certifications={certifications}
          isAddingCertification={isAddingCertification}
          setIsAddingCertification={setIsAddingCertification}
          newCertification={newCertification}
          handleCertificationInputChange={handleCertificationInputChange}
          handleAddCertification={handleAddCertification}
          handleDeleteCertification={handleDeleteCertification}
          educationItems={educationItems}
          isAddingEducation={isAddingEducation}
          setIsAddingEducation={setIsAddingEducation}
          newEducation={newEducation}
          handleEducationInputChange={handleEducationInputChange}
          handleAddEducation={handleAddEducation}
          handleDeleteEducation={handleDeleteEducation}
        />
      </div>
  </main>
  );
};

export default ProfilePage;