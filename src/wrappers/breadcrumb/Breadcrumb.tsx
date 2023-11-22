import React from "react";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { useTranslation } from "react-i18next";
import { LinkContainer } from "react-router-bootstrap";

type Page = {
  label: string;
  path: string;
};

type BreadcrumbWrapProps = {
  pages: Page[];
};

const BreadcrumbWrap: React.FC<BreadcrumbWrapProps> = ({ pages }) => {
  const { t } = useTranslation();

  return (
    <div className="breadcrumb-area pt-35 pb-35 bg-gray-3">
      <div className="container">
        <Breadcrumb>
          {pages?.map(({ path, label }, i) =>
            i !== pages.length - 1 ? (
              <LinkContainer key={label} to={path}>
                <Breadcrumb.Item linkProps={{ to: path }}>
                  {t(`nav.${label}`)}
                </Breadcrumb.Item>
              </LinkContainer>
            ) : (
              <Breadcrumb.Item key={label} active>
                {t(`nav.${label}`)}
              </Breadcrumb.Item>
            )
          )}
        </Breadcrumb>
      </div>
    </div>
  );
};

export default BreadcrumbWrap;
