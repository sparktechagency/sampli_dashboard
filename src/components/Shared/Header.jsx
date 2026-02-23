/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Avatar, Button, Dropdown, Menu, Badge } from "antd";
import { CiHeart, CiStar } from "react-icons/ci";
import { IoMdArrowDropdown, IoMdNotificationsOutline } from "react-icons/io";
import {
  UserOutlined,
  SettingOutlined,
  WalletOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import brandlogo from "../../assets/logo/BrandLogo.svg";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { GrNotes } from "react-icons/gr";
import {
  MdOutlineAttachMoney,
  MdRssFeed,
} from "react-icons/md";
import ShoppingCartSampler from "../../pages/sampler/shoppingCartSampler/ShoppingCartSampler";
import campaignIcon from "../../assets/campaign.svg";
import feedInactive from "../../assets/cam.svg";
import feedActive from "../../assets/feedAc.svg";
import campaignInActive from "../../assets/campaignInActive.svg";
import shopIcon from "../../assets/shopIcon.png";
import shopInActive from "../../assets/shopInActive.svg";
import { jwtDecode } from "jwt-decode";
import { useGetProfileQuery } from "../../Redux/businessApis/business _profile/getprofileApi";
import { useGetReviewerProfileQuery } from "../../Redux/sampler/reviewerProfileApis";

function Header() {
  const token = localStorage.getItem("token");
  const { data: profile, isLoading } = useGetProfileQuery();
  const { data: reviewerProfile, isLoading: reviewerProfileLoading } =
    useGetReviewerProfileQuery();
  let decode;
  if (token) {
    decode = jwtDecode(localStorage.getItem("token"));
  }

  const [userType, setUserType] = useState(decode?.role); // sampler, business
  // const [show, setShow] = useState(true);
  const user = {
    photoURL:
      profile?.data?.logo ||
      "https://cdn-icons-png.flaticon.com/512/219/219988.png",
    displayName: profile?.data?.bussinessName || "Guest User",
    email: profile?.data?.email || "guest@User.com",
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    if (window !== undefined) {
      window.location.reload();
    }
  };

  const menu = (
    <Menu className="w-fit rounded-xl shadow-lg">
      <div className="p-4 flex items-center gap-3">
        <Avatar size={48} src={user?.photoURL} />
        <div>
          <h1 className="font-semibold text-base">{user?.displayName}</h1>
          <h1 className="font-normal opacity-75 text-sm">{user?.email}</h1>
        </div>
      </div>
      <Menu.Divider />
      <Menu.Item key="1" icon={<UserOutlined />}>
        <Link to="/store-profile">Store Profile</Link>
      </Menu.Item>
      <Menu.Item key="2" icon={<SettingOutlined />}>
        <Link to="/settings">Settings</Link>
      </Menu.Item>
      <Menu.Item key="3" icon={<WalletOutlined />}>
        <Link to="/business/transaction-balance">Balance</Link>
      </Menu.Item>
      <Menu.Item
        className="md:block hidden"
        key="4"
        icon={<IoMdNotificationsOutline />}
      >
        <Link to="/all-notifications">Notification</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="5" icon={<LogoutOutlined />} onClick={handleSignOut}>
        Log out
      </Menu.Item>
      {/* <div className="text-center text-gray-400 text-sm p-2">v1.10</div> */}
    </Menu>
  );
  const menuSampler = (
    <Menu className="w-64 rounded-xl shadow-lg">
      <div className="px-3 py-2">
        <div className="flex items-center gap-1 justify-start">
          <Avatar
            src={reviewerProfile?.data?.profile_image}
            className="!w-12 !h-12"
          />
          <h1 className="font-semibold text-base">
            {reviewerProfile?.data?.name}
          </h1>
        </div>
        <div className="font-bold">
          <h1 className="font-bold opacity-75 text-sm">
            {reviewerProfile?.data?.email}
          </h1>
        </div>
      </div>
      <Menu.Divider />
      <Menu.Item key="1" icon={<UserOutlined />} className="!text-gray-500">
        <Link to="/sampler/my-profile">My Profile</Link>
      </Menu.Item>
      <Menu.Item key="2" icon={<SettingOutlined />} className="!text-gray-500">
        <Link to="/sampler/settings/basic-details-settings-sampler">
          Settings
        </Link>
      </Menu.Item>
      <Menu.Item key="3" icon={<GrNotes />} className="!text-gray-500">
        <Link to="/sampler/campaign/shipments/offer-shipments">My orders</Link>
      </Menu.Item>
      <Menu.Item key="4" icon={<CiHeart />} className="!text-gray-500">
        <Link to="/sampler/campaign/shipments/wishlist">Wishlist</Link>
      </Menu.Item>
      <Menu.Item key="5" icon={<CiStar />} className="!text-gray-500">
        <Link to="/sampler/my-profile">My Reviews</Link>
      </Menu.Item>
      <Menu.Item
        key="6"
        icon={<MdOutlineAttachMoney />}
        className="!text-gray-500"
      >
        <Link to="/sampler/campaign/earnings">My earnings</Link>
      </Menu.Item>
      <Menu.Item
        key="7"
        icon={<LogoutOutlined />}
        onClick={handleSignOut}
        className="!text-gray-500"
      >
        Log out
      </Menu.Item>
    </Menu>
  );

  const location = useLocation();
  // const getLinkClass = (path) => location.pathname === path && 'text-blue-600'
  const getLinkClass = (path) =>
    location.pathname.startsWith(path) ? "text-blue-600" : "text-gray-500";

  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);

      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  const navItems = [
    {
      to: "/sampler/campaign",
      icon: location.pathname.startsWith("/sampler/campaign") ? (
        <img src={campaignIcon} alt="campaignActive" className="w-5 h-5" />
      ) : (
        <img
          src={campaignInActive}
          alt="campaignInActive"
          className="w-5 h-5"
        />
      ),
      text: "Campaign",
    },
    {
      to: "/sampler/feed",
      icon: <MdRssFeed className="w-5 h-5 " />,
      text: "Feed",
    },
    {
      to: "/sampler/shop",
      icon: location.pathname.startsWith("/sampler/shop") ? (
        <img src={shopIcon} alt="shopActive" className="w-5 h-5" />
      ) : (
        <img src={shopInActive} alt="shopInActive" className="w-5 h-5" />
      ),
      text: "Shop",
    },
  ];

  return (
    <div>
      {/* Hosain part */}
      {userType !== "reviewer" ? (
        <div className="px-2 border-b-[1px] border-[#eee]  h-16 flex justify-between items-center">
          <Link to={"/business-dashboard"}>
            <img src={brandlogo} alt="brand logo" />
          </Link>
          <div className="flex items-center gap-4 text-2xl">
            {/* <Button shape="circle" className="!p-0 !m-0">
              <BsQuestionLg />
            </Button> */}
            <Link
              to="/all-notifications"
              className="hover:scale-120 hidden md:block transition-all  "
            >
              <Badge dot={false}>
                <Button shape="circle">
                  <IoMdNotificationsOutline />
                </Button>
              </Badge>
            </Link>
            <div className="flex items-center">
              <Dropdown
                overlay={menu}
                trigger={["click"]}
                placement="bottomRight"
              >
                <Avatar
                  size={40}
                  src={user?.photoURL}
                  className="cursor-pointer hover:scale-110 transition-all"
                />
              </Dropdown>
              {/* <IoMdArrowDropdown className="!text-[#6D7486B2]" /> */}
            </div>
          </div>
        </div>
      ) : (
        // Ahsan Mahfuz part
        <>
          {/* Top navbar */}
          <div
            // className={`fixed w-full top-0 left-0 z-50 transition-transform duration-300 ${visible ? "translate-y-0" : "-translate-y-full"
            //   }`}
            className={`fixed w-full top-0 left-0 z-50 transition-transform duration-300`}
          >
            <div className="px-10 border-b-[1px] border-[#eee] h-16 flex justify-between items-center bg-white container mx-auto">
              <Link to={"/sampler/campaign"}>
                <img src={brandlogo} alt="brand logo" />
              </Link>
              {/* Navigation links - visible on screens larger than 48rem */}
              <div className="hidden md:flex gap-20 text-gray-600">
                <Link
                  to={"/sampler/campaign"}
                  className={`hover:text-black transition-all ${getLinkClass(
                    "/sampler/campaign"
                  )}`}
                >
                  <div className="flex gap-2">
                    {location.pathname.startsWith("/sampler/campaign") ? (
                      <img
                        src={campaignIcon}
                        alt="campaignActive"
                        className="w-[17px]"
                      />
                    ) : (
                      <img
                        src={campaignInActive}
                        alt="campaignInActive"
                        className="w-[17px]"
                      />
                    )}
                    Campaign
                  </div>
                </Link>
                <Link
                  to={"/sampler/feed"}
                  className={`hover:text-black transition-all ${getLinkClass(
                    "/sampler/feed"
                  )}`}
                >
                  <div className="flex gap-2 items-center justify-center ">
                    {location.pathname.startsWith("/sampler/feed") ? (
                      <img
                        src={feedActive}
                        alt="feedActive"
                        className="w-[17px]"
                      />
                    ) : (
                      <img
                        src={feedInactive}
                        alt="feedInActive"
                        className="w-[17px]"
                      />
                    )}
                    <div className="pt-0.5">Feed</div>
                  </div>
                </Link>
                <Link
                  to={"/sampler/shop"}
                  className={`hover:text-black transition-all ${getLinkClass(
                    "/sampler/shop"
                  )}`}
                >
                  <div className="flex gap-2">
                    {location.pathname.startsWith("/sampler/shop") ? (
                      <img
                        src={shopIcon}
                        alt="shopActive"
                        className="w-[17px]"
                      />
                    ) : (
                      <img
                        src={shopInActive}
                        alt="shopInActive"
                        className="w-[17px]"
                      />
                    )}
                    Shop
                  </div>
                </Link>
              </div>
              <div className="flex items-center gap-6 text-2xl">
                <Link
                  to="/sampler/checkout"
                  className="hover:scale-110 transition-all"
                >
                  <ShoppingCartSampler className="hover:text-black text-gray-600! transition-all" />
                </Link>
                <Link
                  to="/sampler/campaign/shipments/notifications"
                  className="hover:scale-110 transition-all"
                >
                  <IoMdNotificationsOutline className="hover:text-black text-gray-600! transition-all" />
                </Link>
                <Dropdown
                  overlay={menuSampler}
                  trigger={["click"]}
                  placement="bottomRight"
                >
                  <Avatar
                    size={40}
                    src={reviewerProfile?.data?.profile_image}
                    className="cursor-pointer hover:scale-110 transition-all bg-gray-500"
                  />
                </Dropdown>
              </div>
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 flex md:hidden justify-around items-center bg-white shadow-md border-t border-gray-200 z-50 py-3 ">
            {navItems.map((item) => (
              <Link
                key={item.to}
                className={`flex flex-col items-center text-xs ${location.pathname.startsWith(item.to)
                  ? "text-blue-600"
                  : "text-gray-600"
                  }`}
                to={item.to}
              >
                {item.icon}
                <span className="mt-1">{item.text}</span>
              </Link>
            ))}
          </div>

          <div className="md:hidden "></div>
        </>
      )}
    </div>
  );
}

export default Header;