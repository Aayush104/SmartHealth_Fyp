import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const Comments = ({ DoctorId }) => {
  // State variables
  const [view, setView] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState({
    visitedFor: "",
    reviewText: "",
  });
  const [selected, setSelected] = useState(""); // For radio button selection

  // Get and decode JWT token
  const token = Cookies.get("Token");

  let decodedToken;
  let PatientId;
  let  UserName;
  
  if(token)
  {
    
 decodedToken = JSON.parse(atob(token.split(".")[1])); 
 PatientId = decodedToken.userId;
 
 UserName = decodedToken.Name;
  }

 

  // Helper function to convert createdAt date to relative time
  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);

    if (diffSec < 60) return `${diffSec} second${diffSec === 1 ? "" : "s"} ago`;

    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60)
      return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;

    const diffHrs = Math.floor(diffMin / 60);
    if (diffHrs < 24)
      return `${diffHrs} hour${diffHrs === 1 ? "" : "s"} ago`;

    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays < 30)
      return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;

    const diffMonths = Math.floor(diffDays / 30);
    return `${diffMonths} month${diffMonths === 1 ? "" : "s"} ago`;
  };

  // API call to check if the user is allowed to comment
  useEffect(() => {
    if (DoctorId && token) {
      const checkCommentValidation = async () => {
        try {
          const response = await axios.get(
            `https://localhost:7070/api/Appointment/CheckforComment/${DoctorId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
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
        // Reset form values after successful submission
        setNewComment({ visitedFor: "", reviewText: "" });
        setSelected("");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  // Fetch the comments data for the doctor
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7070/api/Doctor/GetComments/${DoctorId}`
        );
        const comments = response.data.data.$values || [];
        setReviews(comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    if (DoctorId) {
      fetchData();
    }
  }, [DoctorId]);

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
                  <label
                    key={option}
                    className="flex items-center gap-2 cursor-pointer"
                  >
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

      <div className="space-y-6">
        {reviews.map((review, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between">
              <div className="flex gap-3 mb-3">
                <img
                  src={placeholderImage}
                  alt="Avatar"
                  className="h-10 w-10"
                />
                <div className="flex flex-col w-full">
                  <div className="flex gap-justify-between">
                    <div>
                      <span className="font-medium">{review.userName}</span>
                      {review.verified && (
                        <span className="text-sm text-gray-500 ml-2">
                          (Verified)
                        </span>
                      )}
                    </div>
                   
                  </div>
                  <h3 className="font-medium mb-2">
                    Visited For {review.visitedFor}
                  </h3>
                  {review.isRecommended ? (
                    <p>I recommend this</p>
                  ) : (
                    <p>I don't recommend this doctor</p>
                  )}
                  <p className="text-gray-700">{review.reviewText}</p>
                </div>
              </div>

              <div className="text-gray-500 text-sm">
                      {timeAgo(review.createdAt)}
                    </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
