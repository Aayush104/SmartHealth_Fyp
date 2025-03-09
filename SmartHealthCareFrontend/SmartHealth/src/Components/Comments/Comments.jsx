import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";

const Comments = ({ DoctorId, photo, viewReply }) => {
  // State variables
  const [view, setView] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState({
    visitedFor: "",
    reviewText: "",
  });
  const [selected, setSelected] = useState(""); 
  const [showReplyFields, setShowReplyFields] = useState({}); // Track which reply fields to show
  const [replyTexts, setReplyTexts] = useState({}); // Store reply texts for each comment

  // Get and decode JWT token
  const token = Cookies.get("Token");
  let PatientId, UserName;

  if (token) {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    PatientId = decodedToken.userId;
    UserName = decodedToken.Name;
  }

  // Convert createdAt date to relative time
  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);

    if (diffSec < 60) return `${diffSec} second${diffSec === 1 ? "" : "s"} ago`;

    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;

    const diffHrs = Math.floor(diffMin / 60);
    if (diffHrs < 24) return `${diffHrs} hour${diffHrs === 1 ? "" : "s"} ago`;

    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays < 30) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;

    const diffMonths = Math.floor(diffDays / 30);
    return `${diffMonths} month${diffMonths === 1 ? "" : "s"} ago`;
  };

  // Check if the user is allowed to comment
  useEffect(() => {
    if (DoctorId && token) {
      const checkCommentValidation = async () => {
        try {
          const response = await axios.get(
            `https://localhost:7070/api/Appointment/CheckforComment/${DoctorId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (response.status === 200) {
            setView(true);
          }
        } catch (error) {
          console.error("Error fetching comment validation:", error);
        }
      };

      checkCommentValidation();
    }
  }, [DoctorId, token]);

  // Handle comment submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.visitedFor || !newComment.reviewText || selected === "") {
      alert("All fields are required!");
      return;
    }

    const data = {
      patientId: PatientId,
      doctorId: DoctorId,
      userName: UserName,
      visitedFor: newComment.visitedFor,
      isRecommended: selected === "I recommend a Doctor",
      reviewText: newComment.reviewText,
    };

    try {
      const response = await axios.post(
        "https://localhost:7070/api/Doctor/DoComment",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // Reset form after successful submission
        setNewComment({ visitedFor: "", reviewText: "" });
        setSelected("");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  // Fetch the comments for the doctor
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7070/api/Doctor/GetComments/${DoctorId}`
        );
        setReviews(response.data.data.$values || []);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    if (DoctorId) {
      fetchData();
    }
  }, [DoctorId]);

  // Toggle reply field visibility
  const toggleReplyField = (reviewId) => {
    setShowReplyFields(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  // Handle reply text change
  const handleReplyChange = (reviewId, text) => {
    setReplyTexts(prev => ({
      ...prev,
      [reviewId]: text
    }));
  };

  // Handle reply submission
  const submitReply = async (e, reviewId) => {
    e.preventDefault();
    
    // Add your reply submission logic here
    console.log(`Submitting reply for review ${reviewId}: ${replyTexts[reviewId]}`);
    
    // Clear the reply field and hide it after submission
    setReplyTexts(prev => ({
      ...prev,
      [reviewId]: ""
    }));
    setShowReplyFields(prev => ({
      ...prev,
      [reviewId]: false
    }));
    
    // TODO: Implement the actual API call to submit the reply
  };

  const placeholderImage =
    "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg";

  return (
    <div className="max-w-3xl mx-auto py-6">
      <h2 className="text-2xl font-bold mb-6">Patient Stories</h2>

      {view && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Visited For"
              className="w-full p-2 border rounded mb-4"
              value={newComment.visitedFor}
              onChange={(e) =>
                setNewComment({ ...newComment, visitedFor: e.target.value })
              }
              required
            />

            <div className="flex gap-4 items-center mb-4">
              {["I recommend a Doctor", "I Don't recommend a Doctor"].map(
                (option) => (
                  <label key={option} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="recommendation"
                      value={option}
                      checked={selected === option}
                      onChange={() => setSelected(option)}
                      className="hidden"
                    />
                    <span
                      className={`w-6 h-6 flex items-center justify-center border-2 rounded-full ${
                        selected === option ? "border-blue-500" : "border-gray-400"
                      }`}
                    >
                      {selected === option && "✔"}
                    </span>
                    <span>{option}</span>
                  </label>
                )
              )}
            </div>

            <textarea
              placeholder="Your Review"
              className="w-full p-2 border rounded h-24 mb-4"
              value={newComment.reviewText}
              onChange={(e) =>
                setNewComment({ ...newComment, reviewText: e.target.value })
              }
              required
            />

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Submit Review
            </button>
          </form>
        </div>
      )}

      <div className="border border-gray-200 rounded-sm">
        {reviews.map((review, index) => (
          <div key={index} className="bg-white border shadow p-6">
            <div className="flex justify-between">
              <div className="flex gap-3">
                <img src={placeholderImage} alt="Avatar" className="h-10 w-10" />
                <div className="flex flex-col w-full">
                  <div className="flex gap-justify-between">
                    <span className="font-medium text-lg text-gray-500">
                      {review.userName}
                    </span>
                  </div>
                  <h3 className="font-medium mb-2 text-xl">
                    Visited For {review.visitedFor}
                  </h3>
                  {review.isRecommended ? (
                    <div className="flex gap-2 items-center text-lg">
                      <AiOutlineLike /> <p>I recommend this doctor</p>
                    </div>
                  ) : (
                    <div className="flex gap-2 items-center text-lg">
                      <AiOutlineDislike />
                      <p>I don't recommend this doctor</p>
                    </div>
                  )}
                  <p className="text-gray-700 text-lg mt-1 px-1">{review.reviewText}</p>
                </div>
              </div>
              <div className="text-gray-500 text-sm">{timeAgo(review.createdAt)}</div>
            </div>

            {/* Reply button - only show when viewReply is true */}
            {viewReply && (
              <div className="mt-4">
                <button 
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => toggleReplyField(review.id || index)}
                >
                  Reply
                </button>
              </div>
            )}

            {/* Reply field - only shown when viewReply is true AND the reply button is clicked */}
            {viewReply && showReplyFields[review.id || index] && (
              <div className="flex items-center gap-2 mt-2">
                <img src={photo || placeholderImage} className="h-10 w-10 rounded-full border p-1" alt="Profile" />
                <textarea
                  className="w-full p-2 border rounded resize-none min-h-[40px] focus:min-h-[80px]"
                  placeholder="Write a reply..."
                  value={replyTexts[review.id || index] || ""}
                  onChange={(e) => handleReplyChange(review.id || index, e.target.value)}
                />
                <button 
                  className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  onClick={(e) => submitReply(e, review.id || index)}
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;