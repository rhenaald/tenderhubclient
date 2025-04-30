import React from "react";

const DetailProjek = () => {
  return (
    <div>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <img
          src="https://storage.googleapis.com/a1aa/image/73708d62-8134-444d-cd22-4a13ce49512e.jpg"
          alt="Laptop with code editor open on screen"
          className="w-full mx-auto h-82 object-cover rounded-xl mb-6"
          loading="lazy"
        />

        <h1 className="text-blue-500 font-semibold text-lg sm:text-xl lg:text-2xl mb-4 leading-snug">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu
          turpis molestie, dictum est a, mattis tellus.
        </h1>
        <p className="mb-6 text-base sm:text-lg leading-relaxed text-gray-600">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu
          turpis molestie, dictum est a, mattis tellus...
        </p>
        <p className="mb-8 text-base sm:text-lg leading-relaxed text-gray-600">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. A veniam doloremque repellendus voluptas eveniet nesciunt corporis fugit, est deleniti incidunt eligendi velit facere perspiciatis iusto non eius sed quae facilis beatae assumenda consectetur unde doloribus debitis delectus! Natus minima numquam porro nobis commodi! Reiciendis quia ea autem accusantium repellendus quo!
        </p>

        <section className="bg-gray-200 rounded-xl p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-sm sm:text-base text-gray-700">
          {/* Info Proyek */}
          <div className="space-y-2">
            {/* Status */}
            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">Status</span>
              <button
                type="button"
                className="bg-blue-400 text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded"
              >
                Open
              </button>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">
                Tanggal pembuatan
              </span>
              <span className="font-semibold text-gray-900">24 April 2025</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">
                Jumlah Hari Pengerjaan
              </span>
              <span className="font-semibold text-gray-900">5 Hari</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">
                Penawaran teratas
              </span>
              <a
                href="#"
                className="text-blue-500 font-semibold hover:underline"
              >
                Ikhwan Kurniawan
              </a>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">Jumlah bid</span>
              <span className="font-semibold text-gray-900">99 Bid</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">
                Tanggal deadline
              </span>
              <span className="font-semibold text-gray-900">29 April 2025</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">Rentan Harga</span>
              <span className="font-semibold text-gray-900">
                Rp 500.000 - Rp 1.000.000
              </span>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-blue-400 font-semibold text-lg mb-3">Owner</h2>
            <div className="flex items-center space-x-3">
              <img
                src="https://storage.googleapis.com/a1aa/image/93ef8e84-641e-46a3-d5cb-3531484a6883.jpg"
                alt="Ikhwan Kurniawan"
                className="w-12 h-12 rounded-lg object-cover"
                width={48}
                height={48}
                loading="lazy"
              />
              <div>
                <p className="font-semibold text-gray-900">Ikhwan Kurniawan</p>
                <p className="text-gray-600 font-semibold text-sm">Jakarta</p>
              </div>
            </div>
          </div>

          <form className="space-y-3" aria-label="Place a bid form">
            <h2 className="text-blue-400 font-semibold text-lg">Place Bid</h2>
            <input
              type="text"
              placeholder="Masukan Bid"
              className="w-full rounded-full bg-gray-200 text-gray-600 text-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Masukan Bid"
            />
            <button
              type="submit"
              className="inline-flex items-center space-x-2 bg-blue-400 text-white text-sm font-semibold rounded-full px-4 py-2 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <i className="fas fa-paper-plane" />
              <span>Place New Bid</span>
            </button>
          </form>
        </section>

        <section aria-label="User Bids" className="mb-12">
          <h3 className="text-blue-400 font-semibold text-lg mb-4">
            User Bids
          </h3>
          <ul className="space-y-6">
            {[
              {
                name: "Rey",
                bid: "Rp 99.000",
                img: "https://storage.googleapis.com/a1aa/image/d479ff06-d7bc-4ac5-0081-a9f992610fa8.jpg",
              },
              {
                name: "Amel",
                bid: "Rp 89.000",
                img: "https://storage.googleapis.com/a1aa/image/431f6bc9-542c-4be0-932d-b2298bd50c9d.jpg",
              },
              {
                name: "Amel",
                bid: "Rp 79.000",
                img: "https://storage.googleapis.com/a1aa/image/431f6bc9-542c-4be0-932d-b2298bd50c9d.jpg",
              },
            ].map((user, index) => (
              <li key={index} className="flex items-center space-x-4">
                <img
                  src={user.img}
                  alt={`Profile of ${user.name}`}
                  className="w-12 h-12 rounded-full object-cover"
                  width={48}
                  height={48}
                  loading="lazy"
                />
                <div>
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <p className="text-gray-600 font-semibold text-sm">
                    {user.bid}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default DetailProjek;
