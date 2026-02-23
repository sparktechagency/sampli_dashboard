import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Shared/Sidebar.jsx";
import Header from "../components/Shared/Header.jsx";
import StoreFooter from "../components/Shared/StoreFooter.jsx";
import Bottombar from "../components/Shared/Bottombar.jsx";

const MainLayout = () => {
  const location = useLocation();
  const path = location.pathname;
  const currentPath =
    path === "/store-profile" || path === "/all-notifications";
  if (currentPath) {
    return (
      <>
        <Header />
        <div>
          <Outlet />
        </div>
        <StoreFooter />
      </>
    );
  }
  return (
    <div className="h-screen">
      <Header />
      <div className="xl:h-[calc(100%-64px)] xl:overflow-hidden xl:flex bg-(--black-100)">
        {/* Sidebar */}

        <div className="sidebar scrollbar xl:block hidden sm:w-[200px] xl:w-[300px] h-full p-4 overflow-y-scroll bg-[#f8f8fa]">
          <Sidebar />
        </div>
        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex-1 w-full md:p-8 px-2 pb-12 overflow-y-scroll">
            <Outlet />
          </div>
        </div>
      </div>
      <Bottombar />
    </div>
  );
};

export default MainLayout;
