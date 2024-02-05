import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import ProductGridListSingle from "../../components/product/ProductGridListSingle";
import { IProductClient } from "../../interfaces";
import { RootState } from "../../redux/store";

interface ProductGridListProps {
  products: IProductClient[];
  spaceBottomClass: string;
}

const ProductGridList: React.FC<ProductGridListProps> = ({
  products,
  spaceBottomClass,
}) => {
  const currency = useSelector((state: RootState) => state.currency);
  const { wishlistItems } = useSelector((state: RootState) => state.wishlist);
  const { compareItems } = useSelector((state: RootState) => state.compare);

  return (
    <Fragment>
      {products?.map((product) => {
        return (
          <div className="col-xl-4 col-sm-6" key={product.id}>
            <ProductGridListSingle
              spaceBottomClass={spaceBottomClass}
              product={product}
              currency={currency}
              wishlistItem={wishlistItems.find(
                (wishlistItem) => wishlistItem.id === product.id
              )}
              compareItem={compareItems.find(
                (compareItem) => compareItem.id === product.id
              )}
            />
          </div>
        );
      })}
    </Fragment>
  );
};

export default ProductGridList;
