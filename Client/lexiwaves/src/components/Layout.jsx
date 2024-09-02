import React from "react";
import { DotBackground } from "./Background";
import { MainNavbar } from "./Navbar";

const Layout = ({ children }) => {
    return (
      <div className="min-h-screen flex flex-col">
        <DotBackground>
          <div className="relative">
            <MainNavbar className="top-8" />
            <main className="flex-grow">{children}</main>
          </div>
        </DotBackground>
      </div>
    );
  };

export default Layout;
