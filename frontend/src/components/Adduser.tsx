import React, { useState, useEffect } from "react";
import AddUserForm from "./AddUserForm";
import ReactTable from "./ReactTable";
function Adduser() {
  const [open, setOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectUser, setSelectUser] = useState(null);
  const [search, setsearch] = useState("");
  const [page, setPage] = useState(1);

  const [perPage, setPerPage] = useState(10);

  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState({
    role: "",
    branch: "",
    wfh: "",
  });

  const handleEdit = (user) => {
    setSelectUser(user);
    setOpen(true);
  };

  const fetchData = async () => {
    const res = await fetch(
      `http://localhost:3000/api/users?page=${page}&perPage=${perPage}`,
    );
    const data = await res.json();
    setUsers(data.data);

    setTotal(data.pagination.total);
  };

  useEffect(() => {
    fetchData();
  }, [page, perPage]);

  useEffect(() => {
    const delay = setTimeout(() => {
      applyFilter(false); // live search
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  // filter
  const applyFilter = async () => {
    const query = new URLSearchParams({
      ...filters,
      search,
    }).toString();

    const res = await fetch(`http://localhost:3000/api/users/filter?${query}`);

    const data = await res.json();

    setUsers(data);

    setFilterOpen(false);
  };

  const clearFilters = async () => {
    const empty = { role: "", branch: "", wfh: "" };
    setFilters(empty);
    await fetchData();
  };

  const handleExport = async () => {
    try {
      console.log("Export button clicked");

      const response = await fetch("http://localhost:3000/api/users/export");

      console.log("Response:", response);

      if (!response.ok) {
        throw new Error("Failed to export file");
      }

      const blob = await response.blob();

      console.log("Blob:", blob);

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = "users.xlsx";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      console.log("Download completed");
    } catch (error) {
      console.log("Export Error:", error);
    }
  };
  return (
    <div className="p-6 space-y-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold">User</h1>

      {/* Action Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        {/* Left Section */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={(e) => setsearch(e.target.value)}
            placeholder="Search by username,role."
            className="w-full sm:w-80 h-[38px] px-3 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* FILTER WRAPPER */}
          <div className="relative">
            {/* Filters Button */}
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="h-[38px] px-3 border rounded-sm font-semibold flex items-center gap-2 hover:bg-gray-100"
            >
              Filters
            </button>

            {/* Filter Dropdown */}
            {filterOpen && (
              <div className="absolute top-full mt-2 w-[300px] bg-white shadow-lg border rounded-lg p-4 z-50">
                <div className="flex items-center justify-between mb-3">
                  {" "}
                  <h2 className="text-lg font-semibold">Filter Users</h2>
                  {(filters.role || filters.branch || filters.wfh) && (
                    <button
                      onClick={clearFilters}
                      className="px-3 py-1 bg-gray-200 rounded-md cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Role */}
                <div className="mb-3">
                  <label className="block text-sm text-gray-500 mb-1">
                    Role
                  </label>
                  <select
                    className="w-full border rounded-lg p-2"
                    value={filters.role}
                    onChange={(e) =>
                      setFilters({ ...filters, role: e.target.value })
                    }
                  >
                    <option>All roles</option>
                    <option>Super Admin</option>
                    <option>Manager</option>
                    <option>Project Head</option>
                    <option>Lead</option>
                    <option>Coder</option>
                    <option>Auditor</option>
                  </select>
                </div>

                {/* Branch */}
                <div className="mb-3">
                  <label className="block text-sm text-gray-500 mb-1">
                    Branch
                  </label>
                  <select
                    className="w-full border rounded-lg p-2"
                    value={filters.branch}
                    onChange={(e) =>
                      setFilters({ ...filters, branch: e.target.value })
                    }
                  >
                    <option>All branches</option>
                    <option>Chennai</option>
                    <option>Bangalore</option>
                    <option>Hyderabad</option>
                  </select>
                </div>

                {/* Work Mode */}
                <div className="mb-3">
                  <label className="block text-sm text-gray-500 mb-1">
                    Work Mode
                  </label>
                  <select
                    className="w-full border rounded-lg p-2"
                    value={filters.wfh}
                    onChange={(e) =>
                      setFilters({ ...filters, wfh: e.target.value })
                    }
                  >
                    <option>All modes</option>
                    <option>WFH</option>
                    <option>Office</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => setFilterOpen(false)}
                    className="px-3 py-1 border rounded-md cursor-pointer"
                  >
                    Close
                  </button>

                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded-md cursor-pointer"
                    onClick={applyFilter}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-wrap xl:flex-nowrap items-center gap-3">
          <button
            onClick={handleExport}
            className="h-[38px] px-3 border rounded-sm font-semibold hover:bg-gray-100 cursor-pointer"
          >
            Export
          </button>
          {/* Add User */}
          <button
            onClick={() => setOpen(true)}
            className="h-[38px] px-4 rounded-sm bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            Add User
          </button>
        </div>
      </div>

      <ReactTable
        users={users}
        page={page}
        setPage={setPage}
        perPage={perPage}
        setPerPage={setPerPage}
        total={total}
        onDeleteSuccess={fetchData}
        onEdit={handleEdit}
      />

      {/* Add User Drawer */}
      {open && (
        <div className="fixed inset-0 bg-black/30 z-40">
          <div className="fixed right-0 top-0 h-full w-[400px] bg-white shadow-lg z-50 p-6">
            <AddUserForm
              user={selectUser}
              onClose={() => {
                setOpen(false);
                setSelectUser(null);
                fetchData();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Adduser;
