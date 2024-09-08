"use client";
import React, { useEffect, useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/Navbar-main";
import { cn } from "../lib/utils";
import { Link } from "react-router-dom";



// export function MainNavbar() {
//   return (
//     (<div className="relative w-full flex items-center justify-center">
//       <Navbar className="top-2" />
//       <p className="text-black dark:text-white">
//         The Navbar will show on top of the page
//       </p>
//     </div>)
//   );
// }


export function MainNavbar({ className }) {
  const [active, setActive] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false) 

  useEffect(() => {
    const access =  sessionStorage.getItem('access');
    console.log(access);
    
    if (access) {

      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('access');
    sessionStorage.removeItem('refresh');
    localStorage.removeItem('user');
    setIsLoggedIn(false)
  }


  return (
    <div className={cn("fixed top-10 inset-x-0 max-w-sm mx-auto z-50", className)}>
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item="Home">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/hobby">Hobby</HoveredLink>
            <HoveredLink href="/individual">Individual</HoveredLink>
            <HoveredLink href="/team">Team</HoveredLink>
            <HoveredLink href="/enterprise">Enterprise</HoveredLink>
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Courses">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/signup">Web Development</HoveredLink>
            <HoveredLink href="/interface-design">Interface Design</HoveredLink>
            <HoveredLink href="/seo">Search Engine Optimization</HoveredLink>
            <HoveredLink href="/branding">Branding</HoveredLink>
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Find tutors">
          <div className="text-sm grid grid-cols-2 gap-8 p-4">
            <ProductItem
              title="Algochurn"
              href="https://algochurn.com"
              src="https://assets.aceternity.com/demos/algochurn.webp"
              description="Prepare for tech interviews like never before."
            />
            <ProductItem
              title="Tailwind Master Kit"
              href="https://tailwindmasterkit.com"
              src="https://assets.aceternity.com/demos/tailwindmasterkit.webp"
              description="Production ready Tailwind css components for your next project"
            />
            <ProductItem
              title="Moonbeam"
              href="https://gomoonbeam.com"
              src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.51.31%E2%80%AFPM.png"
              description="Never write from scratch again. Go from idea to blog in minutes."
            />
            <ProductItem
              title="Rogue"
              href="https://userogue.com"
              src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.47.07%E2%80%AFPM.png"
              description="Respond to government RFPs, RFIs and RFQs 10x faster using AI"
            />
          </div>
        </MenuItem>
        {/* <MenuItem setActive={setActive} active={active} item="Login"> */}
          {/* <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/hobby">Hobby</HoveredLink>
            <HoveredLink href="/individual">Individual</HoveredLink>
            <HoveredLink href="/team">Team</HoveredLink>
            <HoveredLink href="/enterprise">Enterprise</HoveredLink>
          </div> */}
        {/* </MenuItem> */}
        {/* <a href="/login" className="text-lg font-bold mb-1 text-black dark:text-white ">
        Login
      </a> */}
      {isLoggedIn? (
         <button onClick={handleLogout} className="text-lg font-bold mb-1 text-black dark:text-white">
         Logout
       </button>
      ):(
      <Link to='/signin' className="text-lg font-bold mb-1 text-black dark:text-white">
      Sign In</Link>
      )}

    

      </Menu>
    </div>
  );
}

