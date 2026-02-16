import React from "react";
console.log(React.version);

import logo from "../../assets/logo/logo.svg";
const SpinLoader = ({ message }) => {
  return (
  <div className="flex items-center justify-center h-screen">
        <img className="w-16 h-16 object-contain animate-spin animation: 2s linear infinite" src={logo} alt="sampli-logo" />
      </div>
  );
};

export default SpinLoader;
