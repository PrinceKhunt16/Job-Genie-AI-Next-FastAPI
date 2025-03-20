import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GoPerson } from "react-icons/go";
import { SiNginxproxymanager } from "react-icons/si";
import { PiSignOutLight } from "react-icons/pi";
import { MdOutlineSegment } from "react-icons/md";
import { LiaHomeSolid } from "react-icons/lia";
import { MdFormatShapes } from "react-icons/md";
import Cookies from "js-cookie";

const Sidebar = ({ ml, setMl }) => {
    const location = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isText, setIsText] = useState(false);
    const isActive = (path) => location.pathname === path ? 'active-link text-black' : '';

    const handleLogout = () => {
        const token = Cookies.get("x-api-k-token");
        const uid = Cookies.get("uid");

        if (!token || !uid) {
            console.warn("No token found in cookies.");
            return;
        }

        Cookies.remove("x-api-k-token");
        Cookies.remove("uid");
    }

    const toggleMenu = () => {
        setIsOpen(!isOpen);

        if (isOpen) {
            setTimeout(() => {
                setIsText(!isText);
            }, 200);
        } else {
            setIsText(!isText);
        }

        setMl(!isOpen ? 14 : 64);
    }

    useEffect(() => {
        setMl(isOpen ? 14 : 64);
    }, [isOpen]);

    return (
        <div className={`min-w-14 h-screen bg-gradient-to-b from-fuchsia-700 to-blue-600/90 text-white fixed top-0 flex flex-col ${isOpen ? 'w-14' : 'w-64'} transition-all duration-300`}>
            <div className="h-[70px] pl-4 pt-2 pr-4 pb-2 text-white flex items-center gap-3 relative">
                <button onClick={toggleMenu} className="text-white cursor-pointer">
                    <MdOutlineSegment className='w-[22px]' size={22} />
                </button>
                <h1
                    className={`text-[24px] transition-all duration-300 transform absolute ${!isText ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-10px]'} ease-in-out`}
                    style={{ visibility: !isText ? 'visible' : 'hidden', left: '50px' }}
                >
                    Job Genie
                </h1>
            </div>
            <ul className="list-none flex-1">
                <li className={`h-[52px] flex items-center mb-2 px-4 ${isActive('/')}`}>
                    <Link
                        href="/"
                        className={`flex items-center gap-3 w-full text-lg cursor-pointer py-3 font-normal relative`}
                    >
                        <LiaHomeSolid size={22} color={`${isActive('/') && "black"}`} />
                        <span
                            className={`transition-text duration-300 transform absolute ${!isText ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-5px]'} ease-in-out`}
                            style={{ visibility: !isText ? 'visible' : 'hidden', left: '35px' }}
                        >
                            Home
                        </span>
                    </Link>
                </li>
                <li className={`h-[52px] flex items-center mb-2 px-4 ${isActive('/manage-urls')}`}>
                    <Link
                        href="/manage-companies"
                        className={`flex items-center gap-3 w-full text-lg cursor-pointer py-3 font-normal relative`}
                    >
                        <SiNginxproxymanager size={22} color={`${isActive('/manage-urls') && "black"}`} />
                        <span
                            className={`transition-text duration-300 transform absolute ${!isText ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-5px]'} ease-in-out`}
                            style={{ visibility: !isText ? 'visible' : 'hidden', left: '35px' }}
                        >
                            Manage Companies
                        </span>
                    </Link>
                </li>
                {/* <li className={`h-[52px] flex items-center mb-2 px-4 ${isActive('/autofill')}`}>
                    <Link
                        href="/autofill"
                        className={`flex items-center gap-3 w-full text-lg cursor-pointer py-3 font-normal relative`}
                    >
                        <MdFormatShapes size={22} color={`${isActive('/autofill') && "black"}`} />
                        <span
                            className={`transition-text duration-300 transform absolute ${!isText ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-5px]'} ease-in-out`}
                            style={{ visibility: !isText ? 'visible' : 'hidden', left: '35px' }}
                        >
                            Autofill
                        </span>
                    </Link>
                </li>
                <li className={`h-[52px] flex items-center mb-2 px-4 ${isActive('/profile')}`}>
                    <Link
                        href="/profile"
                        className={`flex items-center gap-3 w-full text-lg cursor-pointer py-3 font-normal relative`}
                    >
                        <GoPerson size={22} color={`${isActive('/profile') && "black"}`} />
                        <span
                            className={`transition-text duration-300 transform absolute ${!isText ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-5px]'} ease-in-out`}
                            style={{ visibility: !isText ? 'visible' : 'hidden', left: '35px' }}
                        >
                            Profile
                        </span>
                    </Link>
                </li> */}
            </ul>
            <div className="mt-auto p-4">
                <Link
                    onClick={handleLogout}
                    href="/auth"
                    className={`flex items-center gap-3 w-full text-lg cursor-pointer py-3 font-normal relative`}
                >
                    <PiSignOutLight size={22} />
                    <span
                        className={`transition-text duration-300 transform absolute ${!isText ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-5px]'} ease-in-out`}
                        style={{ visibility: !isText ? 'visible' : 'hidden', left: '35px' }}
                    >
                        Log Out
                    </span>
                </Link>
            </div>
        </div>
    );
}

export default Sidebar;