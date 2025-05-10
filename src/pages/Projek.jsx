import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../api/apiService";

export default function App() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryError, setCategoryError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/tenders/");
        console.log("Projects response:", response.data);
        setProjects(response.data.results || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch projects");
        setLoading(false);
        console.error("Error fetching projects:", err);
      }
    };

    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await apiClient.get("/categories/");
        // Make sure we're dealing with an array of categories
        const categoriesData = response.data.results || response.data || [];
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setCategoriesLoading(false);
      } catch (err) {
        setCategoryError("Failed to fetch categories");
        setCategoriesLoading(false);
        console.error("Error fetching categories:", err);
      }
    };

    fetchProjects();
    fetchCategories();
  }, []);

  const defaultCategoryNames = ["Kategori1", "Kategori2", "Kategori3", "Kategori4"];

  const getCategoryNames = () => {
    if (categoriesLoading || categoryError || !Array.isArray(categories) || categories.length === 0) {
      return defaultCategoryNames;
    }
    return categories.map(cat => cat.name || "Unknown Category");
  };

  // Get 4 popular categories safely
  const getPopularCategories = () => {
    if (categoriesLoading || categoryError || !Array.isArray(categories) || categories.length === 0) {
      return defaultCategoryNames.map((name, index) => ({ id: index, name }));
    }
    return categories.slice(0, Math.min(4, categories.length));
  };

  // Get all categories safely
  const getAllCategories = () => {
    if (categoriesLoading || categoryError || !Array.isArray(categories) || categories.length === 0) {
      return defaultCategoryNames.map((name, index) => ({ id: index, name }));
    }
    return categories;
  };

  // Get popular categories for display
  const popularCategories = getPopularCategories();

  // Get all categories for sidebar
  const allCategories = getAllCategories();

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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full max-w-4xl justify-center mx-auto">
            {categoriesLoading ? (
              // Loading skeleton for categories
              Array(4).fill().map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-200 animate-pulse rounded-xl p-6 flex flex-col items-center"
                >
                  <div className="bg-gray-300 rounded-md w-16 h-16 mb-3"></div>
                  <div className="bg-gray-300 h-4 w-24 rounded"></div>
                </div>
              ))
            ) : (
              // Dynamic or fallback categories
              popularCategories.map((cat, i) => (
                <div
                  key={`popular-${cat.id || i}`}
                  className="bg-[#5B8CFF] rounded-xl p-6 flex flex-col items-center text-white text-center cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <div className="bg-[#7DA7FF] rounded-md w-16 h-16 flex items-center justify-center mb-3">
                    <i className="fas fa-code text-white text-2xl"></i>
                  </div>
                  <span className="text-sm sm:text-base font-normal leading-snug">
                    {cat.name}
                  </span>
                </div>
              ))
            )}
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
            {categoriesLoading ? (
              // Loading skeleton for sidebar categories
              Array(4).fill().map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-200 animate-pulse rounded-lg py-2 px-4 mb-2 h-8"
                ></div>
              ))
            ) : (
              // Dynamic or fallback categories for sidebar
              allCategories.map((cat, i) => (
                <div
                  key={`sidebar-${cat.id || i}`}
                  className="cursor-pointer transform transition-all duration-300 hover:bg-[#5B8CFF] hover:text-white rounded-lg py-2 px-4 hover:shadow-md text-center bg-white sm:bg-transparent mb-2"
                >
                  {cat.name}
                </div>
              ))
            )}
          </div>
        </aside>

        {/* PROJECT GRID */}
        <section className="flex-1">
          {loading ? (
            // Loading skeleton for projects
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {Array(6).fill().map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                  <div className="bg-gray-300 h-36 w-full"></div>
                  <div className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="bg-gray-300 rounded-full w-6 h-6"></div>
                      <div className="bg-gray-300 h-4 w-24 rounded"></div>
                    </div>
                    <div className="bg-gray-300 h-4 w-full rounded mb-2"></div>
                    <div className="bg-gray-300 h-4 w-3/4 rounded mb-2"></div>
                    <div className="bg-gray-300 h-4 w-1/2 rounded mb-2"></div>
                    <div className="bg-gray-300 h-4 w-2/3 rounded mb-2"></div>
                    <div className="mt-4">
                      <div className="bg-gray-300 h-6 w-20 rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          ) : projects.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-md">
              No projects available at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Link
                  to={`/projects/${project.tender_id}`}
                  key={project.tender_id}
                  className="block group"
                >
                  <article
                    className="relative bg-white rounded-xl shadow-md overflow-hidden cursor-pointer group-hover:shadow-lg transition-shadow duration-300"
                  >
                    {/* Status Tag */}
                    <span className="absolute top-2 right-2 bg-green-500 text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-full z-10 shadow">
                      {project.status}
                    </span>

                    {/* Project Image */}
                    <div className="bg-gradient-to-r from-[#5B8CFF] to-[#7DA7FF] h-36">
                      {project.attachment ? (
                        <img
                          src={project.attachment}
                          alt={project.title}
                          className="w-full h-36 object-cover"
                        />
                      ) : (
                        <div className="w-full h-36 flex items-center justify-center">
                          <i className="fas fa-briefcase text-white text-3xl"></i>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <img
                          src={`http://127.0.0.1:8000/${project.client_picture}` || "/default-avatar.png"}
                          alt={project.client_name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-xs sm:text-sm text-gray-700 font-semibold">
                          {project.client_name}
                        </span>
                      </div>

                      <h3 className="text-[#5B8CFF] text-xs sm:text-sm font-normal leading-snug line-clamp-2">
                        {project.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-gray-700 mt-2">
                        {project.description ? (
                          <>
                            {project.description.slice(0, 60)}
                            {project.description.length > 60 ? "..." : ""}
                          </>
                        ) : (
                          "No description available"
                        )}
                      </p>

                      <p className="text-xs sm:text-sm text-gray-700 mt-2">
                        Deadline: <span className="font-semibold">{new Date(project.deadline).toLocaleDateString()}</span>
                      </p>

                      <p className="text-xs sm:text-sm text-gray-700">
                        Budget: <span className="font-semibold">
                          Rp {Number(project.min_budget).toLocaleString()} - Rp {Number(project.max_budget).toLocaleString()}
                        </span>
                      </p>

                      {/* CATEGORY TAGS */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.category && (
                          <span className="bg-[#5B8CFF] text-white text-xs sm:text-sm font-medium rounded-full py-1 px-3">
                            {project.category.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
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