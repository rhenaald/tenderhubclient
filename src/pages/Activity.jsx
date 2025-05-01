import React, { useEffect } from "react";

// Activity item component for better code organization
const ActivityItem = ({ date, title, users, images = [] }) => {
  async function pagedata() {
    const response = await fetch("http://127.0.0.1:8000/api/v1/users/vendors/");

    const data = await response.json();

    console.log(data);
  }
  useEffect(() => {
    pagedata();
  }, []);

  return (
    <article className="mb-6">
      {date && (
        <div className="inline-block bg-gray-400 text-white text-xs px-3 py-1 rounded mb-1 select-none">
          {date}
        </div>
      )}
      {title && (
        <h3>
          <a
            className="text-blue-500 font-semibold text-base leading-tight hover:underline"
            href="#"
          >
            {title}
          </a>
        </h3>
      )}
      {users.map((user, index) => (
        <div key={`user-${index}`}>
          <div className="flex items-center mt-2 mb-1">
            <img
              alt={user.alt}
              className="w-6 h-6 rounded-full mr-2"
              height="24"
              src={user.src}
              width="24"
            />
            <span className="font-semibold text-gray-900 text-sm">
              {user.name}
            </span>
          </div>
          <p className="text-sm leading-relaxed mb-3">{user.comment}</p>
        </div>
      ))}

      {images.length > 0 && (
        <div className="flex space-x-3">
          {images.map((image, index) => (
            <img
              key={`image-${index}`}
              alt={image.alt}
              className="w-40 h-20 object-cover rounded"
              height="80"
              src={image.src}
              width="160"
            />
          ))}
        </div>
      )}
    </article>
  );
};

