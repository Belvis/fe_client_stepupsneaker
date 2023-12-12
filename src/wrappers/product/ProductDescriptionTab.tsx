import clsx from "clsx";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import { useTranslation } from "react-i18next";

interface ProductDescriptionTabProps {
  spaceBottomClass: string;
  productFullDesc: string;
}

const ProductDescriptionTab: React.FC<ProductDescriptionTabProps> = ({
  spaceBottomClass,
  productFullDesc,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={clsx("description-review-area", spaceBottomClass, "bg-white")}
    >
      <div className="container">
        <div className="description-review-wrapper">
          <Tab.Container defaultActiveKey="productDescription">
            <Nav variant="pills" className="description-review-topbar">
              <Nav.Item>
                <Nav.Link eventKey="additionalInfo">
                  {t(`products.desc_tab.additional_information`)}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="productDescription">
                  {t(`products.desc_tab.description`)}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="productReviews">
                  {t(`products.desc_tab.reviews`)}(2)
                </Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content className="description-review-bottom">
              <Tab.Pane eventKey="additionalInfo">
                <div className="product-anotherinfo-wrapper">
                  <ul>
                    <li>
                      <span>Cân nặng</span> 400 g
                    </li>
                    <li>
                      <span>Kích thước</span>10 x 10 x 15 cm{" "}
                    </li>
                    <li>
                      <span>Nguyên liệu</span> 60% cotton, 40% polyester
                    </li>
                    <li>
                      <span>Thông tin khác</span> Bạn có thể xem chi tiết từng
                      góc cạnh của sản phẩm bằng cách quét mã QR code đi kèm
                      trên hộp giày.
                    </li>
                  </ul>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="productDescription">
                {productFullDesc}
              </Tab.Pane>
              <Tab.Pane eventKey="productReviews">
                <div className="row">
                  <div className="col-lg-7">
                    <div className="review-wrapper">
                      <div className="single-review">
                        <div className="review-img">
                          <img src={"/images/testimonial/1.jpg"} alt="" />
                        </div>
                        <div className="review-content">
                          <div className="review-top-wrap">
                            <div className="review-left">
                              <div className="review-name">
                                <h4>White Lewis</h4>
                              </div>
                              <div className="review-rating">
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                              </div>
                            </div>
                            <div className="review-left">
                              <button>
                                {t(`products.desc_tab.buttons.reply`)}
                              </button>
                            </div>
                          </div>
                          <div className="review-bottom">
                            <p>
                              Đôi Sneaker này thực sự làm cho trải nghiệm của
                              tôi trở nên hoàn hảo hơn. Chất liệu vải thoáng khí
                              giúp đôi chân của tôi luôn khô ráo và thoải mái,
                              đặc biệt là trong những ngày nắng nóng. Đế giữa
                              với công nghệ chống sốc thực sự là một điểm cộng,
                              giảm mệt mỏi khi di chuyển. Thiết kế hiện đại và
                              màu sắc phối hợp tinh tế, làm cho tôi luôn tự tin
                              mỗi khi mang giày này ra khỏi nhà. Ngoài ra, dịch
                              vụ khách hàng cũng rất tốt, giao hàng nhanh chóng
                              và đóng gói cẩn thận. Tôi rất hài lòng với sự mua
                              sắm của mình.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="single-review child-review">
                        <div className="review-img">
                          <img src={"/images/testimonial/2.jpg"} alt="" />
                        </div>
                        <div className="review-content">
                          <div className="review-top-wrap">
                            <div className="review-left">
                              <div className="review-name">
                                <h4>White Lewis</h4>
                              </div>
                              <div className="review-rating">
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                              </div>
                            </div>
                            <div className="review-left">
                              <button>
                                {t(`products.desc_tab.buttons.reply`)}
                              </button>
                            </div>
                          </div>
                          <div className="review-bottom">
                            <p>
                              Giày Sneaker này thực sự làm cho tôi ấn tượng từ
                              lần đầu tiên đeo. Chất liệu vải cao cấp và đường
                              may tỉ mỉ tạo nên sự bền bỉ và chất lượng đỉnh
                              cao. Đặc biệt, kết hợp màu sắc tinh tế tạo nên
                              phong cách riêng biệt cho tôi. Đế giữa có độ êm và
                              co giãn, giúp tôi dễ dàng di chuyển mà không gặp
                              khó khăn. Điều mà tôi đánh giá cao nhất chính là
                              sự thoải mái khi đi dài. Đôi Sneaker này không chỉ
                              là một sản phẩm thời trang mà còn là người bạn
                              đồng hành đáng tin cậy trong mọi hoạt động của
                              tôi. Một lựa chọn xuất sắc!
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-5">
                    <div className="ratting-form-wrapper pl-50">
                      <h3>{t(`products.desc_tab.buttons.add_review`)}</h3>
                      <div className="ratting-form">
                        <form action="#">
                          <div className="star-box">
                            <span>
                              {t(`products.desc_tab.fields.your_rating`)}:
                            </span>
                            <div className="ratting-star">
                              <i className="fa fa-star" />
                              <i className="fa fa-star" />
                              <i className="fa fa-star" />
                              <i className="fa fa-star" />
                              <i className="fa fa-star" />
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                              <div className="rating-form-style mb-10">
                                <input
                                  placeholder={
                                    t(`products.desc_tab.fields.name`) || ""
                                  }
                                  type="text"
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="rating-form-style mb-10">
                                <input
                                  placeholder={
                                    t("products.desc_tab.fields.email") || ""
                                  }
                                  type="email"
                                />
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="rating-form-style form-submit">
                                <textarea
                                  name="message"
                                  placeholder={
                                    t(`products.desc_tab.fields.message`) || ""
                                  }
                                  defaultValue={""}
                                />
                                <input
                                  type="submit"
                                  value={
                                    t(`products.desc_tab.buttons.submit`) || ""
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>
    </div>
  );
};

export default ProductDescriptionTab;
