import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../api/apiService";

export default function App() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/tenders/");
        console.log(response)
        setProjects(response.data.results || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch projects");
        setLoading(false);
        console.error("Error fetching projects:", err);
      }
    };

    fetchProjects();
  }, []);

  // Filter and search projects
  const filteredProjects = projects.filter(project => {
    const matchesFilter = filter === "all" || project.status.toLowerCase() === filter;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Pagination
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <header className="bg-white pt-20 relative overflow-hidden bg-gradient-to-br from-blue-400 to-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Temukan Proyek <span className="text-blue-600">Sesuai Keahlianmu</span>
            </h1>
            <p className="text-gray-100 text-lg max-w-lg mx-auto leading-relaxed font-medium">
              Proyek terbaru dari klien di seluruh dunia. Mulai bid sekarang dan tunjukkan keahlian profesionalmu.
            </p>
          </div>

          <div className="relative max-w-2xl mx-auto transition-all duration-300 hover:scale-[1.02]">
            <input
              type="text"
              placeholder="Cari proyek (mis: desain web, mobile app)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-4 px-5 pr-14 rounded-full bg-white border-2 border-gray-200 shadow-sm focus:shadow-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 text-gray-900 placeholder-gray-500 font-medium"
            />
            <button className="absolute right-3 top-3 p-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* Micro-interaction */}
          {searchTerm && (
            <div className="max-w-2xl mx-auto mt-2 text-right">
              <span className="text-sm text-gray-600 font-medium">{searchTerm.length}/50 karakter</span>
            </div>
          )}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-5xl mx-auto px-4 -mt-8 mb-20">
        {/* PROJECT GRID */}
        <section>
          {loading ? (
            // Loading skeleton for projects
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill().map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="bg-gray-200 h-32 w-full"></div>
                  <div className="p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="bg-gray-200 rounded-full w-6 h-6"></div>
                      <div className="bg-gray-200 h-4 w-24 rounded"></div>
                    </div>
                    <div className="bg-gray-200 h-5 w-3/4 rounded mb-3"></div>
                    <div className="bg-gray-200 h-4 w-full rounded mb-3"></div>
                    <div className="bg-gray-200 h-4 w-2/3 rounded mb-3"></div>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="bg-gray-200 h-5 w-24 rounded"></div>
                      <div className="bg-gray-200 h-8 w-20 rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          ) : currentProjects.length === 0 ? (
            <div className="bg-yellow-50 border mt-30 border-yellow-200 text-yellow-700 px-4 py-8 rounded-lg text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-lg font-medium">No projects found</p>
              <p className="mt-2 text-sm">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProjects.map((project) => (
                <Link
                  to={`/projects/${project.tender_id}`}
                  key={project.tender_id}
                  className="group"
                >
                  <article className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    {/* Status Tag */}
                    <div className="relative h-40 bg-gradient-to-r from-blue-400 to-indigo-500">
                      <span className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full z-10 
                        ${project.status.toLowerCase() === "open" ? "bg-green-500 text-white" :
                          project.status.toLowerCase() === "in_progress" ? "bg-yellow-500 text-white" :
                            project.status.toLowerCase() === "closed" ? "bg-red-500 text-white" :
                              project.status.toLowerCase() === "completed" ? "bg-blue-500 text-white" :
                                project.status.toLowerCase() === "in review" ? "bg-purple-500 text-white" :
                                  "bg-gray-500 text-white"}`}>
                        {project.status}
                      </span>

                      {project.attachment ? (
                        <img
                          src={project.attachment}
                          alt={project.title}
                          className="w-full h-40 object-cover"
                        />
                      ) : (
                        <div className="w-full h-40 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center space-x-2 mb-3">
                        <Link to={`/client/profile/${project.client}`}>
                          <img
                            src={`http://127.0.0.1:8000/${project.client_picture}` || "/default-avatar.png"}
                            alt={project.client_name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        </Link>
                        <span className="text-sm text-gray-600">
                          {project.client_name}
                        </span>
                      </div>

                      <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                        {project.title}
                      </h3>

                      <p className="text-sm text-gray-500 mb-4 flex-1">
                        {project.description ? (
                          <>
                            {project.description.slice(0, 100)}
                            {project.description.length > 100 ? "..." : ""}
                          </>
                        ) : (
                          "No description available"
                        )}
                      </p>

                      <div className="border-t border-gray-100 pt-4 mt-auto">
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-xs text-gray-500">Deadline</div>
                          <div className="text-sm font-medium">
                            {new Date(project.deadline).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="text-xs text-gray-500">Budget</div>
                          <div className="text-sm font-medium">
                            Rp {Number(project.min_budget).toLocaleString()} - {Number(project.max_budget).toLocaleString()}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-1">
                          {project.tags_data?.length > 0 ? (
                            project.tags_data.map(tag => (
                              <span
                                key={tag.id}
                                className="text-xs px-2 py-1 bg-blue-400 rounded-full text-white whitespace-nowrap"
                              >
                                {tag.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs px-2 py-1 bg-gray-200 rounded-full text-gray-500">
                              No tags
                            </span>
                          )}
                        </div>
                      </div>
                      

                      <button className="mt-4 w-full py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                        Bid Now
                      </button>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* PAGINATION */}
        {!loading && !error && filteredProjects.length > 0 && (
          <nav className="mt-12 flex justify-center items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-500 disabled:opacity-50 disabled:pointer-events-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }

              return (
                <button
                  key={i}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${currentPage === pageNumber
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-500 disabled:opacity-50 disabled:pointer-events-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </nav>
        )}
      </main>
    </div>
  );
}