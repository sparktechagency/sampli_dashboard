import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { store } from "./Redux/main/store.js";
import { router } from "./routes/Routes.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <GoogleOAuthProvider clientId="196782660552-0mh8i2e6l9sev66qjm9v6fhq4aqgiull.apps.googleusercontent.com">
          <Toaster position="top-center" />
          <RouterProvider router={router} />
        </GoogleOAuthProvider>
      </HelmetProvider>
    </Provider>
  </React.StrictMode>
);
