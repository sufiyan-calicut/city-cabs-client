import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import "../../../../styles/rating.css";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import instance from "../../../instance/instance";

const Rating = () => {
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const navigate = useNavigate();
  const notificationId = localStorage.getItem("notificationId")
  console.log(notificationId,'this is id to be updated')

  const handleRatingChange = (event) => {
    setRating(parseInt(event.target.value));
    console.log(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);

    try {
      const response = await instance.post("/rating", {
        rating,
        description,
        notificationId,
      });
      localStorage.removeItem("notificationId")
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = () => {
    setIsSubmitted(false);
  };

  useEffect(() => {
    let timeout;
    if (isSubmitted) {
      timeout = setTimeout(() => {
        setIsSubmitted(false);
        navigate("/");
      }, 3000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [isSubmitted]);

  return (
    <>
      <Header />
      <div
        className="absolute items-center flex h-screen top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{ width: "400px" }}
      >
        <div className="container">
          {isSubmitted ? (
            <div>
              <div className="text">Thanks for rating us!</div>
            </div>
          ) : (
            <div className="star-widget">
              <input
                type="radio"
                name="rate"
                id="rate-5"
                value={5}
                onChange={handleRatingChange}
              />
              <label htmlFor="rate-5" className="fas fa-star">
                <FontAwesomeIcon icon={faStar} />
              </label>
              <input
                type="radio"
                name="rate"
                id="rate-4"
                value={4}
                onChange={handleRatingChange}
              />
              <label htmlFor="rate-4" className="fas fa-star">
                <FontAwesomeIcon icon={faStar} />
              </label>
              <input
                type="radio"
                name="rate"
                id="rate-3"
                value={3}
                onChange={handleRatingChange}
              />
              <label htmlFor="rate-3" className="fas fa-star">
                <FontAwesomeIcon icon={faStar} />
              </label>
              <input
                type="radio"
                name="rate"
                id="rate-2"
                value={2}
                onChange={handleRatingChange}
              />
              <label htmlFor="rate-2" className="fas fa-star">
                <FontAwesomeIcon icon={faStar} />
              </label>
              <input
                type="radio"
                name="rate"
                id="rate-1"
                value={1}
                onChange={handleRatingChange}
              />
              <label htmlFor="rate-1" className="fas fa-star">
                <FontAwesomeIcon icon={faStar} />
              </label>
              <form onSubmit={handleSubmit}>
                <header></header>
                <div className="textarea">
                  <textarea
                    cols="30"
                    placeholder="Describe your experience.."
                    value={description}
                    onChange={handleDescriptionChange}
                  ></textarea>
                </div>
                <div className="h-10 w-full my-2 ">
                  <button
                    type="submit"
                    className="h-full w-full outline-none text-gray-500 text-sm font-semibold uppercase cursor-pointer transition-all duration-300 ease-in hover:bg-gray-700 rounded-2xl hover:text-white"
                  >
                    Post
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Rating;
