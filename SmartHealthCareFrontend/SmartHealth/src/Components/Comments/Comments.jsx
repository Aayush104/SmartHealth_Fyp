import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { toast } from "react-toastify";

const Comments = ({ DoctorId, photo, viewReply, DoctorName }) => {
  // State variables
  const [view, setView] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState({
    visitedFor: "",
    reviewText: "",
  });
  const [selected, setSelected] = useState(""); 
  const [showReplyFields, setShowReplyFields] = useState({}); 
  const [replyTexts, setReplyTexts] = useState({}); 
  const [showDelete, setShowDelete] = useState(false);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);
  const [users, setUser] = useState(false)

  // Get and decode JWT token
  const token = Cookies.get("Token");
  let PatientId, UserName, Role;

  if (token) {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    PatientId = decodedToken.userId;
    UserName = decodedToken.Name;
    Role = decodedToken.Role;
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

      if(Role == "Admin") {
        setView(true);
        setShowDelete(true);
       
      }
      if(Role == "Patient") {

        setUser(true)
      
       
      }



      checkCommentValidation();
    }
  }, [DoctorId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.visitedFor || !newComment.reviewText || selected === "") {
      toast.error("All fields are required!");
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
        setNewComment({ visitedFor: "", reviewText: "" });
        setSelected("");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error("Failed to submit comment!");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7070/api/Doctor/GetComments/${DoctorId}`
        );
        const commentsData = response.data.data.$values || [];
        
        // Check if the current user has already reviewed
        const userReview = commentsData.some(review => review.userName === UserName);
        setHasUserReviewed(userReview);

        setReviews(commentsData);
      
        if (commentsData.length > 0) {
          const updatedReviews = [...commentsData];
          
          for (let i = 0; i < updatedReviews.length; i++) {
            if (updatedReviews[i].commentId) {
              try {
                const replyResponse = await axios.get(
                  `https://localhost:7070/api/Doctor/GetReply/${updatedReviews[i].commentId}`
                );
                
                if (replyResponse.status === 200 && replyResponse.data.data.$values) {
                  updatedReviews[i].replies = {
                    $values: replyResponse.data.data.$values
                  };
                }
              } catch (error) {
                console.error(`Error fetching replies for comment ${updatedReviews[i].commentId}:`, error);
              }
            }
          }
          
          setReviews(updatedReviews);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    if (DoctorId) {
      fetchData();
    }
  }, [DoctorId, UserName]);

  // Toggle reply field visibility
  const toggleReplyField = (reviewId) => {
    setShowReplyFields(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const handleReplyChange = (reviewId, text) => {
    setReplyTexts(prev => ({
      ...prev,
      [reviewId]: text
    }));
  };

  const submitReply = async (e, commentId) => {
    e.preventDefault();
    
    if (!replyTexts[commentId] || replyTexts[commentId].trim() === "") {
      toast.error("Reply text cannot be empty!");
      return;
    }

    const data = {
      commentId: commentId,
      doctorId: DoctorId,
      replyText: replyTexts[commentId]
    };

    try {
      const response = await axios.post(
        "https://localhost:7070/api/Doctor/DoReply",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // Clear the reply field and hide it
        setReplyTexts(prev => ({
          ...prev,
          [commentId]: ""
        }));
        setShowReplyFields(prev => ({
          ...prev,
          [commentId]: false
        }));
        
        // Fetch the updated replies for this comment
        try {
          const replyResponse = await axios.get(
            `https://localhost:7070/api/Doctor/GetReply/${commentId}`
          );
          
          if (replyResponse.status === 200) {
            setReviews(prevReviews => {
              return prevReviews.map(review => {
                if (review.commentId === commentId) {
                  return {
                    ...review,
                    replies: {
                      $values: replyResponse.data.data.$values
                    }
                  };
                }
                return review;
              });
            });
          }
        } catch (error) {
          console.error(`Error fetching updated replies for comment ${commentId}:`, error);
          window.location.reload(); // Fall back to reload if update fails
        }
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
      toast.error("Failed to submit reply!");
    }
  };

  const placeholderImage =
    "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg";

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.post(
        `https://localhost:7070/api/Admin/DeleteComment/${commentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        // Remove the comment from the reviews state
        setReviews(prevReviews => 
          prevReviews.filter(review => review.commentId !== commentId)
        );
        
        // Show success toast
        toast.success("Comment deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <h2 className="text-2xl font-bold mb-6">Patient Stories</h2>

      {view && !viewReply && users && !hasUserReviewed &&  (
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
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="bg-white border shadow p-6 mb-3">
              <div className="flex justify-between">
                <div className="flex gap-3">
                  <img src={placeholderImage} alt="Avatar" className="h-10 w-10 rounded-full" />
                  <div className="flex flex-col w-full">
                    <div className="flex justify-between">
                      <span className="font-medium text-lg text-gray-500">
                        {review.userName}
                      </span>
                    </div>
                    <h3 className="font-medium mb-2 text-xl">
                      Visited For {review.visitedFor}
                    </h3>
                    {review.isRecommended ? (
                      <div className="flex gap-2 items-center text-lg text-green-500">
                        <AiOutlineLike /> <p>I recommend this doctor</p>
                      </div>
                    ) : (
                      <div className="flex gap-2 items-center text-lg text-red-500">
                        <AiOutlineDislike />
                        <p>I don't recommend this doctor</p>
                      </div>
                    )}
                    <p className="text-gray-700 text-lg mt-1 px-1">{review.reviewText}</p>
                  </div>
                </div>
                <div className="text-gray-500 text-sm">{timeAgo(review.createdAt)}</div>
              </div>

              {/* Show replies if they exist */}
              {review.replies && review.replies.$values && review.replies.$values.length > 0 && (
                <div className="ml-12 mt-4 border-l-2 border-gray-200 pl-4">
                  {review.replies.$values.map((reply, replyIndex) => (
                    <div key={replyIndex} className="mt-2">
                      <div className="flex items-start gap-2">
                        <img src={photo || placeholderImage} className="h-8 w-8 rounded-full border p-1" alt="Doctor" />
                        <div>
                          <div className="font-medium text-blue-600">Dr. {DoctorName}</div>
                          <p className="text-gray-700">{reply.replyText}</p>
                          <div className="text-gray-500 text-xs mt-1">{timeAgo(reply.createdAt)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-8">
                {viewReply && (
                  <div className="mt-4">
                    <button 
                      className="text-blue-500 hover:text-blue-700 font-medium"
                      onClick={() => toggleReplyField(review.commentId)}
                    >
                      {showReplyFields[review.commentId] ? "Cancel Reply" : "Reply"}
                    </button>
                  </div>
                )}

                {showDelete && (
                  <p 
                    className="text-red-400 font-medium cursor-pointer hover:text-red-500 mt-4"    
                    onClick={() => handleDeleteComment(review.commentId)}
                  >
                    Delete
                  </p>
                )}
              </div>

              {viewReply && showReplyFields[review.commentId] && (
                <div className="flex items-center gap-2 mt-2">
                  <img src={photo || placeholderImage} className="h-10 w-10 rounded-full border p-1" alt="Profile" />
                  <textarea
                    className="w-full p-2 border rounded resize-none min-h-[40px] focus:min-h-[80px]"
                    placeholder="Write a reply..."
                    value={replyTexts[review.commentId] || ""}
                    onChange={(e) => handleReplyChange(review.commentId, e.target.value)}
                  />
                  <button 
                    className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    onClick={(e) => submitReply(e, review.commentId)}
                  >
                    Submit
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white p-6 text-center text-gray-500">
            No reviews yet. Be the first to leave a review!
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;