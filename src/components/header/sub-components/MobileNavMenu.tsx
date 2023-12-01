import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const MobileNavMenu = () => {
  const { t } = useTranslation();

  return (
    <nav className="offcanvas-navigation" id="offcanvas-navigation">
      <ul>
        <li className="menu-item-has-children">
          <Link to={"/"}>{t("home")}</Link>
          <ul className="sub-menu">
            <li className="menu-item-has-children">
              <Link to={"/"}>{t("home_group_one")}</Link>
              <ul className="sub-menu">
                <li>
                  <Link to={"/home-fashion"}>{t("home_fashion")}</Link>
                </li>
                <li>
                  <Link to={"/home-fashion-two"}>{t("home_fashion_two")}</Link>
                </li>
                <li>
                  <Link to={"/home-fashion-three"}>
                    {t("home_fashion_three")}
                  </Link>
                </li>
                <li>
                  <Link to={"/home-fashion-four"}>
                    {t("home_fashion_four")}
                  </Link>
                </li>
                <li>
                  <Link to={"/home-fashion-five"}>
                    {t("home_fashion_five")}
                  </Link>
                </li>
                <li>
                  <Link to={"/home-fashion-six"}>{t("home_fashion_six")}</Link>
                </li>
                <li>
                  <Link to={"/home-fashion-seven"}>
                    {t("home_fashion_seven")}
                  </Link>
                </li>
                <li>
                  <Link to={"/home-fashion-eight"}>
                    {t("home_fashion_eight")}
                  </Link>
                </li>
                <li>
                  <Link to={"/home-kids-fashion"}>
                    {t("home_kids_fashion")}
                  </Link>
                </li>
                <li>
                  <Link to={"/home-cosmetics"}>{t("home_cosmetics")}</Link>
                </li>
                <li>
                  <Link to={"/home-furniture"}>{t("home_furniture")}</Link>
                </li>
                <li>
                  <Link to={"/home-furniture-two"}>
                    {t("home_furniture_two")}
                  </Link>
                </li>
                <li>
                  <Link to={"/home-furniture-three"}>
                    {t("home_furniture_three")}
                  </Link>
                </li>
                <li>
                  <Link to={"/home-furniture-four"}>
                    {t("home_furniture_four")}
                  </Link>
                </li>
              </ul>
            </li>
            <li className="menu-item-has-children">
              <Link to={"/"}>{t("home_group_two")}</Link>
              <ul className="sub-menu">
                <li>
                  <Link to={"/home-furniture-five"}>
                    {t("home_furniture_five")}
                  </Link>
                </li>
                <li>
                  <Link to={"/home-furniture-six"}>
                    {t("home_furniture_six")}
                  </Link>
                </li>
                <li>
                  <Link to={"/home-furniture-seven"}>
                    {t("home_furniture_seven")}
                  </Link>
                </li>
                <li>
                  <Link to={"/home-electronics"}>{t("home_electronics")}</Link>
                </li>
                <li>
                  <Link to={"/home-electronics-two"}>
                    {t("home_electronics_two")}
                  </Link>
                </li>
                <li>
                  <Link to={"/home-electronics-three"}>
                    {t("home_electronics_three")}
                  </Link>
                </li>
                <li>
                  <Link to={"/home-book-store"}>{t("home_book_store")}</Link>
                </li>
                <li>
                  <Link to={"/home-book-store-two"}>
                    {t("home_book_store_two")}
                  </Link>
                </li>
                <li>
                  <Link to={"/home-plants"}>{t("home_plants")}</Link>
                </li>
                <li>
                  <Link to={"/home-flower-shop"}>{t("home_flower_shop")}</Link>
                </li>
                <li>
                  <Link to={"/home-flower-shop-two"}>
                    {t("home_flower_shop_two")}
                  </Link>
                </li>
                <li>
                  <Link to={"/home-organic-food"}>
                    {t("home_organic_food")}
                  </Link>
                </li>
                <li>
                  <Link to={"/home-organic-food-two"}>
                    {t("home_organic_food_two")}
                  </Link>
                </li>
                <li>
                  <Link to={"/home-onepage-scroll"}>
                    {t("home_onepage_scroll")}
                  </Link>
                </li>
              </ul>
            </li>
            <li className="menu-item-has-children">
              <Link to={"/"}>{t("home_group_three")}</Link>
              <ul className="sub-menu">
                <li>
                  <Link to={"/home-grid-banner"}>{t("home_grid_banner")}</Link>
                </li>
                <li>
                  <Link to={"/home-auto-parts"}>{t("home_auto_parts")}</Link>
                </li>
                <li>
                  <Link to={"/home-cake-shop"}>{t("home_cake_shop")}</Link>
                </li>
                <li>
                  <Link to={"/home-handmade"}>{t("home_handmade")}</Link>
                </li>
                <li>
                  <Link to={"/home-pet-food"}>{t("home_pet_food")}</Link>
                </li>
                <li>
                  <Link to={"/home-medical-equipment"}>
                    {t("home_medical_equipment")}
                  </Link>
                </li>
                <li>
                  <Link to={"/home-christmas"}>{t("home_christmas")}</Link>
                </li>
                <li>
                  <Link to={"/home-black-friday"}>
                    {t("home_black_friday")}
                  </Link>
                </li>
                <li>
                  <Link to={"/home-black-friday-two"}>
                    {t("home_black_friday_two")}
                  </Link>
                </li>
                <li>
                  <Link to={"/home-valentines-day"}>
                    {t("home_valentines_day")}
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </li>

        <li className="menu-item-has-children">
          <Link to={"/shop"}>{t("shop")}</Link>
          <ul className="sub-menu">
            <li className="menu-item-has-children">
              <Link to={"/shop"}>{t("shop_layout")}</Link>
              <ul className="sub-menu">
                <li>
                  <Link to={"/shop"}>{t("shop_grid_standard")}</Link>
                </li>
                <li>
                  <Link to={"/shop-grid-filter"}>{t("shop_grid_filter")}</Link>
                </li>
                <li>
                  <Link to={"/shop-grid-two-column"}>
                    {t("shop_grid_two_column")}
                  </Link>
                </li>
                <li>
                  <Link to={"/shop-grid-no-sidebar"}>
                    {t("shop_grid_no_sidebar")}
                  </Link>
                </li>
                <li>
                  <Link to={"/shop-grid-full-width"}>
                    {t("shop_grid_full_width")}
                  </Link>
                </li>
                <li>
                  <Link to={"/shop-grid-right-sidebar"}>
                    {t("shop_grid_right_sidebar")}
                  </Link>
                </li>
                <li>
                  <Link to={"/shop-list-standard"}>
                    {t("shop_list_standard")}
                  </Link>
                </li>
                <li>
                  <Link to={"/shop-list-full-width"}>
                    {t("shop_list_full_width")}
                  </Link>
                </li>
                <li>
                  <Link to={"/shop-list-two-column"}>
                    {t("shop_list_two_column")}
                  </Link>
                </li>
              </ul>
            </li>
            <li className="menu-item-has-children">
              <Link to={"/product/1"}>{t("product_details")}</Link>
              <ul className="sub-menu">
                <li>
                  <Link to={"/product/1"}>{t("product_tab_bottom")}</Link>
                </li>
                <li>
                  <Link to={"/product-tab-left/1"}>
                    {t("product_tab_left")}
                  </Link>
                </li>
                <li>
                  <Link to={"/product-tab-right/1"}>
                    {t("product_tab_right")}
                  </Link>
                </li>
                <li>
                  <Link to={"/product-sticky/1"}>{t("product_sticky")}</Link>
                </li>
                <li>
                  <Link to={"/product-slider/1"}>{t("product_slider")}</Link>
                </li>
                <li>
                  <Link to={"/product-fixed-image/1"}>
                    {t("product_fixed_image")}
                  </Link>
                </li>
                <li>
                  <Link to={"/product/1"}>{t("product_simple")}</Link>
                </li>
                <li>
                  <Link to={"/product/1"}>{t("product_variation")}</Link>
                </li>
                <li>
                  <Link to={"/product/1"}>{t("product_affiliate")}</Link>
                </li>
              </ul>
            </li>
          </ul>
        </li>
        <li>
          <Link to={"/shop"}>{t("collection")}</Link>
        </li>
        <li className="menu-item-has-children">
          <Link to={"/"}>{t("pages")}</Link>
          <ul className="sub-menu">
            <li>
              <Link to={"/cart"}>{t("cart")}</Link>
            </li>
            <li>
              <Link to={"/checkout"}>{t("checkout")}</Link>
            </li>
            <li>
              <Link to={"/wishlist"}>{t("wishlist")}</Link>
            </li>
            <li>
              <Link to={"/compare"}>{t("compare")}</Link>
            </li>
            <li>
              <Link to={"/my-account"}>{t("my_account")}</Link>
            </li>
            <li>
              <Link to={"/login"}>{t("login_register")}</Link>
            </li>
            <li>
              <Link to={"/about"}>{t("about_us")}</Link>
            </li>
            <li>
              <Link to={"/contact"}>{t("contact_us")}</Link>
            </li>
            <li>
              <Link to={"/not-found"}>{t("404_page")}</Link>
            </li>
          </ul>
        </li>
        <li className="menu-item-has-children">
          <Link to={"/blog-standard"}>{t("blog")}</Link>
          <ul className="sub-menu">
            <li>
              <Link to={"/blog-standard"}>{t("blog_standard")}</Link>
            </li>
            <li>
              <Link to={"/blog-no-sidebar"}>{t("blog_no_sidebar")}</Link>
            </li>
            <li>
              <Link to={"/blog-right-sidebar"}>{t("blog_right_sidebar")}</Link>
            </li>
            <li>
              <Link to={"/blog-details-standard"}>
                {t("blog_details_standard")}
              </Link>
            </li>
          </ul>
        </li>
        <li>
          <Link to={"/contact"}>{t("contact_us")}</Link>
        </li>
      </ul>
    </nav>
  );
};

export default MobileNavMenu;
