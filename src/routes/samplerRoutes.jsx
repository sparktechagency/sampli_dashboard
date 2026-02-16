import React from "react";
import ContactUs from "../pages/contactUs/ContactUs.jsx";
import PageNotFound from "../pages/pageNotFound/PageNotFound.jsx";
import PrivacyPolicy from "../pages/privacyPolicy/PrivacyPolicy.jsx";
import SamplerHome from "../pages/sampler/SamplerHome/SamplerHome.jsx";
import AllOfferSampler from "../pages/sampler/SamplerHome/components/offer/AllOfferSampler.jsx";
import EarningsSampler from "../pages/sampler/SamplerHome/components/reviewsAndEarnings/EarningsSampler.jsx";
import SamplerReviewer from "../pages/sampler/SamplerHome/components/reviewsAndEarnings/SamplerReviewer.jsx";
import TransactionHistorySampler from "../pages/sampler/SamplerHome/components/reviewsAndEarnings/TransactionHistorySampler.jsx";
import ShipmentAndAlertSampler from "../pages/sampler/SamplerHome/components/shipments/ShipmentAndAlertSampler.jsx";
import MyPurchasesSampler from "../pages/sampler/SamplerHome/components/shipments/components/MyPurchasesSampler.jsx";
import NotificationsSampler from "../pages/sampler/SamplerHome/components/shipments/components/NotificationsSampler.jsx";
import OfferShipmentsSampler from "../pages/sampler/SamplerHome/components/shipments/components/OfferShipmentsSampler.jsx";
import ReturnItemsSampler from "../pages/sampler/SamplerHome/components/shipments/components/ReturnItemsSampler.jsx";
import WishlistSampler from "../pages/sampler/SamplerHome/components/shipments/components/WishlistSampler.jsx";
import OrderSuccessSampler from "../pages/sampler/orderSucess/OrderSuccessSampler.jsx";
import ProductListCheckoutSampler from "../pages/sampler/productListCheckoutSampler/ProductListCheckoutSampler.jsx";
import MyProfileSampler from "../pages/sampler/profile/MyProfileSampler.jsx";
import SamplerFeed from "../pages/sampler/samplerFeed/SamplerFeed.jsx";
import SamplerLayout from "../pages/sampler/samplerLayout/SamplerLayout.jsx";
import SettingsSampler from "../pages/sampler/settings/SettingsSampler.jsx";
import BasicDetailsSettingsSampler from "../pages/sampler/settings/components/basicdetails/BasicDetailsSettingsSampler.jsx";
import NotificationsSettingsSampler from "../pages/sampler/settings/components/notifications/NotificationsSettingsSampler.jsx";
import PreferencesSettingsSampler from "../pages/sampler/settings/components/preferences/PreferencesSettingsSampler.jsx";
import SecuritySettingsSampler from "../pages/sampler/settings/components/security/SecuritySettingsSampler.jsx";
import ServiceWithCategory from "../pages/sampler/shop/serviceWithCategory/ServiceWithCategory.jsx";
import ServiceWithCategoryProductDetails from "../pages/sampler/shop/serviceWithCategoryProductDetails/ServiceWithCategoryProductDetails.jsx";
import ShopHeroPage from "../pages/sampler/shop/shopHeroPage/ShopHeroPage.jsx";
import TermsAndConditions from "../pages/termsAndConditions/TermsAndConditions.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

export const samplerRoutes = {
  path: "/",
  errorElement: <PageNotFound />,
  element: (
    <ProtectedRoute>
      <SamplerLayout />
    </ProtectedRoute>
  ),
  children: [
    { path: "/sampler/campaign", element: <SamplerHome /> },
    { path: "/sampler/campaign/all-offer", element: <AllOfferSampler /> },
    { path: "/sampler/campaign/earnings", element: <EarningsSampler /> },
    {
      path: "/sampler/campaign/transaction-history",
      element: <TransactionHistorySampler />,
    },
    {
      path: "/sampler/campaign/shipments",
      element: <ShipmentAndAlertSampler />,
      children: [
        { path: "offer-shipments", element: <OfferShipmentsSampler /> },
        { path: "my-purchases", element: <MyPurchasesSampler /> },
        { path: "wishlist", element: <WishlistSampler /> },
        { path: "notifications", element: <NotificationsSampler /> },
      ],
    },
    { path: "/sampler/campaign/return-items", element: <ReturnItemsSampler /> },
    {
      path: "/sampler/settings",
      element: <SettingsSampler />,
      children: [
        {
          path: "basic-details-settings-sampler",
          element: <BasicDetailsSettingsSampler />,
        },
        {
          path: "preferences-settings-sampler",
          element: <PreferencesSettingsSampler />,
        },
        {
          path: "security-settings-sampler",
          element: <SecuritySettingsSampler />,
        },
        {
          path: "notifications-settings-sampler",
          element: <NotificationsSettingsSampler />,
        },
      ],
    },
    { path: "/sampler/my-profile", element: <MyProfileSampler /> },
    { path: "/sampler/shop", element: <ShopHeroPage /> },
    { path: `/sampler/shop/:id/:name`, element: <ServiceWithCategory /> },
    { path: `/sampler/review/:id`, element: <SamplerReviewer /> },
    { path: `/sampler/order/success`, element: <OrderSuccessSampler /> },
    {
      path: `/sampler/shop/category/:name/:id`,
      element: <ServiceWithCategoryProductDetails />,
    },
    { path: `/sampler/feed`, element: <SamplerFeed /> },
    { path: `/sampler/checkout`, element: <ProductListCheckoutSampler /> },
    { path: "/terms-and-conditions", element: <TermsAndConditions /> },
    { path: "/contact-us", element: <ContactUs /> },
    { path: "/privacy-policy", element: <PrivacyPolicy /> },
  ],
};
