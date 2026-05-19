import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div>
      <div className="flex">
        <Sidebar />
        <div className=" flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
