import React, { lazy } from "react";
import PageNotFound from "../pages/pageNotFound/PageNotFound.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

// Lazy load all components
const ContactUs = lazy(() => import("../pages/contactUs/ContactUs.jsx"));
const PrivacyPolicy = lazy(() => import("../pages/privacyPolicy/PrivacyPolicy.jsx"));
const SamplerHome = lazy(() => import("../pages/sampler/SamplerHome/SamplerHome.jsx"));
const AllOfferSampler = lazy(() => import("../pages/sampler/SamplerHome/components/offer/AllOfferSampler.jsx"));
const EarningsSampler = lazy(() => import("../pages/sampler/SamplerHome/components/reviewsAndEarnings/EarningsSampler.jsx"));
const SamplerReviewer = lazy(() => import("../pages/sampler/SamplerHome/components/reviewsAndEarnings/SamplerReviewer.jsx"));
const TransactionHistorySampler = lazy(() => import("../pages/sampler/SamplerHome/components/reviewsAndEarnings/TransactionHistorySampler.jsx"));
const ShipmentAndAlertSampler = lazy(() => import("../pages/sampler/SamplerHome/components/shipments/ShipmentAndAlertSampler.jsx"));
const MyPurchasesSampler = lazy(() => import("../pages/sampler/SamplerHome/components/shipments/components/MyPurchasesSampler.jsx"));
const NotificationsSampler = lazy(() => import("../pages/sampler/SamplerHome/components/shipments/components/NotificationsSampler.jsx"));
const OfferShipmentsSampler = lazy(() => import("../pages/sampler/SamplerHome/components/shipments/components/OfferShipmentsSampler.jsx"));
const ReturnItemsSampler = lazy(() => import("../pages/sampler/SamplerHome/components/shipments/components/ReturnItemsSampler.jsx"));
const WishlistSampler = lazy(() => import("../pages/sampler/SamplerHome/components/shipments/components/WishlistSampler.jsx"));
const OrderSuccessSampler = lazy(() => import("../pages/sampler/orderSucess/OrderSuccessSampler.jsx"));
const ProductListCheckoutSampler = lazy(() => import("../pages/sampler/productListCheckoutSampler/ProductListCheckoutSampler.jsx"));
const MyProfileSampler = lazy(() => import("../pages/sampler/profile/MyProfileSampler.jsx"));
const SamplerFeed = lazy(() => import("../pages/sampler/samplerFeed/SamplerFeed.jsx"));
const SamplerLayout = lazy(() => import("../pages/sampler/samplerLayout/SamplerLayout.jsx"));
const SettingsSampler = lazy(() => import("../pages/sampler/settings/SettingsSampler.jsx"));
const BasicDetailsSettingsSampler = lazy(() => import("../pages/sampler/settings/components/basicdetails/BasicDetailsSettingsSampler.jsx"));
const NotificationsSettingsSampler = lazy(() => import("../pages/sampler/settings/components/notifications/NotificationsSettingsSampler.jsx"));
const PreferencesSettingsSampler = lazy(() => import("../pages/sampler/settings/components/preferences/PreferencesSettingsSampler.jsx"));
const SecuritySettingsSampler = lazy(() => import("../pages/sampler/settings/components/security/SecuritySettingsSampler.jsx"));
const ServiceWithCategory = lazy(() => import("../pages/sampler/shop/serviceWithCategory/ServiceWithCategory.jsx"));
const ServiceWithCategoryProductDetails = lazy(() => import("../pages/sampler/shop/serviceWithCategoryProductDetails/ServiceWithCategoryProductDetails.jsx"));
const ShopHeroPage = lazy(() => import("../pages/sampler/shop/shopHeroPage/ShopHeroPage.jsx"));
const TermsAndConditions = lazy(() => import("../pages/termsAndConditions/TermsAndConditions.jsx"));

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