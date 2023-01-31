/* eslint-disable react/require-default-props */
import { MdLightbulbOutline } from "react-icons/md";
import Head from "next/head";
import Image from "next/image";
import { IoClose, IoMenu } from "react-icons/io5";
import { FiMoon } from "react-icons/fi";
import logo from "../public/aq-logo-11-22.png";
import { useEffect } from "react";

const Sidebar = (isShown, setIsShown) => {
    useEffect(() => {
        if (localStorage.getItem("color-theme") === "light") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        // TODO: Assess missing dependency array values
    }, []);

    return (
        <header className="flex flex-col p-4 w-full md:w-64 md:h-full space-y-8 bg-transparent border-r2 md:border-[1px] dark:md:border-2 dark:md:bg-gray-900/60 dark:md:border-gray-800/60 md:centered-shadow dark:md:centered-shadow-dark rounded-2xl dark:border-gray-800/60 flex-shrink-0 md:overflow-y-auto">
            <div className="flex items-center w-[45px] h-[45px] space-x-2 text-aqueductBlue">
                <Image
                    src={logo}
                    alt="Aqueduct logo"
                    width="45px"
                    height="45px"
                    className="rounded-xl opacity-95"
                />
                <div className="flex items-center h-full">
                    <h1 className="text-2xl font-semibold pl-1 poppins-font text-transparent bg-clip-text bg-gradient-to-br from-[#2B75CE] to-[#0C4791]">
                        aqueduct
                    </h1>
                </div>
                <div className="flex grow" />
                <button
                    type="button"
                    className="md:hidden"
                    onClick={() => {
                        setIsShown(!isShown);
                    }}
                >
                    {isShown ? <IoClose size={28} /> : <IoMenu size={28} />}
                </button>
            </div>
            <div
                className={`grow space-y-8 transition-all duration-500 ${
                    isShown
                        ? "flex flex-col w-full top-[64px] bottom-0 md:top-0 p-4 md:p-0 left-0 absolute md:relative z-50"
                        : "hidden md:flex md:flex-col"
                }`}
            >
                asdf
            </div>
        </header>
    );
};

export default Sidebar;
