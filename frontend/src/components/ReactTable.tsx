import React, { useState, useRef, useEffect } from "react";
import { MdEdit, MdDelete } from "react-icons/md";

function ReactTable({
  users,
  onDeleteSuccess,
  onEdit,
  page,
  setPage,
  perPage,
  setPerPage,
  total,
}) {
  const [activeMenu, setActiveMenu] = useState(null);
  const totalPages = Math.ceil(total / perPage);

  const start = total === 0 ? 0 : (page - 1) * perPage + 1;

  const end = Math.min(page * perPage, total);

  const handleDelete = async (id) => {
    try {
      // const confirmDelete = window.confirm("Are you sure?");
      // if (!confirmDelete) return;

      await fetch(`http://localhost:3000/api/users/${id}`, {
        method: "DELETE",
      });

      onDeleteSuccess();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".action-menu")) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="max-h-[400px] overflow-y-auto">
          <table className="w-full text-sm text-start">
            <thead className="bg-gray-200 sticky top-0 z-10">
              <tr>
                <th className="p-3 text-start">S.no</th>
                <th className="p-3 text-start">Name</th>
                <th className="p-3 text-start">Email</th>
                <th className="p-3 text-start">Role</th>
                <th className="p-3 text-start">Employee ID</th>
                <th className="p-3 text-start">Reports</th>
                <th className="p-3 text-start">Branch </th>
                <th className="p-3 text-start">Wrok Mode</th>
                <th className="p-3 text-start">Create at</th>
                <th className="p-3 text-start">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users && users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user.id} className="border-t border-blue-100">
                    <td className="p-3">{(page - 1) * perPage + index + 1}</td>
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === "Super Admin"
                            ? "bg-purple-100 text-purple-700"
                            : user.role === "Coder"
                              ? "bg-gray-100 text-gray-700"
                              : user.role === "Manager"
                                ? "bg-blue-100 text-blue-700"
                                : user.role === "Project Head"
                                  ? "bg-green-100 text-green-700"
                                  : user.role === "Lead"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : user.role === "Auditor"
                                      ? "bg-orange-100 text-orange-700"
                                      : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3">{user.employeeId}</td>
                    <td className="p-3">{user.reports}</td>
                    <td className="p-3">{user.branch}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          user.wfh === "WFH"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {user.wfh}
                      </span>
                    </td>
                    <td className="p-3">
                      {new Date(user.created_at).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </td>
                    <td className="relative action-menu">
                      <button
                        onClick={() => {
                          setActiveMenu(
                            activeMenu === user.id ? null : user.id,
                          );
                        }}
                        className="px-2 py-1 hover:bg-blue-100 rounded cursor-pointer"
                      >
                        ...
                      </button>
                      {activeMenu === user.id && (
                        <div className="absolute left-0 mt-2 w-[90px] bg-white border-none rounded shadow-md z-10">
                          <button
                            className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-blue-600 text-[14px]"
                            onClick={() => {
                              onEdit(user);
                              setActiveMenu(null);
                            }}
                          >
                            <MdEdit className="text-[17px]" />
                            Edit
                          </button>

                          <button
                            className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-red-600 text-[14px]"
                            onClick={() => {
                              handleDelete(user.id);
                              setActiveMenu(null);
                            }}
                          >
                            <MdDelete className="text-[17px]" />
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-4">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* PAGINATION */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-blue-200">
          {/* LEFT */}
          <div className="text-sm text-gray-600">
            Showing {start} to {end} of {total} results
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            {/* Rows per page */}
            <div className="flex items-center gap-2 text-sm">
              <span>Rows per page:</span>

              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setPage(1);
                }}
                className="border rounded px-2 py-1"
              >
                <option>5</option>
                <option>10</option>
                <option>20</option>
                <option>50</option>
              </select>
            </div>

            {/* Page Number */}
            <div className="text-sm">
              Page {page} of {totalPages}
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="w-8 h-8 border rounded hover:bg-gray-100 disabled:opacity-50"
              >
                {"<<"}
              </button>

              <button
                onClick={() => {
                  if (page > 1) {
                    setPage(page - 1);
                  }
                }}
                className="w-8 h-8 border rounded hover:bg-gray-100"
              >
                {"<"}
              </button>

              <button
                onClick={() => {
                  if (page < totalPages) {
                    setPage(page + 1);
                  }
                }}
                className="w-8 h-8 border rounded hover:bg-gray-100"
              >
                {">"}
              </button>

              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                className="w-8 h-8 border rounded hover:bg-gray-100 disabled:opacity-50"
              >
                {">>"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReactTable;
