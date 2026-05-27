import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  const handleLogout = () => {
    // REMOVE TOKEN
    localStorage.removeItem("token");

    // REDIRECT LOGIN
    window.location.href = "/login";
  };

  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4">
      <ul className="space-y-2">
        <li>
          <Link to="/client" className="block hover:bg-gray-700 p-2 rounded">
            Clients
          </Link>
        </li>
        <li>
          <Link to="/project" className="block hover:bg-gray-700 p-2 rounded">
            Projects
          </Link>
        </li>
        <li>
          <Link to="/teams" className="block hover:bg-gray-700 p-2 rounded">
            Teams
          </Link>
        </li>
        <li>
          <Link to="/adduser" className="block hover:bg-gray-700 p-2 rounded">
            Users
          </Link>
        </li>
        <li>
          <Link
            to="/pdfextractor"
            className="block hover:bg-gray-700 p-2 rounded"
          >
            PDF Extractor
          </Link>
        </li>
        <li>
          <Link to="/finder" className="block hover:bg-gray-700 p-2 rounded">
            Finder
          </Link>
        </li>
        <li>
          <Link to="/reports" className="block hover:bg-gray-700 p-2 rounded">
            Reports
          </Link>
        </li>
        <li>
          <Link to="/diagnoses" className="block hover:bg-gray-700 p-2 rounded">
            Diagnoses
          </Link>
        </li>
        <li>
          <Link
            to="/activitylogs"
            className="block hover:bg-gray-700 p-2 rounded"
          >
            Activity Logs
          </Link>
        </li>
        <li>
          <Link
            to="/notifications"
            className="block hover:bg-gray-700 p-2 rounded"
          >
            Notifications
          </Link>
        </li>
      </ul>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}

export default Sidebar;
