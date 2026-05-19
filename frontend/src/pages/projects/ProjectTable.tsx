import React, { useEffect, useState } from "react";
import { MdEdit, MdDelete } from "react-icons/md";

function ProjectTable({
  projects,
  search,
  selectedClient,
  onEdit,
  onDeleteSuccess,
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
      const res = await fetch(`http://localhost:3000/api/projects/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        onDeleteSuccess();
        setActiveMenu(null);
      } else {
        console.log(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // SEARCH FILTER
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.projectName
      ?.toLowerCase()
      .includes(search.trim().toLowerCase());

    const matchesClient =
      selectedClient === "" || project.clientName === selectedClient;

    return matchesSearch && matchesClient;
  });

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="max-h-[400px] overflow-y-auto">
        <table className="w-full text-sm">
          {/* HEADER */}
          <thead className="bg-gray-200 sticky top-0 z-10">
            <tr className="text-left">
              <th className="p-3">S.no</th>
              <th className="p-3">Project Name</th>
              <th className="p-3">Project Code</th>
              <th className="p-3">Client</th>
              <th className="p-3">Created At</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <tr key={project.id} className="border-t border-blue-100">
                  <td className="p-3">{(page - 1) * perPage + index + 1}</td>

                  <td className="p-3">{project.projectName}</td>

                  <td className="p-3">{project.projectCode}</td>

                  <td className="p-3">{project.clientName}</td>

                  <td className="p-3">
                    {new Date(project.createdAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>

                  <td className="relative action-menu p-3">
                    <button
                      onClick={() => {
                        setActiveMenu(
                          activeMenu === project.id ? null : project.id,
                        );
                      }}
                      className="px-2 py-1 hover:bg-blue-100 rounded cursor-pointer"
                    >
                      ...
                    </button>

                    {activeMenu === project.id && (
                      <div className="absolute left-0 mt-2 w-[90px] bg-white border-none rounded shadow-md z-10">
                        <button
                          className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-blue-600 text-[14px]"
                          onClick={() => {
                            onEdit(project);
                            setActiveMenu(null);
                          }}
                        >
                          <MdEdit className="text-[17px]" />
                          Edit
                        </button>

                        <button
                          className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-red-600 text-[14px]"
                          onClick={() => {
                            handleDelete(project.id);
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
                <td className="text-center p-5 text-gray-500">
                  No Projects Found
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
  );
}

export default ProjectTable;
