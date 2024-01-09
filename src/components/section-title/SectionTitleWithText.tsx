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
            Anh Đức nghĩ cho em văn đoạn này phát, consectetur adipisicing elit,
            sed do eiusmod tempor incididunt labor et dolore magna aliqua. Ut
            enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
            ut aliquip ex ea commo consequat irure{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SectionTitleWithText;
