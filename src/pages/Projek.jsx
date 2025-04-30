export default function App() {
  const projects = Array(9).fill({
    imgSrc:
      "https://storage.googleapis.com/a1aa/image/8364595c-28e9-4e33-671f-c7edb25fba5e.jpg",
    imgAlt: "Laptop on desk",
    profileSrc:
      "https://storage.googleapis.com/a1aa/image/3b34f385-2d6c-4870-ca05-e9bac2238d69.jpg",
    profileAlt: "Profile picture",
    name: "Ikhwan Kurniawan",
    description: "Jorem ipsum dolor sit amet, consectetur adipiscing elit...",
    deadline: "12 Days",
    price: "Rp 1.200.000",
    categories: ["Kategori1", "Kategori2"], // Menambahkan kategori di proyek
  });

  const categories = [1, 2, 3, 4];
  const categoryList = ["Kategori1", "Kategori2", "Kategori3", "Kategori4"];

  return (
    <>
      {/* HEADER */}
      <header className="bg-gradient-to-r from-[#5B8CFF] to-[#7DA7FF] sm:p-10 p-6">
        <div className="max-w-3xl mx-auto my-24 text-center text-white px-4 sm:px-0">
          <h1 className="font-extrabold text-2xl sm:text-3xl leading-tight">
            Temukan Proyek Sesuai
            <br />
            Keahlianmu
          </h1>
          <form className="mt-6">
            <label htmlFor="search" className="sr-only">
              Search Here
            </label>
            <div className="relative flex items-center">
              <i className="fas fa-search text-gray-400 text-sm sm:text-base absolute left-4"></i>
              <input
                id="search"
                name="search"
                type="search"
                placeholder="Search Here..."
                className="w-full rounded-full py-3 pl-12 bg-white pr-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#5B8CFF] text-sm sm:text-base"
              />
            </div>
          </form>

          <p className="mt-3 text-md sm:text-sm text-white/90 max-w-md mx-auto">
            Proyek terbaru dari klien di seluruh dunia. Mulai bid sekarang dan
            tunjukkan keahlianmu.
          </p>
        </div>
      </header>

      {/* POPULAR CATEGORIES */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-10 sm:-mt-16">
        <div className="bg-white rounded-2xl shadow-lg py-6 sm:py-8 px-4 sm:px-8">
          <h2 className="w-full text-center font-extrabold text-lg sm:text-xl mb-4 text-black">
            Popular Categories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full max-w-4xl justify-center">
            {categories.map((cat, i) => (
              <div
                key={i}
                className="bg-[#5B8CFF] rounded-xl p-6 flex flex-col items-center text-white text-center cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <div className="bg-[#7DA7FF] rounded-md w-16 h-16 flex items-center justify-center mb-3">
                  <i className="fas fa-code text-white text-2xl"></i>
                </div>
                <span className="text-sm sm:text-base font-normal leading-snug">
                  {categoryList[i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 mt-10 sm:mt-14 mb-20 flex flex-col sm:flex-row gap-6">
        {/* CATEGORY LIST */}
        <aside className="flex-shrink-0 w-full sm:w-48">
          <h3 className="text-[#5B8CFF] font-extrabold text-lg sm:text-xl mb-4">
            Categories
          </h3>
          <div className="grid grid-cols-2 sm:block gap-3 sm:gap-0">
            {categoryList.map((cat, i) => (
              <div
                key={i}
                className="cursor-pointer transform transition-all duration-300 hover:bg-[#5B8CFF] hover:text-white rounded-lg py-2 px-4 hover:shadow-md text-center bg-white sm:bg-transparent"
              >
                {cat}
              </div>
            ))}
          </div>
        </aside>

        {/* PROJECT GRID */}
        <section className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <article
            key={i}
            className="relative bg-white rounded-xl shadow-md overflow-hidden cursor-pointer"
          >
            {/* Status Tag */}
            <span className="absolute top-2 right-2 bg-green-500 text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-full z-10 shadow">
              Open
            </span>
          
            <img
              src={project.imgSrc}
              alt={project.imgAlt}
              className="w-full h-36 object-cover"
            />
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <img
                  src={project.profileSrc}
                  alt={project.profileAlt}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="text-xs sm:text-sm text-gray-700 font-semibold">
                  {project.name}
                </span>
              </div>
              <p className="text-[#5B8CFF] text-xs sm:text-sm font-normal leading-snug line-clamp-2">
                {project.description}
              </p>
              <p className="text-xs sm:text-sm text-gray-700 mt-2">
                Deadline : <span className="font-semibold">{project.deadline}</span>
              </p>
              <p className="text-xs sm:text-sm text-gray-700">
                From : <span className="font-semibold">{project.price}</span>
              </p>
          
              {/* CATEGORY TAGS */}
              <div className="mt-4 flex flex-wrap gap-2">
                {project.categories.map((category, index) => (
                  <span
                    key={index}
                    className="bg-[#5B8CFF] text-white text-xs sm:text-sm font-medium rounded-full py-1 px-3"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </article>
          
          ))}
        </section>
      </main>

      {/* PAGINATION */}
      <nav className="max-w-5xl mx-auto px-4 sm:px-6 mb-20 flex justify-center items-center space-x-4">
        <button className="w-10 h-10 rounded-full border-2 border-[#5B8CFF] text-[#5B8CFF] flex items-center justify-center text-lg">
          <i className="fas fa-chevron-left"></i>
        </button>
        <button className="w-10 h-10 rounded-full bg-[#5B8CFF] text-white font-semibold">
          1
        </button>
        <button className="w-10 h-10 rounded-full border-2 border-[#5B8CFF] text-black font-semibold">
          2
        </button>
        <button className="w-10 h-10 rounded-full border-2 border-[#5B8CFF] text-black font-semibold">
          ...
        </button>
        <button className="w-10 h-10 rounded-full border-2 border-[#5B8CFF] text-black font-semibold">
          99
        </button>
        <button className="w-10 h-10 rounded-full border-2 border-[#5B8CFF] text-[#5B8CFF] flex items-center justify-center text-lg">
          <i className="fas fa-chevron-right"></i>
        </button>
      </nav>
    </>
  );
}