// Project detail component
const ProjectDetails = ({ project }) => {
  return (
    <aside className="w-full md:w-80 bg-white rounded-xl shadow-md p-4 text-gray-700 select-none h-fit">
      <h3 className="font-bold text-base mb-3">Detail Project</h3>
      <div className="flex space-x-3 mb-3">
        <img
          alt={project.image.alt}
          className="w-20 h-15 object-cover rounded"
          src={project.image.src}
        />
        <p className="text-sm leading-relaxed text-gray-600">
          {project.description}
        </p>
      </div>
      <dl className="text-sm space-y-2 mb-3">
        {project.details.map((detail, index) => (
          <div
            key={`detail-${index}`}
            className={`flex justify-between ${
              index === project.details.length - 1
                ? "border-b border-gray-300 pb-2"
                : ""
            }`}
          >
            <dt className="text-gray-500">{detail.label}</dt>
            <dd className="font-semibold text-gray-900">{detail.value}</dd>
          </div>
        ))}
      </dl>
      <div>
        <p className="font-semibold mb-1">Track Project</p>
        <ul className="space-y-1 text-sm">
          {project.trackItems.map((item, index) => (
            <li key={`track-${index}`} className="flex items-center space-x-2">
              <span
                className={`w-5 h-5 rounded-full ${
                  item.completed ? "bg-blue-400" : "bg-gray-400"
                } flex items-center justify-center text-white text-xs`}
              >
                <i
                  className={`fas ${item.completed ? "fa-check" : "fa-times"}`}
                ></i>
              </span>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

// Comment form component
const CommentForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-3 mt-4 max-w-xl">
      <input
        className="flex-1 rounded-md bg-gray-200 text-gray-700 px-4 py-3 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Tambahkan Komentar"
        type="text"
        aria-label="Add a comment"
      />
      <button
        aria-label="Attach file"
        className="bg-gray-300 rounded-md px-4 py-3 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-400 transition-colors"
        type="button"
      >
        <i className="fas fa-paperclip text-lg"></i>
      </button>
      <button
        type="submit"
        className="bg-blue-500 text-white rounded-md px-4 py-3 hover:bg-blue-600 transition-colors"
        aria-label="Submit comment"
      >
        Send
      </button>
    </form>
  );
};

const ActivityPage = () => {
  // Mock data for activities
  const activities = [
    {
      date: "24 April 2025",
      title: "Ikhwan Kurniawan Menerima tawaran Order",
      users: [
        {
          name: "Ikhwan Kurniawan",
          src: "https://storage.googleapis.com/a1aa/image/b3102c65-3eb1-45ca-afe1-c13c14b40fc5.jpg",
          alt: "Profile picture of Ikhwan Kurniawan, male with short black hair",
          comment: "Lorem Ipsum dolor sit ametasasasasasasasasasasas",
        },
      ],
      images: [],
    },
    {
      date: "25 April 2025",
      title: "Pandu Dwi Memulai Project",
      users: [
        {
          name: "Pandu Dwi",
          src: "https://storage.googleapis.com/a1aa/image/112be151-1bbc-42d2-d4c1-adf0b8380a3f.jpg",
          alt: "Profile picture of Pandu Dwi, male with curly hair and beard",
          comment: "Lorem Ipsum dolor sit ametasasasasasasasasasasas",
        },
        {
          name: "Ikhwan Kurniawan",
          src: "https://storage.googleapis.com/a1aa/image/b3102c65-3eb1-45ca-afe1-c13c14b40fc5.jpg",
          alt: "Profile picture of Ikhwan Kurniawan, male with short black hair",
          comment: "Lorem Ipsum dolor sit ametasasasasasasasasasasas",
        },
      ],
      images: [],
    },
    {
      date: "28 April 2025",
      title: "Pandu Dwi Mengirimkan Project",
      users: [
        {
          name: "Pandu Dwi",
          src: "https://storage.googleapis.com/a1aa/image/112be151-1bbc-42d2-d4c1-adf0b8380a3f.jpg",
          alt: "Profile picture of Pandu Dwi, male with curly hair and beard",
          comment: "Lorem Ipsum dolor sit ametasasasasasasasasasasas",
        },
      ],
      images: [
        {
          src: "https://storage.googleapis.com/a1aa/image/a7fbc20a-bc46-4cdb-db44-6e9cbad8a5c2.jpg",
          alt: "Photo of a laptop on a desk showing code on screen with a white cup and a plant in background",
        },
        {
          src: "https://storage.googleapis.com/a1aa/image/a7fbc20a-bc46-4cdb-db44-6e9cbad8a5c2.jpg",
          alt: "Photo of a laptop on a desk showing code on screen with a white cup and a plant in background",
        },
      ],
    },
    {
      date: "28 April 2025",
      title: null,
      users: [
        {
          name: "Ikhwan Kurniawan",
          src: "https://storage.googleapis.com/a1aa/image/b3102c65-3eb1-45ca-afe1-c13c14b40fc5.jpg",
          alt: "Profile picture of Ikhwan Kurniawan, male with short black hair",
          comment: "Lorem Ipsum dolor sit ametasasasasasasasasasasas",
        },
      ],
      linkText: "Order Selesai",
    },
  ];

  // Mock data for project details
  const projectDetails = {
    image: {
      src: "https://storage.googleapis.com/a1aa/image/a7fbc20a-bc46-4cdb-db44-6e9cbad8a5c2.jpg",
      alt: "Photo of a laptop on a desk showing code on screen with a white cup and a plant in background",
    },
    description: "Lorem Ipsum dolor sit ametasasasasasasasasasasas",
    details: [
      { label: "Project ID", value: "#1212121213dad" },
      { label: "Client", value: "Ikhwan Kurniawan" },
      { label: "Vendor", value: "Pandu Dwi" },
      { label: "Tanggal order", value: "30 Agustus 2025" },
      { label: "Tanggal Deadline", value: "10 September 2025" },
      { label: "Harga", value: "Rp. 300.000" },
    ],
    trackItems: [
      { label: "Project diambil", completed: true },
      { label: "Project Selesai", completed: false },
    ],
  };

  return (
    <main className="max-w-5xl mx-auto px-5 my-24 flex flex-col md:flex-row md:space-x-10 space-y-10 md:space-y-0">
      {/* Left Activity Section */}
      <section className="flex-1">
        <h2 className="font-bold text-base mb-4">Activity</h2>

        {/* Activity items */}
        {activities.map((activity, index) => (
          <React.Fragment key={`activity-${index}`}>
            <ActivityItem
              date={activity.date}
              title={activity.title}
              users={activity.users}
              images={activity.images}
            />
            {activity.linkText && (
              <a
                className="text-blue-500 font-semibold text-base leading-tight hover:underline block mb-6"
                href="#"
              >
                {activity.linkText}
              </a>
            )}
          </React.Fragment>
        ))}

        {/* Comment input */}
        <CommentForm />
      </section>

      {/* Right Detail Project Section */}
      <ProjectDetails project={projectDetails} />
    </main>
  );
};

export default ActivityPage;
