import React from "react";
import { apiClient } from "../../api/apiService";
import ProfileHeader from "../../components/profile/client/ProfileHeader";
import ProfileTabs from "../../components/profile/client/ProfileTabs";

const ProfilePage = () => {
  const [profileData, setProfileData] = React.useState({
    first_name: "",
    last_name: "",
    profile_picture: null,
    bio: "",
    location: "",
    language: "",
    email: "",
    username: "",
    is_client: false,
    is_vendor: false
  });

  const [clientData, setClientData] = React.useState({
    address: "",
    company_name: "",
    contact_number: "",
    reviews: [],
    user: null
  });

  const [editMode, setEditMode] = React.useState(false);
  const [tempImage, setTempImage] = React.useState(null);
  const [selectedFile, setSelectedFile] = React.useState(null);

  const getClientData = async () => {
    try {
      const res = await apiClient.get("users/client-profile/");
      if (res.status === 200) {
        setClientData(res.data);
      }
    } catch (error) {
      console.error("Error fetching client data:", error);
    }
  };

  const getProfileData = async () => {
    try {
      const res = await apiClient.get("/users/profile/");
      if (res.status === 200) {
        setProfileData({
          ...res.data,
          profile_picture: res.data.profile_picture || "https://storage.googleapis.com/a1aa/image/83dab614-f2ce-4beb-4850-b9d7499cd5d3.jpg"
        });

        if (res.data.is_client) {
          getClientData();
        }
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "company_name" || name === "contact_number" || name === "address") {
      setClientData(prev => ({ ...prev, [name]: value }));
    } else {
      setProfileData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = (event) => {
        setTempImage(event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(profileData).forEach(key => {
        if (key !== 'profile_picture' && key !== 'is_client' && key !== 'is_vendor') {
          formData.append(key, profileData[key]);
        }
      });

      if (selectedFile) {
        formData.append('profile_picture', selectedFile);
      }

      const profileRes = await apiClient.put("/users/profile/", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (profileData.is_client) {
        const clientPayload = {
          company_name: clientData.company_name,
          contact_number: clientData.contact_number,
          address: clientData.address,
          user: clientData.user
        };

        await apiClient.put("users/client-profile/", clientPayload);
      }

      if (profileRes.status === 200) {
        setEditMode(false);
        setTempImage(null);
        setSelectedFile(null);
        getProfileData();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Gagal menyimpan profil. Silakan coba lagi.");
    }
  };

  React.useEffect(() => {
    getProfileData();
  }, []);

  return (
    <main className="max-w-4xl mx-auto mt-28 flex flex-col space-y-6 mb-12 px-4">
      <ProfileHeader
        profileData={profileData}
        clientData={clientData}
        editMode={editMode}
        tempImage={tempImage}
        handleInputChange={handleInputChange}
        handleImageChange={handleImageChange}
        setEditMode={setEditMode}
        handleSubmit={handleSubmit}
      />

      <ProfileTabs
        profileData={profileData}
        clientData={clientData}
      />
    </main>
  );
};

export default ProfilePage;