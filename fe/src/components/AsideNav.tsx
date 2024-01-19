import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { TbReportAnalytics, TbReportSearch } from "react-icons/tb";
import { HiMenu } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import { IoExitOutline } from "react-icons/io5";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

import Logo from "./Logo";

export const AsideNav = () => {
  const menus = [
    { name: "Dashboard", link: "/dashboard", icon: MdOutlineDashboard },
    {
      name: "Lost Items",
      link: "#",
      icon: TbReportAnalytics,
      submenus: [
        { name: "Add New Item", link: "/add-lost-item" },
        { name: "View My Items", link: "/my-lost-items" },
        { name: "Recent Posts", link: "/lost-items-listing" },
        { name: "View Sent Claims", link: "/my-lost-item-claims" },
      ],
    },
    {
      name: "Found Items",
      link: "#",
      icon: TbReportSearch,
      submenus: [
        { name: "Add New Item", link: "/add-found-item" },
        { name: "View My Items", link: "/my-found-items" },
        { name: "Recent Posts", link: "/found-items-listing" },
        { name: "View Received Claims", link: "/my-found-item-claims" },
      ],
    },
  ];

  const [width, setWidth] = useState(window.innerWidth);

  const updateDimensions = () => {
    const newWidth = window.innerWidth;
    setWidth(newWidth);
    if (newWidth < 450) {
      setOpen(false);
    } else if (newWidth >= 450) {
      setOpen(true);
    }
  };
  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const navigate = useNavigate();
  const [open, setOpen] = useState(width<450 ? false : true);

  const [submenuOpen, setSubmenuOpen] = useState(menus.map(() => false));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const hideAll = () => {
    setOpen(!open);
    setSubmenuOpen(Array(menus.length).fill(false));
  };


  return (
    <section className="flex gap-6 text-gray-500 shadow-sm pl-2">
      <div
        className={`bg-white min-h-screen ${
          open ? "w-65 md:w-30" : "w-16"
        } duration-500`}
      >
        <div className="flex flex-col h-full justify-between">
          <div>
            {width > 450 ? (
              <div
                className={`flex w-full items-center justify-center ${
                  open ? "" : "pt-2 pb-2"
                }`}
              >
                <HiMenu
                  className={`cursor-pointer text-2xl `}
                  onClick={() => hideAll()}
                />
                <div className={` ${open ? "" : "hidden"}`}>
                  <Logo />
                </div>
              </div>
            ) : (
              <a className="flex justify-center items-center mt-1" href ="/dashboard">
                <img src="/src/assets/images/logo.png" className="h-10"/>
              </a>
            )}
            <div className="flex flex-col gap-5 relative">
              {menus?.map((menu, i) => (
                <div key={i}>
                  {menu.name === "Lost Items" || menu.name === "Found Items" ? (
                    <div
                      className={`${!open && "flex"}`}
                      onMouseEnter={() => {
                        if (!open) {
                          const newSubmenuOpen = submenuOpen.map(
                            (_, index) => index === i
                          );
                          setSubmenuOpen(newSubmenuOpen);
                        }
                      }}
                      onMouseLeave={() => {
                        if (!open) {
                          const newSubmenuOpen = [...submenuOpen];
                          newSubmenuOpen[i] = false;
                          setSubmenuOpen(newSubmenuOpen);
                        }
                      }}
                    >
                      <div
                        className={`border-s-4 font-sans group flex items-center text-sm gap-3.5 font-medium p-2
                        hover: cursor-pointer hover:bg-gray-100 ${
                          !open && "pl-5 justify-center"
                        } ${
                          menu.submenus?.some(
                            (submenu) => location.pathname === submenu.link
                          )
                            ? "border-[#7160b8] text-[#7160b8]"
                            : "border-white"
                        }`}
                        onClick={() => {
                          if (open) {
                            // Toggle the submenu open/closed state for this menu item
                            const newSubmenuOpen = [...submenuOpen];
                            newSubmenuOpen[i] = !newSubmenuOpen[i];
                            setSubmenuOpen(newSubmenuOpen);
                          }
                        }}
                      >
                        <div>
                          {React.createElement(menu?.icon, { size: "20" })}
                        </div>
                        <h2
                          className={`${
                            !open && "hidden translate-x-28 overflow-hidden"
                          }`}
                        >
                          {menu?.name}
                        </h2>

                        <div className={`ml-auto ${!open && "hidden"}`}>
                          {submenuOpen[i] ? (
                            <IoMdArrowDropup />
                          ) : (
                            <IoMdArrowDropdown />
                          )}
                        </div>
                      </div>
                      <div>
                        {submenuOpen[i] && (
                          <>
                            <ul
                              className={`text-gray-600 font-sans text-sm ${
                                open
                                  ? "ml-10 "
                                  : "w-[150px] absolute ml-5 left-10 shadow-md rounded-sm pt-1 bg-white"
                              }
                        `}
                            >
                              <li
                                className={`ml-2 w-full text-lg ${
                                  open && "hidden"
                                }`}
                              >
                                {menu.name}
                              </li>
                              {menu.submenus?.map((submenu, j) => (
                                <li
                                  key={j}
                                  className={`mt-2 ml-2 hover:bg-gray-200 p-1 ${
                                    location.pathname === submenu.link
                                      ? "text-[#6242e1]"
                                      : ""
                                  }`}
                                >
                                  <Link to={submenu.link}>{submenu.name}</Link>
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={menu?.link}
                      className={`border-s-4 font-sans group flex items-center text-sm gap-3.5 
                      font-medium p-2 hover:bg-gray-100 ${
                        !open && "justify-center"
                      } ${
                        location.pathname === menu.link
                          ? "border-[#7160b8] text-[#7160b8]"
                          : "border-white"
                      }`}
                    >
                      <div className="">
                        {React.createElement(menu?.icon, { size: "20" })}
                      </div>
                      <h2
                        className={` ${
                          !open && "hidden translate-x-28 overflow-hidden"
                        }`}
                      >
                        {menu?.name}
                      </h2>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => {
              handleLogout();
            }}
            className={`border-s-4 border-white font-sans mb-10 mt-5 group flex items-center text-sm gap-3.5
             font-medium p-2 hover-bg-gray-100 ${!open && "justify-center"}`}
          >
            <div>{React.createElement(IoExitOutline, { size: "20" })}</div>
            <h2 className={`${!open && "hidden overflow-hidden"}`}>Logout</h2>
          </button>
        </div>
      </div>
    </section>
  );
};