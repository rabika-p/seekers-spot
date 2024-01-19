import { useState } from "react";

const Logo = () => {
  const [changeShadow, setShadow] = useState("");
  const accessToken = localStorage.getItem("accessToken");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 0) {
      setShadow("shadow-md");
    } else {
      setShadow("shadow-none");
    }
  });

  return (
    <nav
      className={`flex p-4 bg-white w-full ${changeShadow}
    ${accessToken ? "bg-opacity-0" : "bg-[#ffffff]"}`}
    >
      <div className="flex items-center">
        <a href={` ${accessToken ? "/dashboard" : "/"}`}>
          <div className="logo">
            <img
              src="../src/assets/images/logo-transparent.png"
              alt="Company Logo"
              className="w-44 h-auto"
            />
          </div>
        </a>
      </div>
    </nav>
  );
};

export default Logo;
