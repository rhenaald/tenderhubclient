import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { apiClient } from "../api/apiService";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [similarProjects, setSimilarProjects] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(true);

  // Comment state
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [commentLoading, setCommentLoading] = useState(false);

  // Bid state
  const [bidAmount, setBidAmount] = useState("");
  const [proposal, setProposal] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [bidLoading, setBidLoading] = useState(false);
  const [bidSuccess, setBidSuccess] = useState(false);
  const [bidError, setBidError] = useState(null);

  useEffect(() => {
    const fetchProjectDetail = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/tenders/${id}/`);
        setProject(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch project details");
        setLoading(false);
        console.error("Error fetching project details:", err);
      }
    };

    const fetchSimilarProjects = async () => {
      try {
        setSimilarLoading(true);
        // Assuming your API supports fetching similar projects by category
        // If you have the project data already, you could use its category ID
        const response = await apiClient.get(`/tenders/?limit=3`);
        setSimilarProjects(response.data.results || []);
        setSimilarLoading(false);
      } catch (err) {
        console.error("Error fetching similar projects:", err);
        setSimilarLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        // Assuming there's an endpoint to fetch comments
        const response = await apiClient.get(`/tenders/${id}/comments/`);
        setComments(response.data || []);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    if (id) {
      fetchProjectDetail();
      fetchSimilarProjects();
      fetchComments();
    }
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Add comment function
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setCommentLoading(true);
    try {
      const response = await apiClient.post(`/tenders/${id}/add_comment/`, {
        content: comment
      });

      // Add the new comment to the comments list
      setComments([...comments, response.data]);
      setComment(""); // Clear the input
      setCommentLoading(false);
    } catch (err) {
      console.error("Error adding comment:", err);
      setCommentLoading(false);
    }
  };

  // Place bid function
  const handlePlaceBid = async (e) => {
    e.preventDefault();

    if (!bidAmount || !proposal || !deliveryTime) {
      setBidError("Please fill in all bid fields");
      return;
    }

    setBidLoading(true);
    setBidError(null);

    try {
      await apiClient.post(`/tenders/${id}/place_bid/`, {
        amount: Number(bidAmount),
        proposal: proposal,
        delivery_time: Number(deliveryTime)
      });

      setBidSuccess(true);
      setBidLoading(false);

      // Reset form
      setBidAmount("");
      setProposal("");
      setDeliveryTime("");

      // After 3 seconds, hide success message
      setTimeout(() => {
        setBidSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Error placing bid:", err);
      setBidError(err.response?.data?.message || "Failed to place bid. Please try again.");
      setBidLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 animate-pulse">
          <div className="bg-gray-300 h-8 w-2/3 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-gray-300 h-64 w-full rounded-xl mb-6"></div>
              <div className="space-y-4">
                <div className="bg-gray-300 h-6 w-full rounded"></div>
                <div className="bg-gray-300 h-6 w-5/6 rounded"></div>
                <div className="bg-gray-300 h-6 w-4/6 rounded"></div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-xl p-6 h-96"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-md">
          Project not found.
        </div>
      </div>
    );
  }

  return (
    <>
      {/* BREADCRUMB */}
      <div className="bg-gray-100 py-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <nav className="text-sm">
            <Link to="/" className="text-[#5B8CFF] hover:underline">
              Home
            </Link>{" "}
            /{" "}
            <Link to="/" className="text-[#5B8CFF] hover:underline">
              Projects
            </Link>{" "}
            / <span className="text-gray-600">{project.title}</span>
          </nav>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          {/* PROJECT STATUS */}
          <div className="mb-6">
            <span className="bg-green-500 text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-full">
              {project.status}
            </span>
          </div>

          <h1 className="font-extrabold text-2xl sm:text-3xl mb-3 text-[#5B8CFF]">
            {project.title}
          </h1>

          {/* CREATION DATE - Now below title */}
          <div className="mb-6 text-gray-600 text-sm">
            Posted on {formatDate(project.created_at)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* LEFT COLUMN - PROJECT DETAILS */}
            <div className="md:col-span-2">
              {/* PROJECT IMAGE */}
              <div className="bg-gradient-to-r from-[#5B8CFF] to-[#7DA7FF] rounded-xl h-64 mb-6 flex items-center justify-center">
                {project.attachment ? (
                  <img
                    src={project.attachment}
                    alt={project.title}
                    className="w-full h-64 object-cover rounded-xl"
                  />
                ) : (
                  <i className="fas fa-briefcase text-white text-5xl"></i>
                )}
              </div>

              {/* CLIENT INFO */}
              <div className="flex items-center space-x-3 mb-6 bg-gray-50 p-4 rounded-xl">
                <img
                  src={`http://127.0.0.1:8000${project.client_picture}`}
                  alt={project.client_name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {project.client_name}
                  </h3>
                  <p className="text-sm text-gray-600">Project Owner</p>
                </div>
              </div>

              {/* PROJECT DESCRIPTION */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Project Description
                </h2>
                <div className="prose max-w-none text-gray-700">
                  <p>{project.description || "No description available."}</p>
                </div>
              </div>

              {/* PROJECT REQUIREMENTS - Display only if available */}
              {project.requirements && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Requirements
                  </h2>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    {project.requirements
                      .split("\n")
                      .filter((req) => req.trim() !== "")
                      .map((req, index) => <li key={index}>{req}</li>)}
                  </ul>
                </div>
              )}

              {/* PROJECT DURATION */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Project Duration
                </h2>
                <p className="text-gray-700">
                  {project.max_duration} days maximum
                </p>
              </div>

              {/* COMMENTS SECTION */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Comments
                </h2>

                {/* Comments List */}
                <div className="space-y-4 mb-6">
                  {comments.length > 0 ? (
                    comments.map((comment, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-xl">
                        <div className="flex items-center mb-2">
                          <img
                            src={comment.user_avatar || "https://via.placeholder.com/40"}
                            alt={comment.user_name}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <div>
                            <p className="font-semibold text-sm">{comment.user_name}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(comment.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm">{comment.content}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No comments yet. Be the first to comment!</p>
                  )}
                </div>

                {/* Add Comment Form */}
                <form onSubmit={handleAddComment}>
                  <div className="flex flex-col space-y-2">
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B8CFF] resize-none"
                      rows="3"
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                    ></textarea>
                    <div className="text-right">
                      <button
                        type="submit"
                        className="bg-[#5B8CFF] text-white px-4 py-2 rounded-xl font-medium hover:bg-[#4A7AE5] transition duration-300 disabled:opacity-50"
                        disabled={commentLoading || !comment.trim()}
                      >
                        {commentLoading ? "Posting..." : "Post Comment"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* BID FORM SECTION */}
              <div className="mb-8 bg-gray-50 p-6 rounded-xl">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Place Your Bid
                </h2>

                {bidSuccess && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-4">
                    Your bid has been successfully submitted!
                  </div>
                )}

                {bidError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
                    {bidError}
                  </div>
                )}

                <form onSubmit={handlePlaceBid}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="bidAmount" className="block text-gray-700 font-medium mb-1">
                        Your Bid Amount (Rp)
                      </label>
                      <input
                        type="number"
                        id="bidAmount"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B8CFF]"
                        placeholder="Enter your bid amount"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        min={project.min_budget}
                        max={project.max_budget}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Budget Range: Rp {Number(project.min_budget).toLocaleString()} - Rp {Number(project.max_budget).toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <label htmlFor="deliveryTime" className="block text-gray-700 font-medium mb-1">
                        Delivery Time (Days)
                      </label>
                      <input
                        type="number"
                        id="deliveryTime"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B8CFF]"
                        placeholder="Enter delivery time in days"
                        value={deliveryTime}
                        onChange={(e) => setDeliveryTime(e.target.value)}
                        min="1"
                        max={project.max_duration}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Maximum allowed: {project.max_duration} days
                      </p>
                    </div>

                    <div>
                      <label htmlFor="proposal" className="block text-gray-700 font-medium mb-1">
                        Your Proposal
                      </label>
                      <textarea
                        id="proposal"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B8CFF] resize-none"
                        rows="5"
                        placeholder="Describe why you're the best fit for this project"
                        value={proposal}
                        onChange={(e) => setProposal(e.target.value)}
                        required
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#5B8CFF] to-[#7DA7FF] text-white py-3 rounded-xl font-bold hover:shadow-lg transition duration-300 disabled:opacity-50"
                      disabled={bidLoading}
                    >
                      {bidLoading ? "Submitting..." : "Submit Bid"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* RIGHT COLUMN - APPLICATION BOX */}
            <div className="bg-gray-50 rounded-xl p-6 h-fit sticky top-8">
              <h3 className="font-bold text-lg text-gray-800 mb-4">
                Project Details
              </h3>

              {/* BUDGET */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-gray-600 text-sm mb-1">Budget</p>
                <p className="font-bold text-gray-800">
                  Rp {Number(project.min_budget).toLocaleString()} - Rp{" "}
                  {Number(project.max_budget).toLocaleString()}
                </p>
              </div>

              {/* DEADLINE */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-gray-600 text-sm mb-1">Deadline</p>
                <p className="font-bold text-gray-800">
                  {formatDate(project.deadline)}
                </p>
              </div>

              {/* CATEGORY */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-gray-600 text-sm mb-1">Category</p>
                <div className="mt-1">
                  {project.category && (
                    <span className="bg-[#5B8CFF] text-white text-xs font-medium rounded-full py-1 px-3">
                      {project.category.name}
                    </span>
                  )}
                </div>
              </div>

              {/* TAGS */}
              {project.tags && project.tags.length > 0 && (
                <div className="mb-6 pb-4 border-b border-gray-200">
                  <p className="text-gray-600 text-sm mb-1">Tags</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {project.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-200 text-gray-700 text-xs font-medium rounded-full py-1 px-3"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* APPLY BUTTON */}
              <button className="w-full bg-gradient-to-r from-[#5B8CFF] to-[#7DA7FF] text-white py-3 rounded-xl font-bold hover:shadow-lg transition duration-300">
                Apply Now
              </button>

              {/* SAVE PROJECT */}
              <button className="w-full mt-3 border-2 border-[#5B8CFF] text-[#5B8CFF] py-3 rounded-xl font-bold hover:bg-gray-100 transition duration-300 flex items-center justify-center">
                <i className="far fa-bookmark mr-2"></i>
                Save Project
              </button>
            </div>
          </div>
        </div>

        {/* SIMILAR PROJECTS */}
        <section className="mt-12">
          <h2 className="font-extrabold text-xl mb-6 text-[#5B8CFF]">
            Similar Projects
          </h2>

          {similarLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {Array(3)
                .fill()
                .map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse"
                  >
                    <div className="bg-gray-300 h-36 w-full"></div>
                    <div className="p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="bg-gray-300 rounded-full w-6 h-6"></div>
                        <div className="bg-gray-300 h-4 w-24 rounded"></div>
                      </div>
                      <div className="bg-gray-300 h-4 w-full rounded mb-2"></div>
                      <div className="bg-gray-300 h-4 w-3/4 rounded mb-2"></div>
                      <div className="mt-4">
                        <div className="bg-gray-300 h-6 w-20 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : similarProjects.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-md">
              No similar projects available at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {similarProjects.map((project) => (
                <Link to={`/projects/${project.tender_id}`} key={project.tender_id}>
                  <article className="relative bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition duration-300">
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
                          src={`http://127.0.0.1:8000${project.client_picture}`}
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
                        Budget:{" "}
                        <span className="font-semibold">
                          Rp {Number(project.min_budget).toLocaleString()} - Rp{" "}
                          {Number(project.max_budget).toLocaleString()}
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
    </>
  );
}