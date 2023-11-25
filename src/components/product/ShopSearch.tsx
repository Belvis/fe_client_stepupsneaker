import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ShopSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Chuyển tham số 'q' lên URL
    navigate("/shop?q=hehe");
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="sidebar-widget">
      <h4 className="pro-sidebar-title">Tìm kiếm</h4>
      <div className="pro-sidebar-search mb-50 mt-25">
        <form className="pro-sidebar-search-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="q"
            placeholder="Nhập từ khoá tại đây..."
            value={searchTerm}
            onChange={handleChange}
          />
          <button type="submit">
            <i className="pe-7s-search" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShopSearch;
