import React from "react";
import { apiClient } from "../../api/apiService";

const ProfilePage = () => {
  const [data, setData] = React.useState([]);

  const getData = async () => {
    const res = await apiClient.get("/users/profile/")
    console.log(res.data)
    if (res.status === 200) {
      setData(res.data);
    } else {
      console.error("Error fetching data:", res.statusText);
    }
  }

  React.useEffect(() => {
    getData();
  }, []);

  return (
    <main className="max-w-6xl mx-auto mt-28 flex flex-col space-y-6 mb-12 px-4">
      <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
        {/* Left column */}
        <div className="flex flex-col space-y-6 md:w-1/3">
          {/* Profile card */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
            <img
              alt="Profile photo of a young man with short brown hair wearing a black shirt"
              className="w-40 h-40 rounded-full object-cover"
              height="160"
              src="https://storage.googleapis.com/a1aa/image/83dab614-f2ce-4beb-4850-b9d7499cd5d3.jpg"
              width="160"
            />
            <h2 className="mt-6 font-semibold text-xl text-gray-900">
              Ikhwan Kurniawan
            </h2>
            <p className="text-gray-500 mt-1 text-lg">UI/UX Designer</p>
            <div className="mt-6 w-full space-y-3">
              <div className="flex justify-between items-center text-gray-600 text-base">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-map-marker-alt text-blue-400 text-sm"></i>
                  <span>Lokasi</span>
                </div>
                <span className="font-semibold text-gray-900">Jakarta</span>
              </div>
              <div className="flex justify-between items-center text-gray-600 text-base">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-language text-blue-400 text-sm"></i>
                  <span>Bahasa</span>
                </div>
                <span className="font-semibold text-gray-900">Indonesia</span>
              </div>
              <div className="flex justify-between items-center text-gray-600 text-base">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-graduation-cap text-blue-400 text-sm"></i>
                  <span>Edukasi</span>
                </div>
                <span className="font-semibold text-gray-900">
                  S1 - Informatika
                </span>
              </div>
            </div>
            <button
              className="mt-6 w-full bg-blue-400 hover:bg-blue-500 text-white font-medium rounded-md py-2 text-lg"
              type="button"
            >
              Edit
            </button>
          </div>
          {/* Skill card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold text-lg text-center mb-3">SKill</h3>
            <p className="text-gray-600 text-center text-lg leading-relaxed">
              UI/UX Designer   Web Dev
              <br />
              Game Dev   Desain Grafis
            </p>
            <button
              className="mt-6 w-full bg-blue-400 hover:bg-blue-500 text-white font-medium rounded-md py-2 text-lg"
              type="button"
            >
              Edit
            </button>
          </div>
        </div>

        {/* Right column */}
        <div className="flex-1 flex flex-col space-y-6">
          {/* Tabs Draft, Progress, Selesai */}
          <div className="bg-white rounded-xl shadow-lg p-3 flex space-x-6 text-lg font-semibold text-gray-700 select-none">
            <button className="text-black font-bold">Draft</button>
            <button>Progress</button>
            <button>Selesai</button>
          </div>
          {/* Draft cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 6 cards */}
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="relative">
                  <img
                    alt="Work desk with laptop showing code on screen and desk lamp in background"
                    className="w-full h-40 object-cover"
                    height="200"
                    src="https://storage.googleapis.com/a1aa/image/a62c6b65-5d08-41c0-6611-2a6bf572e83a.jpg"
                    width="400"
                  />
                  <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-semibold rounded px-2 py-0.5 select-none">
                    Diajukan
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-gray-600 text-sm">
                    <img
                      alt="Profile icon with initials IK"
                      className="rounded-full"
                      height="20"
                      src="https://storage.googleapis.com/a1aa/image/98c6bd82-45e3-4bd0-2890-522c45dfbcb4.jpg"
                      width="20"
                    />
                    <span>Ikhwan Kurniawan</span>
                  </div>
                  <p className="text-blue-500 text-sm leading-snug cursor-pointer hover:underline">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    E...
                  </p>
                  <p className="text-gray-700 text-sm">
                    Deadline : <span className="font-semibold">12 Days</span>
                  </p>
                  <p className="text-gray-700 text-sm">
                    Bid : <span className="font-semibold">Rp 1.200.000</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
          {/* Tabs Portofolio, Sertifikasi, Rating, Review */}
          <div className="bg-white rounded-xl shadow-lg p-3 flex space-x-6 text-lg font-semibold text-gray-700 select-none mt-6">
            <button className="text-black font-bold">Portofolio</button>
            <button>Sertifikasi</button>
            <button>Rating</button>
            <button>Review</button>
          </div>
          {/* Portfolio cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(1)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="relative">
                  <img
                    alt="Work desk with laptop showing code on screen and desk lamp in background"
                    className="w-full h-40 object-cover"
                    height="200"
                    src="https://storage.googleapis.com/a1aa/image/a62c6b65-5d08-41c0-6611-2a6bf572e83a.jpg"
                    width="400"
                  />
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold rounded px-2 py-0.5 select-none">
                    Selesai
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-gray-600 text-sm">
                    <img
                      alt="Profile icon with initials IK"
                      className="rounded-full"
                      height="20"
                      src="https://storage.googleapis.com/a1aa/image/98c6bd82-45e3-4bd0-2890-522c45dfbcb4.jpg"
                      width="20"
                    />
                    <span>Ikhwan Kurniawan</span>
                  </div>
                  <p className="text-blue-500 text-sm leading-snug cursor-pointer hover:underline">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    E...
                  </p>
                  <p className="text-gray-700 text-sm">
                    Deadline : <span className="font-semibold">12 Days</span>
                  </p>
                  <p className="text-gray-700 text-sm">
                    Bid : <span className="font-semibold">Rp 1.200.000</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
