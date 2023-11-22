import React, { FC, Fragment } from "react";
import PropTypes from "prop-types";

interface ProductRatingProps {
  ratingValue?: number;
}

const ProductRating: FC<ProductRatingProps> = ({ ratingValue }) => {
  const rating: JSX.Element[] = [];

  for (let i = 0; i < 5; i++) {
    rating.push(<i className="fa fa-star-o" key={i}></i>);
  }

  if (ratingValue && ratingValue > 0) {
    for (let i = 0; i <= ratingValue - 1; i++) {
      rating[i] = <i className="fa fa-star-o yellow" key={i}></i>;
    }
  }

  return <Fragment>{rating}</Fragment>;
};

ProductRating.propTypes = {
  ratingValue: PropTypes.number,
};

export default ProductRating;
