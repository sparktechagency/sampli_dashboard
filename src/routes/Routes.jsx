// import React from "react";
// import { createBrowserRouter } from "react-router-dom";
// import Layout from "../components/Layout"; // Import Layout
// import Otp from "../pages/auth/Otp.jsx";
// import Login from "../pages/auth/Login.jsx";
// import Register from "../pages/auth/Register.jsx";
// import ResetPassword from "../pages/auth/ResetPassword.jsx";
// import ForgetPassword from "../pages/auth/ForgetPassword.jsx";
// import UserInfo from "../components/ui/UserInfo.jsx";
// import ContactInfo from "../components/ui/ContactInfo";
// import ComplianceInfo from "../components/ui/ComplianceInfo.jsx";
// import BusinessInfoForm from "../components/ui/BusinessInfoForm.jsx";
// import ChooseRole from "../pages/sampler/chooseRole/ChooseRole.jsx";
// import Signup from "../pages/sampler/signup/Signup.jsx";
// import SignUpOtp from "../pages/sampler/signup/SignUpOtp.jsx";
// import SignUpMoreInformation from "../pages/sampler/signup/SignUpMoreInformation.jsx";
// import SelectAllCategories from "../pages/sampler/signup/selectCategories/SelectAllCategories.jsx";
// import { businessRoutes } from "./businessRoutes.jsx";
// import { samplerRoutes } from "./samplerRoutes.jsx";
// import BusinessSendOtp from "../pages/Business/business_auth/BusinessSendOtp.jsx";

// export const router = createBrowserRouter([
//   {
//     element: <Layout />,
//     children: [
//       businessRoutes,
//       samplerRoutes,

//       // shared/auth routes
//       { path: "/otp", element: <Otp /> },
//       { path: "/login", element: <Login /> },
//       { path: "/signup/business", element: <Register /> },
//       { path: "/user-info", element: <UserInfo /> },
//       { path: "/contact-info", element: <ContactInfo /> },
//       { path: "/compliance-info", element: <ComplianceInfo /> },
//       { path: "/reset-password", element: <ResetPassword /> },
//       { path: "/business-info", element: <BusinessInfoForm /> },
//       { path: "/forgot-password", element: <ForgetPassword /> },

//       // sampler signup flow
//       { path: "/choose-role", element: <ChooseRole /> },
//       { path: "/signup/reviewer", element: <Signup /> },
//       { path: "/sign-up-otp", element: <SignUpOtp /> },
//       { path: "/sign-up-more-info", element: <SignUpMoreInformation /> },
//       {
//         path: "/sign-up-select-all-categories",
//         element: <SelectAllCategories />,
//       },
//       { path: "/business/otp", element: <BusinessSendOtp /> },
//     ],
//   },
// ]);




import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";

const Otp = lazy(() => import("../pages/auth/Otp.jsx"));
const Login = lazy(() => import("../pages/auth/Login.jsx"));
const Register = lazy(() => import("../pages/auth/Register.jsx"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword.jsx"));
const ForgetPassword = lazy(() => import("../pages/auth/ForgetPassword.jsx"));

const UserInfo = lazy(() => import("../components/ui/UserInfo.jsx"));
const ContactInfo = lazy(() => import("../components/ui/ContactInfo.jsx"));
const ComplianceInfo = lazy(() => import("../components/ui/ComplianceInfo.jsx"));
const BusinessInfoForm = lazy(() => import("../components/ui/BusinessInfoForm.jsx"));

const ChooseRole = lazy(() => import("../pages/sampler/chooseRole/ChooseRole.jsx"));
const Signup = lazy(() => import("../pages/sampler/signup/Signup.jsx"));
const SignUpOtp = lazy(() => import("../pages/sampler/signup/SignUpOtp.jsx"));
const SignUpMoreInformation = lazy(() =>
  import("../pages/sampler/signup/SignUpMoreInformation.jsx")
);
const SelectAllCategories = lazy(() =>
  import("../pages/sampler/signup/selectCategories/SelectAllCategories.jsx")
);

const BusinessSendOtp = lazy(() =>
  import("../pages/Business/business_auth/BusinessSendOtp.jsx")
);

const businessRoutes = lazy(() => import("./businessRoutes.jsx"));
const samplerRoutes = lazy(() => import("./samplerRoutes.jsx"));


export const router = createBrowserRouter([
  {
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Layout />
      </Suspense>
    ),

    children: [
      // shared/auth routes
      { path: "/", element: <Login /> },
      { path: "/login", element: <Login /> },
      { path: "/otp", element: <Otp /> },
      { path: "/signup/business", element: <Register /> },
      { path: "/user-info", element: <UserInfo /> },
      { path: "/contact-info", element: <ContactInfo /> },
      { path: "/compliance-info", element: <ComplianceInfo /> },
      { path: "/reset-password", element: <ResetPassword /> },
      { path: "/business-info", element: <BusinessInfoForm /> },
      { path: "/forgot-password", element: <ForgetPassword /> },

      // sampler signup flow
      { path: "/choose-role", element: <ChooseRole /> },
      { path: "/signup/reviewer", element: <Signup /> },
      { path: "/sign-up-otp", element: <SignUpOtp /> },
      {
        path: "/sign-up-more-info",
        element: <SignUpMoreInformation />,
      },
      {
        path: "/sign-up-select-all-categories",
        element: <SelectAllCategories />,
      },

      { path: "/business/otp", element: <BusinessSendOtp /> },
    ],
  },
]);
