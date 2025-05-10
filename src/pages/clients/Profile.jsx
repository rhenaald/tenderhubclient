import React from "react";
import { apiClient } from "../../api/apiService";

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
  const [activeTab, setActiveTab] = React.useState("projects");

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
          // Use default image if none provided
          profile_picture: res.data.profile_picture || "https://storage.googleapis.com/a1aa/image/83dab614-f2ce-4beb-4850-b9d7499cd5d3.jpg"
        });

        // If this is a client, fetch client data
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
      // Store the actual file for later submission
      setSelectedFile(e.target.files[0]);

      // Create preview
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
      // First update profile data
      const formData = new FormData();

      // Append all text fields to formData
      Object.keys(profileData).forEach(key => {
        if (key !== 'profile_picture' && key !== 'is_client' && key !== 'is_vendor') {
          formData.append(key, profileData[key]);
        }
      });

      // If a new image was selected, append the actual file
      if (selectedFile) {
        formData.append('profile_picture', selectedFile);
      }

      const profileRes = await apiClient.put("/users/profile/", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Then update client data if user is a client
      if (profileData.is_client) {
        const clientPayload = {
          company_name: clientData.company_name,
          contact_number: clientData.contact_number,
          address: clientData.address,
          user: clientData.user
        };

        const clientRes = await apiClient.put("users/client-profile/", clientPayload);
      }

      if (profileRes.status === 200) {
        // Reset states after successful update
        setEditMode(false);
        setTempImage(null);
        setSelectedFile(null);
        getProfileData(); // Refresh data
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Gagal menyimpan profil. Silakan coba lagi.");
    }
  };

  React.useEffect(() => {
    getProfileData();
  }, []);

  const fullName = `${profileData.first_name} ${profileData.last_name}`.trim() || profileData.username;

  return (
    <main className="max-w-4xl mx-auto mt-28 flex flex-col space-y-6 mb-12 px-4">
      {/* Profile Card - Left-aligned layout */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6 mb-6">
          {/* Left side - Profile Picture */}
          <div className="flex-shrink-0 flex flex-col items-center">
            {editMode ? (
              <label htmlFor="profile-picture" className="cursor-pointer">
                <div className="relative">
                  <img
                    alt="Profile"
                    className="w-40 h-40 rounded-full object-cover border-4 border-blue-400"
                    src={tempImage || profileData.profile_picture || "https://via.placeholder.com/160"}
                  />
                  <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2">
                    <i className="fas fa-camera"></i>
                  </div>
                </div>
                <input
                  id="profile-picture"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            ) : (
              <img
                alt="Profile"
                className="w-40 h-40 rounded-full object-cover border-4 border-blue-400 shadow-md"
                src={profileData.profile_picture || "https://via.placeholder.com/160"}
              />
            )}
          </div>

          {/* Right side - Profile Information */}
          <div className="flex-grow">
            {editMode ? (
              <div className="space-y-3 w-full">
                <input
                  name="first_name"
                  value={profileData.first_name}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  className="w-full p-2 border rounded focus:border-blue-400 focus:ring focus:ring-blue-200 outline-none"
                />
                <input
                  name="last_name"
                  value={profileData.last_name}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  className="w-full p-2 border rounded focus:border-blue-400 focus:ring focus:ring-blue-200 outline-none"
                />
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  placeholder="Bio"
                  className="w-full p-2 border rounded focus:border-blue-400 focus:ring focus:ring-blue-200 outline-none h-20 resize-none"
                />
              </div>
            ) : (
              <div>
                <h2 className="font-semibold text-xl text-gray-900">{fullName}</h2>
                <p className="text-blue-500 font-medium text-sm mt-1">@{profileData.username}</p>
                <p className="text-gray-500 text-sm">{profileData.email}</p>
                {profileData.bio && (
                  <p className="text-gray-600 mt-3">{profileData.bio}</p>
                )}

                {/* User Details Info - In edit mode, this moves to the bottom */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="flex justify-between items-center text-gray-600 text-base bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-map-marker-alt text-blue-500 text-sm"></i>
                      <span>Lokasi</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {profileData.location || "Belum diisi"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600 text-base bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-language text-blue-500 text-sm"></i>
                      <span>Bahasa</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {profileData.language || "Belum diisi"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600 text-base bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-user-tag text-blue-500 text-sm"></i>
                      <span>Role</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {profileData.is_client ? "Client" : "Vendor"}
                    </span>
                  </div>
                </div>

                {/* Client-specific information - Only shown for clients */}
                {profileData.is_client && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="text-gray-600 text-base bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <i className="fas fa-building text-blue-500 text-sm"></i>
                          <span>Perusahaan</span>
                        </div>
                        <div className="mt-1">
                          <span className="font-semibold text-gray-900 break-words">
                            {clientData.company_name || "Belum diisi"}
                          </span>
                        </div>
                      </div>
                    <div className="flex items-center text-gray-600 text-base bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <i className="fas fa-phone text-blue-500 text-sm"></i>
                        <span>Kontak</span>
                      </div>
                      <div className="flex-grow mx-2">
                        <span className="font-semibold text-gray-900 block text-right truncate max-w-full">
                          {clientData.contact_number || "Belum diisi"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600 text-base bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <i className="fas fa-home text-blue-500 text-sm"></i>
                        <span>Alamat</span>
                      </div>
                      <div className="flex-grow mx-2">
                        <span className="font-semibold text-gray-900 block text-right truncate max-w-full" title={clientData.address || "Belum diisi"}>
                          {clientData.address || "Belum diisi"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Edit mode user details - moved outside of profile section for better layout when editing */}
        {editMode && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center text-gray-600 text-base bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2 flex-shrink-0">
                <i className="fas fa-map-marker-alt text-blue-500 text-sm"></i>
                <span>Lokasi</span>
              </div>
              <div className="flex-grow mx-2">
                <input
                  name="location"
                  value={profileData.location}
                  onChange={handleInputChange}
                  className="w-full border rounded p-1 focus:border-blue-400 focus:ring focus:ring-blue-200 outline-none text-right"
                />
              </div>
            </div>
            <div className="flex items-center text-gray-600 text-base bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2 flex-shrink-0">
                <i className="fas fa-language text-blue-500 text-sm"></i>
                <span>Bahasa</span>
              </div>
              <div className="flex-grow mx-2">
                <input
                  name="language"
                  value={profileData.language}
                  onChange={handleInputChange}
                  className="w-full border rounded p-1 focus:border-blue-400 focus:ring focus:ring-blue-200 outline-none text-right"
                />
              </div>
            </div>

            {/* Client fields in edit mode */}
            {profileData.is_client && (
              <>
                <div className="flex justify-between items-center text-gray-600 text-base bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-building text-blue-500 text-sm"></i>
                    <span>Perusahaan</span>
                  </div>
                  <input
                    name="company_name"
                    value={clientData.company_name}
                    onChange={handleInputChange}
                    className="border rounded p-1 focus:border-blue-400 focus:ring focus:ring-blue-200 outline-none"
                  />
                </div>
                <div className="flex justify-between items-center text-gray-600 text-base bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-phone text-blue-500 text-sm"></i>
                    <span>Kontak</span>
                  </div>
                  <input
                    name="contact_number"
                    value={clientData.contact_number}
                    onChange={handleInputChange}
                    className="border rounded p-1 focus:border-blue-400 focus:ring focus:ring-blue-200 outline-none"
                  />
                </div>
                <div className="flex justify-between items-center text-gray-600 text-base bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-home text-blue-500 text-sm"></i>
                    <span>Alamat</span>
                  </div>
                  <input
                    name="address"
                    value={clientData.address}
                    onChange={handleInputChange}
                    className="border rounded p-1 focus:border-blue-400 focus:ring focus:ring-blue-200 outline-none"
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-center">
          {editMode ? (
            <div className="flex space-x-4 w-full max-w-md">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg py-2 text-lg transition duration-200"
              >
                Simpan
              </button>
              <button
                onClick={() => {
                  setEditMode(false);
                  setTempImage(null);
                  setSelectedFile(null);
                }}
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
      </div>

      {/* Tabs and Content */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex text-lg font-semibold text-gray-700 select-none border-b">
          <button
            onClick={() => setActiveTab("projects")}
            className={`py-4 px-6 ${activeTab === "projects" ? "text-blue-500 font-bold border-b-2 border-blue-500" : "hover:bg-blue-50 transition duration-200"}`}
          >
            Proyek Saya
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`py-4 px-6 ${activeTab === "history" ? "text-blue-500 font-bold border-b-2 border-blue-500" : "hover:bg-blue-50 transition duration-200"}`}
          >
            Riwayat
          </button>
        </div>

        {/* Projects Content */}
        {activeTab === "projects" && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-xl text-gray-800">Proyek Aktif</h3>
              <button className="text-blue-500 hover:text-blue-600 flex items-center">
                <i className="fas fa-plus-circle mr-1"></i>
                Tambah Proyek
              </button>
            </div>

            <div className="space-y-4">
              {[...Array(2)].map((_, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-white hover:border-blue-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex space-x-4">
                      <div className="bg-blue-100 p-3 rounded-full h-12 w-12 flex items-center justify-center">
                        <i className="fas fa-project-diagram text-blue-500 text-lg"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Proyek {index + 1}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                          <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">Dalam pengerjaan</span>
                          <span>•</span>
                          <span>Deadline: 12 Hari</span>
                        </div>
                      </div>
                    </div>
                    <span className="font-bold text-blue-500">Rp 1.500.000</span>
                  </div>

                  <p className="text-gray-700 my-4">
                    Deskripsi singkat proyek yang sedang dikerjakan oleh vendor. Proyek ini meliputi pembuatan desain dan pengembangan website.
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src="https://via.placeholder.com/32"
                        alt="Vendor"
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-sm font-medium">Dikerjakan oleh: Vendor Studio</span>
                    </div>
                    <button className="text-blue-500 hover:text-blue-600 font-medium text-sm">
                      Lihat Detail
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty state if no projects */}
            {false && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  <i className="fas fa-folder-open text-blue-500 text-3xl"></i>
                </div>
                <h4 className="text-lg font-medium text-gray-800 mb-2">Belum ada proyek aktif</h4>
                <p className="text-gray-500 mb-6">Mulai proyek baru untuk melihat daftar proyek aktif Anda</p>
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg px-6 py-2 transition duration-200">
                  Buat Proyek Baru
                </button>
              </div>
            )}
          </div>
        )}

        {/* History Content */}
        {activeTab === "history" && (
          <div className="p-6">
            <h3 className="font-semibold text-xl text-gray-800 mb-6">Riwayat Proyek</h3>

            <div className="space-y-4">
              {[...Array(1)].map((_, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-5 bg-white"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex space-x-4">
                      <div className="bg-gray-100 p-3 rounded-full h-12 w-12 flex items-center justify-center">
                        <i className="fas fa-check-circle text-green-500 text-lg"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Proyek Selesai {index + 1}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                          <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium">Selesai</span>
                          <span>•</span>
                          <span>Tanggal: 10 April 2025</span>
                        </div>
                      </div>
                    </div>
                    <span className="font-bold text-green-500">Rp 2.000.000</span>
                  </div>

                  <p className="text-gray-700 my-4">
                    Proyek desain UI/UX untuk aplikasi mobile yang telah selesai dengan baik dan tepat waktu.
                  </p>

                  <div className="flex justify-end">
                    <button className="text-blue-500 hover:text-blue-600 font-medium text-sm">
                      Lihat Detail
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty state for history */}
            {false && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <i className="fas fa-history text-gray-500 text-3xl"></i>
                </div>
                <h4 className="text-lg font-medium text-gray-800 mb-2">Belum ada riwayat proyek</h4>
                <p className="text-gray-500">Riwayat proyek yang telah selesai akan muncul di sini</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default ProfilePage;