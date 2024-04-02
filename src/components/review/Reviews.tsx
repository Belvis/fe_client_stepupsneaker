import {
  Authenticated,
  useDelete,
  useGetIdentity,
  useTranslate,
} from "@refinedev/core";
import { Avatar, Image, Rate } from "antd";
import React from "react";
import { ICustomerResponse, IReviewResponse } from "../../interfaces";
import { showWarningConfirmDialog } from "../../helpers/confirm";
import dayjs from "dayjs";
import { getAvatarColor, getFirstLetterOfLastWord } from "../../helpers/avatar";

type ReviewProps = {
  review: IReviewResponse;
  calback: any;
};
type ReviewsProps = {
  reviews: IReviewResponse[];
  calback: any;
};
const Review: React.FC<ReviewProps> = ({ review, calback }) => {
  const t = useTranslate();
  const { data: user, refetch } = useGetIdentity<ICustomerResponse>();

  const { mutate } = useDelete();

  const removeReview = (id: string) => {
    showWarningConfirmDialog({
      options: {
        accept: () => {
          mutate(
            {
              resource: "product/reviews",
              id,
              successNotification: (data, id, resource) => {
                return {
                  message: `Xoá đánh giá thành công`,
                  description: t("common.success"),
                  type: "success",
                };
              },
            },
            {
              onError: (error, variables, context) => {},
              onSuccess: (data, variables, context) => {
                calback();
              },
            }
          );
        },
        reject: () => {},
      },
      t: t,
    });
  };
  return (
    <div className="single-review" key={review.id}>
      <div className="review-img">
        {review.customer && review.customer.image ? (
          <Avatar
            size={100}
            shape="square"
            src={review.customer.image}
            style={{ verticalAlign: "baseline" }}
          />
        ) : (
          <Avatar
            size={100}
            shape="square"
            style={{
              verticalAlign: "baseline",
              backgroundColor: getAvatarColor(review.customer?.fullName),
            }}
          >
            {getFirstLetterOfLastWord(review.customer?.fullName)}
          </Avatar>
        )}
      </div>
      <div className="review-content w-100">
        <div className="review-top-wrap">
          <div className="review-left">
            <div className="review-name">
              <h4>
                {review.customer.fullName} - {review.productDetail.product.name}{" "}
                | {review.productDetail.color.name} -{" "}
                {review.productDetail.size.name}
              </h4>
            </div>
            <div className="review-rating">
              <Rate allowHalf disabled value={review.rating} />
            </div>
          </div>
          <Authenticated fallback={false}>
            {user && user.id === review.customer.id && (
              <div className="review-left">
                <button onClick={() => removeReview(review.id)}>
                  {t("buttons.delete")}
                </button>
              </div>
            )}
          </Authenticated>
        </div>
        <div className="review-bottom">
          <p>{review.comment}</p>
          <div className="image-and-date">
            <Image width={200} src={review.urlImage} />
            <p className="text-end">
              {dayjs(new Date(review.createdAt)).format("LLL")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Reviews: React.FC<ReviewsProps> = ({ reviews, calback }) => {
  return (
    <div className="reviews">
      {reviews.map((review) => (
        <Review key={review.id} review={review} calback={calback} />
      ))}
    </div>
  );
};

export default Reviews;
