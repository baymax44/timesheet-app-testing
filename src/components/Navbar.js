import { Fragment, useEffect, useState } from "react";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { logoutAction, selectUserData } from "../redux/appReducer";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector(selectUserData);

  const [navbarData, setNavbarData] = useState([
    { name: "Projects", href: "/project", current: false },
    { name: "Time", href: "/time", current: false },
  ]);


  useEffect(() => {
    setNavbarData(
      navbarData.map((item) => {
        return item.href == location.pathname && item.href == "/"
          ? { ...item, current: true }
          : { ...item, current: false };
      })
    );
  }, []);

  const clickNavbar = (name) => {
    var temp = navbarData.map((item) => {
      return item.name == name
        ? {
            name: item.name,
            href: item.href,
            current: true,
          }
        : {
            name: item.name,
            href: item.href,
            current: false,
          };
    });
    setNavbarData(temp);
  };

  const logout = () => {
    dispatch(logoutAction());
    navigate("/");
  };
  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto px-2 sm:px-12 lg:px-16">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div>
                  <div className="flex space-x-4">
                    {navbarData.map((item) => (

                      !(userData.role == "ADMIN" && item.name == "Time") && <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "px-3 py-2 rounded-md text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                        onClick={() => clickNavbar(item.name)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button
                  onClick={logout}
                  className="block px-4 py-2 text-sm text-white"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
