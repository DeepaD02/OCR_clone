import React, { useState } from "react";
import { MdEdit, MdDelete, MdVisibility } from "react-icons/md";

function DiagnosesTable({
  diagnoses,
  onEdit,
  onDelete,
  page,
  setPage,
  perPage,
  setPerPage,
  total,
}: any) {
  const [activeMenu, setActiveMenu] = useState(null);
  const totalPages = Math.ceil(total / perPage);

  const start = total === 0 ? 0 : (page - 1) * perPage + 1;

  const end = Math.min(page * perPage, total);
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="max-h-[500px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-200 sticky h-10 top-0">
            <tr>
              <th className="p-3 text-start">S.no</th>
              <th className="p-3 text-start">Code</th>
              <th className="p-3 text-start">Description</th>
              <th className="p-3 text-start">Type</th>
              <th className="p-3 text-start">Label</th>
              <th className="p-3 text-start">Created at</th>
              <th className="p-3 text-start">Actions</th>
            </tr>
          </thead>

          <tbody>
            {diagnoses.length > 0 ? (
              diagnoses.map((item: any, index: number) => (
                <tr key={item.id} className="border-t border-blue-200">
                  <td className="p-3">{(page - 1) * perPage + index + 1}</td>

                  <td className="p-3">{item.code}</td>

                  <td className="p-3">{item.describtion}</td>

                  <td className="p-3">{item.type}</td>

                  <td className="p-3">{item.label}</td>

                  <td className="p-3">
                    {new Date(item.Createdat).toLocaleDateString()}
                  </td>

                  <td className="relative p-3">
                    <button
                      onClick={() =>
                        setActiveMenu(activeMenu === item.id ? null : item.id)
                      }
                      className="px-2 py-1 hover:bg-gray-100 rounded"
                    >
                      ...
                    </button>

                    {activeMenu === item.id && (
                      <div className="absolute right-0 mt-2 w-[110px] bg-white rounded shadow-md z-10 border">
                        <button
                          className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-blue-600 text-sm"
                          onClick={() => {
                            onEdit(item);
                            setActiveMenu(null);
                          }}
                        >
                          <MdEdit />
                          Edit
                        </button>

                        <button
                          className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-red-600 text-sm"
                          onClick={() => {
                            onDelete(item.id);
                            setActiveMenu(null);
                          }}
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
                <td colSpan={7} className="p-4 text-center">
                  No diagnoses found
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

export default DiagnosesTable;
