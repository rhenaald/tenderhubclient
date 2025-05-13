import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { apiClient } from "../api/apiService";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const [similarProjects, setSimilarProjects] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const [bidAmount, setBidAmount] = useState("");
  const [proposal, setProposal] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [bidSuccess, setBidSuccess] = useState(false);
  const [bidError, setBidError] = useState(null);
  const [userBids, setUserBids] = useState([]);
  const [isLoadingBids, setIsLoadingBids] = useState(false);

  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [commentSuccess, setCommentSuccess] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  const commentSectionRef = useRef(null);

  console.log("Project ID:", comments);
  
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user_data'));
    setCurrentUser(userData);

    const fetchProjectDetail = async () => {
      try {
        const response = await apiClient.get(`/tenders/${id}/`);
        setProject(response.data);
      } catch (err) {
        setError("Failed to fetch project details");
      }
    };

    const fetchSimilarProjects = async () => {
      try {
        const response = await apiClient.get(`/tenders/?limit=3`);
        setSimilarProjects(response.data.results || []);
      } catch (err) { }
    };

    const fetchComments = async () => {
      setIsLoadingComments(true);
      try {
        // Fetch comments
        const commentsResponse = await apiClient.get(`/comments/?tender_id=${id}`);
        let commentsData = commentsResponse.data.results || commentsResponse.data;
        if (!Array.isArray(commentsData)) {
          commentsData = [];
        }

        // Fetch vendors data
        const vendorsResponse = await apiClient.get('/users/vendors/');
        const vendorsData = vendorsResponse.data.results || vendorsResponse.data;
        console.log("Vendors Data:", vendorsData);
        const vendorsMap = new Map();

        // Create a map of vendor usernames to their data
        if (Array.isArray(vendorsData)) {
          vendorsData.forEach(vendor => {
            if (vendor.user) {
              vendorsMap.set(vendor.user, vendor);
            }
          });
        }
        console.log("Vendors Map:", vendorsMap);
        const transformedComments = commentsData.map(comment => {
          // Default user data from comment
          const userFromComment = {
            id: comment.user?.id || comment.user,
            name: comment.user?.name || comment.user_name,
            profile_picture: comment.user?.profile_picture || comment.user_picture,
            user_type: comment.user?.user_type || comment.user_type || 'client'
          };

          // If user is a vendor, try to match with vendors data
          if (userFromComment.user_type === 'vendor' && userFromComment.name) {
            const matchedVendor = vendorsMap.get(userFromComment.name);
            if (matchedVendor) {
              return {
                id: comment.comment_id || comment.id,
                tender_id: comment.tender || comment.tender_id,
                user: {
                  id: matchedVendor.id, // Use vendor ID from vendors endpoint
                  name: matchedVendor.name || userFromComment.name,
                  profile_picture: matchedVendor.profile_picture || userFromComment.profile_picture,
                  user_type: 'vendor' // Ensure type is vendor
                },
                content: comment.content,
                created_at: comment.created_at,
                updated_at: comment.updated_at
              };
            }
          }

          // Default case (not a vendor or no match found)
          return {
            id: comment.comment_id || comment.id,
            tender_id: comment.tender || comment.tender_id,
            user: userFromComment,
            content: comment.content,
            created_at: comment.created_at,
            updated_at: comment.updated_at
          };
        });

        setComments(transformedComments);
      } catch (err) {
        setComments([]);
        console.error("Error fetching comments or vendors:", err);
      } finally {
        setIsLoadingComments(false);
      }
    };

    const fetchUserBids = async () => {
      if (!userData) return;

      setIsLoadingBids(true);
      try {
        const response = await apiClient.get(`/bids/?tender_id=${id}`);
        const filteredBids = response.data.results.filter(bid => bid.tender == id);

        setUserBids(filteredBids || []);
      } catch (err) {
        console.error("Error fetching bids:", err);
      } finally {
        setIsLoadingBids(false);
      }
    };

    if (id) {
      fetchProjectDetail();
      fetchSimilarProjects();
      fetchComments();
      fetchUserBids();
    }
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handlePlaceBid = async (e) => {
    e.preventDefault();

    if (!bidAmount || !proposal || !deliveryTime) {
      setBidError("Please fill in all bid fields");
      return;
    }

    setBidError(null);

    try {
      await apiClient.post(`/tenders/${id}/place_bid/`, {
        amount: Number(bidAmount),
        proposal: proposal,
        delivery_time: Number(deliveryTime)
      });

      setBidSuccess(true);
      setBidAmount("");
      setProposal("");
      setDeliveryTime("");

      const userData = JSON.parse(localStorage.getItem('user_data'));
      const response = await apiClient.get(`/bids/?tender_id=${id}&user_id=${userData.id}`);
      setUserBids(response.data.results || response.data || []);

      setTimeout(() => {
        setBidSuccess(false);
      }, 3000);
    } catch (err) {
      setBidError(err.response?.data?.message || "Failed to place bid. Please try again.");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) {
      setCommentError("Comment cannot be empty");
      return;
    }

    setCommentError(null);

    try {
      const response = await apiClient.post(`/comments/`, {
        tender_id: Number(id),
        content: newComment
      });

      const newCommentData = {
        id: response.data.comment_id || response.data.id,
        tender_id: response.data.tender || response.data.tender_id,
        user: {
          id: currentUser.user_id,
          name: currentUser.name || currentUser.username,
          profile_picture: currentUser.profile_picture,
          user_type: currentUser.user_type
        },
        content: response.data.content,
        created_at: response.data.created_at,
        updated_at: response.data.updated_at
      };

      setComments(prevComments => [newCommentData, ...prevComments]);
      setNewComment("");
      setCommentSuccess(true);

      setTimeout(() => {
        setCommentSuccess(false);
      }, 3000);
    } catch (err) {
      setCommentError(err.response?.data?.message || "Failed to add comment. Please try again.");
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editCommentContent.trim()) {
      setCommentError("Comment cannot be empty");
      return;
    }

    setCommentError(null);

    try {
      const response = await apiClient.put(`/comments/${commentId}/`, {
        content: editCommentContent
      });

      // Update the comment in the local state
      setComments(prevComments =>
        prevComments.map(comment =>
          comment.id === commentId
            ? {
              ...comment,
              content: response.data.content,
              updated_at: response.data.updated_at
            }
            : comment
        )
      );

      setEditingCommentId(null);
      setEditCommentContent("");
      setCommentSuccess(true);

      setTimeout(() => {
        setCommentSuccess(false);
      }, 3000);
    } catch (err) {
      setCommentError(err.response?.data?.message || "Failed to update comment. Please try again.");
      console.error("Edit comment error:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      await apiClient.delete(`/comments/${commentId}/`);

      // Remove the comment from local state
      setComments(prevComments =>
        prevComments.filter(comment => comment.id !== commentId)
      );

      setCommentSuccess(true);
      setTimeout(() => {
        setCommentSuccess(false);
      }, 3000);
    } catch (err) {
      setCommentError(err.response?.data?.message || "Failed to delete comment. Please try again.");
      console.error("Delete comment error:", err);
    }
  };

  const handleStartEdit = (comment) => {
    setEditingCommentId(comment.id);
    setEditCommentContent(comment.content);

    setTimeout(() => {
      if (commentSectionRef.current) {
        commentSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const cancelEdit = () => {
    setEditingCommentId(null);
    setEditCommentContent("");
  };

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

  const isClient = currentUser && currentUser.user_id === project.client;
  const isFreelancer = currentUser && currentUser.user_type === 'vendor';


  return (
    <>
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

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="mb-6">
            <span className="bg-green-500 text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-full">
              {project.status}
            </span>
          </div>

          <h1 className="font-extrabold text-2xl sm:text-3xl mb-3 text-[#5B8CFF]">
            {project.title}
          </h1>

          <div className="mb-6 text-gray-600 text-sm">
            Posted on {formatDate(project.created_at)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
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

              <div className="flex items-center space-x-3 mb-6 bg-gray-50 p-4 rounded-xl">
                <Link to={`/client/profile/${project.client}`}>
                  <img
                    src={`http://127.0.0.1:8000${project.client_picture}`}
                    alt={project.client_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </Link>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {project.client_name}
                  </h3>
                  <p className="text-sm text-gray-600">Project Owner</p>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Project Description
                </h2>
                <div className="prose max-w-none text-gray-700">
                  <p>{project.description || "No description available."}</p>
                </div>
              </div>

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

              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Project Duration
                </h2>
                <p className="text-gray-700">
                  {project.max_duration} days maximum
                </p>
              </div>

              {isFreelancer && (
                <div className="mb-8 bg-gray-50 p-6 rounded-xl">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Your Bids
                  </h2>

                  {isLoadingBids ? (
                    <p className="text-gray-500">Loading your bids...</p>
                  ) : userBids.length > 0 ? (
                    <div className="space-y-4">
                      {userBids.map((bid) => (
                        <div key={bid.bid_id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-800">
                                Bid Amount: Rp {Number(bid.amount).toLocaleString()}
                              </h4>
                              <p className="text-sm text-gray-500">
                                Delivery Time: {bid.delivery_time} days
                              </p>
                              <p className="text-xs text-gray-500">
                                Submitted on {formatDateTime(bid.created_at)}
                              </p>
                            </div>
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${bid.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              bid.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                              {bid.status}
                            </span>
                          </div>
                          <div className="mt-2">
                            <h5 className="text-sm font-medium text-gray-700">Proposal:</h5>
                            <p className="text-gray-600 whitespace-pre-wrap">{bid.proposal}</p>
                          </div>
                          <div className="mt-2 flex items-center">
                            <img
                              src={bid.vendor_profile?.profile_picture ? `http://127.0.0.1:8000${bid.vendor_profile.profile_picture}` : "https://via.placeholder.com/40"}
                              alt={bid.vendor_name}
                              className="w-6 h-6 rounded-full mr-2"
                            />
                            <span className="text-sm text-gray-600">{bid.vendor_name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="mb-6">
                        <p className="text-gray-600">You haven't placed any bids on this project yet.</p>
                      </div>

                      <h3 className="text-lg font-bold text-gray-800 mb-4">
                        Place Your Bid
                      </h3>

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
                            className="w-full bg-gradient-to-r from-[#5B8CFF] to-[#7DA7FF] text-white py-3 rounded-xl font-bold hover:shadow-lg transition duration-300"
                          >
                            Submit Bid
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              )}

              <div className="mb-8 bg-gray-50 p-6 rounded-xl" ref={commentSectionRef}>
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  {editingCommentId ? "Edit Comment" : "Comments"}
                </h2>

                {commentSuccess && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-4">
                    {editingCommentId ? "Comment updated successfully!" : "Comment added successfully!"}
                  </div>
                )}

                {commentError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
                    {commentError}
                  </div>
                )}

                <form onSubmit={editingCommentId ?
                  (e) => { e.preventDefault(); handleEditComment(editingCommentId); } :
                  handleAddComment
                } className="mb-6">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="comment" className="block text-gray-700 font-medium mb-1">
                        {editingCommentId ? "Update your comment" : "Add a comment"}
                      </label>
                      <textarea
                        id="comment"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B8CFF] resize-none"
                        rows="3"
                        placeholder={editingCommentId ? "Edit your comment..." : "Write a comment..."}
                        value={editingCommentId ? editCommentContent : newComment}
                        onChange={(e) => editingCommentId ?
                          setEditCommentContent(e.target.value) :
                          setNewComment(e.target.value)
                        }
                        required
                      ></textarea>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-[#5B8CFF] to-[#7DA7FF] text-white py-2 px-6 rounded-xl font-bold hover:shadow-lg transition duration-300"
                      >
                        {editingCommentId ? "Update Comment" : "Post Comment"}
                      </button>

                      {editingCommentId && (
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="bg-gray-200 text-gray-700 py-2 px-6 rounded-xl font-bold hover:shadow-lg transition duration-300"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </form>

                <div className="space-y-4">
                  {isLoadingComments ? (
                    <p className="text-gray-500">Loading comments...</p>
                  ) : comments.length === 0 ? (
                    <p className="text-gray-500 italic">No comments yet. Be the first to comment!</p>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center">
                            <Link to={comment.user?.user_type === 'vendor'
                              ? `/vendor/profile/${comment.user.id}`
                              : `/client/profile/${comment.user.id}`}
                            >
                              <img
                                src={comment.user?.profile_picture
                                  ? `http://127.0.0.1:8000${comment.user.profile_picture}`
                                  : "https://via.placeholder.com/40"}
                                alt={comment.user?.name || "User"}
                                className="w-8 h-8 rounded-full object-cover mr-3"
                              />
                            </Link>
                            <div>
                              <h4 className="font-semibold text-gray-800">
                                {comment.user?.name || comment.user?.user_name || "Anonymous"}
                              </h4>
                              <p className="text-xs text-gray-500">
                                {formatDateTime(comment.created_at)}
                                {comment.created_at !== comment.updated_at && " (edited)"}
                              </p>
                            </div>
                          </div>

                          {currentUser && comment.user?.id === currentUser.user_id && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleStartEdit(comment)}
                                className="text-[#5B8CFF] hover:underline text-sm"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="text-red-500 hover:underline text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 h-fit sticky top-8">
              <h3 className="font-bold text-lg text-gray-800 mb-4">
                Project Details
              </h3>

              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-gray-600 text-sm mb-1">Budget</p>
                <p className="font-bold text-gray-800">
                  Rp {Number(project.min_budget).toLocaleString()} - Rp{" "}
                  {Number(project.max_budget).toLocaleString()}
                </p>
              </div>

              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-gray-600 text-sm mb-1">Deadline</p>
                <p className="font-bold text-gray-800">
                  {formatDate(project.deadline)}
                </p>
              </div>
              
              {project.tags_data && project.tags_data.length > 0 && (
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <span>Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.tags_data
                      .filter(tag => tag?.id && tag?.name) // Filter hanya tag yang valid
                      .map(tag => (
                        <span
                          key={`tag-${tag.id}`}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {tag.name}
                        </span>
                      ))
                    }
                  </div>
                </div>
              )}

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

              <div className="mb-4">
                <p className="text-gray-600 text-sm mb-1">Comments</p>
                <p className="font-bold text-gray-800">{comments.length}</p>
              </div>

              {isFreelancer && (
                <div className="mb-4">
                  <p className="text-gray-600 text-sm mb-1">Your Bids</p>
                  <p className="font-bold text-gray-800">{userBids.length}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <section className="mt-12">
          <h2 className="font-extrabold text-xl mb-6 text-[#5B8CFF]">
            Similar Projects
          </h2>

          {similarProjects.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-md">
              No similar projects available at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {similarProjects.slice(0, 3).map((project) => (
                <Link to={`/projects/${project.tender_id}`} key={project.tender_id}>
                  <article className="relative bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition duration-300 h-full flex flex-col">
                    <span className="absolute top-2 right-2 bg-green-500 text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-full z-10 shadow">
                      {project.status}
                    </span>

                    <div className="bg-gradient-to-r from-[#5B8CFF] to-[#7DA7FF] h-48 flex-shrink-0">
                      {project.attachment ? (
                        <img
                          src={project.attachment}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <i className="fas fa-briefcase text-white text-3xl"></i>
                        </div>
                      )}
                    </div>

                    <div className="p-4 flex flex-col flex-grow">
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

                      <h3 className="text-[#5B8CFF] text-sm font-semibold leading-snug line-clamp-2 mb-2">
                        {project.title}
                      </h3>

                      {project.tags_data && project.tags_data.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {project.tags_data
                            .filter(tag => tag?.id && tag?.name)
                            .map(tag => (
                              <span
                                key={`tag-${tag.id}`}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {tag.name}
                              </span>
                            ))
                          }
                        </div>
                      )}

                      <p className="text-sm text-gray-700 mt-auto">
                        Budget:{" "}
                        <span className="font-semibold">
                          Rp {Number(project.min_budget).toLocaleString()} - Rp{" "}
                          {Number(project.max_budget).toLocaleString()}
                        </span>
                      </p>

                      {project.category && (
                        <div className="mt-3">
                          <span className="bg-[#5B8CFF] text-white text-xs font-medium rounded-full py-1 px-3">
                            {project.category.name}
                          </span>
                        </div>
                      )}
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