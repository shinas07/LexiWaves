"use client";
import React, { useState, useEffect } from "react";
import { FloatingNav } from "./ui/floatingNavbar";
import { IconHome, IconBook2,IconBook } from "@tabler/icons-react";


export default function FloatingNavbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('accessToken');
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
  }, []);

  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Docs",
      link: "/docs",
      icon: <IconBook className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Learn",
      link: "/courses",
      icon: <IconBook2 className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
  ];

  return (
    <div className="relative w-full">
      <FloatingNav navItems={navItems} isLoggedIn={isLoggedIn} />
    </div>
  );
}