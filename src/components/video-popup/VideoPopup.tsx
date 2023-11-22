import React, { useState } from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";
import ModalVideo from "react-modal-video";
import { useTranslation } from "react-i18next";

type VideoPopupProps = {
  spaceBottomClass?: string;
};

const VideoPopup: React.FC<VideoPopupProps> = ({ spaceBottomClass }) => {
  const { t } = useTranslation();

  const [modalStatus, isOpen] = useState(false);

  return (
    <div className={clsx("video-popup", spaceBottomClass, "bg-white")}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="video-popup__image">
              <img
                src={"images/banner/banner-03.jpg"}
                alt=""
                className="img-fluid"
              />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="video-popup__content">
              <h2 className="title mb-30">{t(`video-popup.content.title`)}</h2>
              <p className="text mb-30">{t(`video-popup.content.subtitle`)}</p>
              <div className="link mb-30">
                <Link to={"/about"}>{t(`video-popup.buttons.more`)}</Link>
              </div>
              <ModalVideo
                channel="youtube"
                isOpen={modalStatus}
                videoId="feOScd2HdiU"
                onClose={() => isOpen(false)}
              />
              <button onClick={() => isOpen(true)}>
                <i className="fa fa-play-circle"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPopup;
