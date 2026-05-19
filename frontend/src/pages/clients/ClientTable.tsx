import React, { useState, useEffect } from "react";
import { MdEdit, MdDelete, MdVisibility } from "react-icons/md";

function ClientTable({
  clients,
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

  const handleDelete = async (id: number) => {
    // const confirmDelete = window.confirm("Are you sure?");
    // if (!confirmDelete) return;

    await fetch(`http://localhost:3000/api/clients/${id}`, {
      method: "DELETE",
    });

    onDeleteSuccess();
  };

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (!e.target.closest(".action-menu")) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="max-h-[400px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-200 sticky top-0 z-10">
            <tr>
              <th className="p-3 text-start">S.no</th>
              <th className="p-3 text-start">Client Name</th>
              <th className="p-3 text-start">Client Code</th>
              <th className="p-3 text-start">Created At</th>
              <th className="p-3 text-start">Actions</th>
            </tr>
          </thead>

          <tbody>
            {clients?.length > 0 ? (
              clients.map((client, index) => (
                <tr key={client.id} className="border-t border-blue-200">
                  <td className="p-3">{(page - 1) * perPage + index + 1}</td>
                  <td className="p-3">{client.clientName}</td>
                  <td className="p-3">{client.clientCode}</td>

                  <td className="p-3">
                    {new Date(client.createdAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>

                  {/* ACTION */}
                  <td className="relative action-menu">
                    <button
                      onClick={() =>
                        setActiveMenu(
                          activeMenu === client.id ? null : client.id,
                        )
                      }
                      className="px-2 py-1 hover:bg-gray-100 rounded"
                    >
                      ...
                    </button>

                    {activeMenu === client.id && (
                      <div className="absolute mt-2 w-[130px] bg-white rounded shadow-md z-10">
                        <button className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-sm">
                          <MdVisibility />
                          View
                        </button>

                        <button
                          onClick={() => {
                            onEdit(client);
                            setActiveMenu(null);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-blue-600 text-sm"
                        >
                          <MdEdit />
                          Edit
                        </button>

                        <button
                          onClick={() => {
                            handleDelete(client.id);
                            setActiveMenu(null);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-red-600 text-sm"
                        >
                          <MdDelete />
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  No clients found
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
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
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

export default ClientTable;
