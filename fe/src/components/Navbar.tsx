import { useState } from "react";
import { useLocation } from "react-router-dom";

// import { BsFillBellFill } from "react-icons/bs";
import { IoMdPerson } from "react-icons/io";

// interface INavbarProps {
//   setShowUsername: (value: boolean) => void;
//   socket: any;
//}

// const Navbar = ({ socket, setShowUsername }: INavbarProps) => {
const Navbar = () => {
  const location = useLocation();

  const [changeShadow, setShadow] = useState("");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 0) {
      setShadow("shadow-md");
    } else {
      setShadow("shadow-none");
    }
  });

  // const notificationCount = notification.length;

  return (
    <nav className={`flex justify-between p-3 bg-[#9988DD] ${changeShadow}`}>
      <div></div>
      {/* <HiMenu
            className="cursor-pointer text-2xl"
            onClick={() => setOpen(!open)}
          /> */}
      {location.pathname !== "/signin" && location.pathname !== "/signup" && (
        <div className="flex items-center">
          {/* {true && (
            <> */}
          {/* <div className="mr-5">
            <BsFillBellFill className="text-xl text-gray-700 fill-white" /> */}
            {/* {notificationCount > 0 && (
                  <span className="absolute top-4 ml-3 bg-red-500 text-white rounded-full text-xs px-1">
                        {notificationCount}
                      </span>
                    )} */}
          {/* </div> */}

          <div className="relative inline-block text-left">
            {/* <a
              href="#"
              className={`text-white hover:text-blue-200 font-medium text-sm text-center `}
            > */}
              <span className="flex text-white font-medium text-sm text-center items-center">
                <IoMdPerson className="w-4 h-4 mr-2" />
                {localStorage.getItem("username")}
              </span>
            {/* </a> */}
          </div>
          {/* </>
          )} */}
        </div>
      )}
    </nav>
  );
};

export default Navbar;