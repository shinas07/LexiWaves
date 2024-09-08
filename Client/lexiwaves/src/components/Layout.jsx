import React from "react";
import { DotBackground } from "./Background";
import { MainNavbar } from "./Navbar";
import Footer from "./footer";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <DotBackground className="flex-grow overflow-y-auto">
        <div className="relative min-h-full flex flex-col">
          <MainNavbar className="sticky top-0 z-10" />
          <main className="flex-grow pb-32">{children}</main>
        </div>
      </DotBackground>
      <Footer />
    </div>
  );
};

export default Layout;