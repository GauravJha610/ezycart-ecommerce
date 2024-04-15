import Navbar from "@/components/Navbar";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import Logo from "./Logo";

const Layout = ({ children }) => {
  const { data: session } = useSession();
  const [showNav, setShowNav] = useState(false);

  if (!session) {
    return (
      <div className=" bg-bgGray w-full h-full">
        <button
          onClick={() => signIn("google")}
          className=" bg-gray-600 p-2 px-4 rounded-lg"
        >
          Login with Google
        </button>
      </div>
    );
  }
  return (
    <div className="bg-bgGray min-h-screen">
      <div className="md:hidden flex items-center p-4">
        <button onClick={() => setShowNav(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-list"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
            />
          </svg>
        </button>
        <div className="flex grow justify-center mr-">
          <Logo />
        </div>
      </div>
      <div className="flex">
        <Navbar show={showNav} />
        <div className=" bg-white flex-grow p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
