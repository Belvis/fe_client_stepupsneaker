import React from "react";
import { IReviewResponse } from "../../interfaces";
import { useTranslate } from "@refinedev/core";
import { Avatar, Image } from "antd";

type ReviewProps = {
  review: IReviewResponse;
};
type ReviewsProps = {
  reviews: IReviewResponse[];
};
const Review: React.FC<ReviewProps> = ({ review }) => {
  const t = useTranslate();

  return (
    <div className="single-review" key={review.id}>
      <div className="review-img">
        <Avatar shape="square" size={100} src={review.customer.image} />
        {/* <img src={review.urlImage} alt="" /> */}
      </div>
      <div className="review-content">
        <div className="review-top-wrap">
          <div className="review-left">
            <div className="review-name">
              <h4>
                {review.customer.fullName} - {review.productDetail.product.name}
              </h4>
            </div>
            <div className="review-rating">
              {/* Render số sao dựa trên rating */}
              {Array.from({ length: review.rating }, (_, index) => (
                <i key={index} className="fa fa-star" />
              ))}
            </div>
          </div>
        </div>
        <div className="review-bottom">
          <p>{review.comment}</p>
          <Image width={200} src={review.urlImage} />
        </div>
      </div>
    </div>
  );
};

const Reviews: React.FC<ReviewsProps> = ({ reviews }) => {
  return (
    <div className="reviews">
      {reviews.map((review) => (
        <Review key={review.id} review={review} />
      ))}
    </div>
  );
};

export default Reviews;
