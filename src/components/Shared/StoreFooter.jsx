import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaTwitter,
} from "react-icons/fa";
import { Link } from "react-router-dom";

function StoreFooter() {
  return (
    <div className="border-t h-24 overflow-hidden border-[#eee] text-gray-700 mt-12!">
      <div className="mx-auto px-2 responsive-width  md:px-10 pt-5 flex md:flex-row flex-col justify-between items-start md:items-center ">
        <ul className="flex md:flex-row text-sm md:text-sm flex-col justify-center gap-4">
          <li>
            <Link
              to="/privacy-policy"
              className="hover:text-black transition-all"
            >
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link
              to="/terms-and-conditions"
              className="hover:text-black transition-all"
            >
              Terms of Use
            </Link>
          </li>
          <li>
            <Link
              to="/affiliate-program"
              className="hover:text-black transition-all"
            >
              Affiliate program
            </Link>
          </li>
          <li>
            <Link to="/contact-us" className="hover:text-black transition-all">
              Contact Us
            </Link>
          </li>
        </ul>

        <p className="md:block hidden">
          © {new Date().getFullYear()} Sampli. All Rights Reserved.
        </p>
      </div>

      <div className="pl-2 flex items-start md:items-center justify-start md:justify-center pb-5 text-[#BBC9C8] gap-7  text-2xl transition-all= ">
        <FaFacebook className="hover:text-blue-600 cursor-pointer transition-all" />
        <FaInstagram className="hover:text-pink-500 cursor-pointer transition-all" />
        <FaLinkedin className="hover:text-blue-700 cursor-pointer transition-all" />
        <FaTiktok className="hover:text-black cursor-pointer transition-all" />
        <FaTwitter className="hover:text-blue-400 cursor-pointer transition-all" />
      </div>
      <p className="pl-2 block md:text-center md:hidden">
        © {new Date().getFullYear()} Sampli. All Rights Reserved.
      </p>
    </div>
  );
}

export default StoreFooter;
