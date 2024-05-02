import clsx from "clsx";

type SectionTitleWithTextProps = {
  spaceBottomClass: string;
  spaceTopClass: string;
};

const SectionTitleWithText: React.FC<SectionTitleWithTextProps> = ({
  spaceTopClass,
  spaceBottomClass,
}) => {
  return (
    <div className={clsx("welcome-area", spaceTopClass, spaceBottomClass)}>
      <div className="container">
        <div className="welcome-content text-center">
          <h5>Chúng tôi là ai</h5>
          <h1>Chào mừng đến stepupsneaker</h1>
          <p>
            Một cửa hàng sneaker tốt cần cung cấp một loạt các sản phẩm từ nhiều
            thương hiệu khác nhau và trong nhiều phân khúc giá. Điều này giúp
            thu hút một đối tượng rộng lớn khách hàng và tạo ra sự lựa chọn cho
            họ.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SectionTitleWithText;
