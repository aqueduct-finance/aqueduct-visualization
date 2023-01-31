import '@/styles/globals.css'
import Sidebar from "../components/Sidebar.js";
import { useState } from "react";
/*
export default function App({ Component, pageProps }) {
  const [isShown, setIsShown] = useState(false);

  return (
    <div className="w-full h-screen text-slate-500 poppins-font bg-white dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-blueBlack dark:to-black">
        <div className="flex flex-col md:flex-row h-full items-center md:items-stretch">
            <div className="w-full md:w-auto md:p-4">
                <Sidebar
                    isShown={isShown}
                    setIsShown={setIsShown}
                />
            </div>
            <main
                className={`flex flex-col items-center space-y-4 md:space-y-16 px-4 w-full overflow-y-scroll ${
                    isShown && " hidden md:flex "
                }`}
            >
                <div className="md:h-[50%]" />
                <Component
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...pageProps}
                />
                <div className="md:h-[50%]" />
            </main>
        </div>
    </div>
  )
}*/

export default function App({ Component, pageProps }) {
  const [isShown, setIsShown] = useState(false);

  return (
    <Component
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...pageProps}
                />
  )
}
