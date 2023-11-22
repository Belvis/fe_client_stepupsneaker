import { IProductClient } from "../../interfaces";

interface ProductImageFixedProps {
  product: IProductClient;
}

const ProductImageFixed: React.FC<ProductImageFixedProps> = ({ product }) => {
  return (
    <div className="product-large-image-wrapper">
      {product.discount || product.new ? (
        <div className="product-img-badges">
          {product.discount ? (
            <span className="pink">-{product.discount}%</span>
          ) : (
            ""
          )}
          {product.new ? <span className="purple">New</span> : ""}
        </div>
      ) : (
        ""
      )}

      <div className="product-fixed-image">
        {product.image ? (
          <img src={product.image[0]} alt="" className="img-fluid" />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default ProductImageFixed;
