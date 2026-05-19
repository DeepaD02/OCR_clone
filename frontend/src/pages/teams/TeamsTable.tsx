import React, { useState } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
function TeamsTable({
  teams,
  onEdit,
  handleDelete,
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
      <div className="max-h-[400px] overflow-y-auto">
        <table className="w-full text-sm">
          {/* HEADER */}
          <thead className="bg-gray-200 sticky z-10 top-0">
            <tr className="text-left">
              <th className="p-3">S.no</th>
              <th className="p-3">Team Name</th>
              <th className="p-3">Project</th>
              <th className="p-3">Team Lead</th>
              <th className="p-3">Project Head</th>
              <th className="p-3">Coders</th>
              <th className="p-3">Auditors</th>
              <th className="p-3">Created At</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {teams && teams.length > 0 ? (
              teams.map((team, index) => (
                <tr key={team.id} className="border-t border-blue-100">
                  <td className="p-3">{(page - 1) * perPage + index + 1}</td>

                  <td className="p-3">{team.TeamName}</td>
                  <td className="p-3">{team.project}</td>

                  <td className="p-3">{team.TeamLead}</td>

                  <td className="p-3">{team.ProjectHead}</td>

                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {/* MINUS */}
                      <button className="text-gray-400 text-xl font-bold cursor-pointer">
                        -
                      </button>

                      {/* COUNT */}
                      <span className="bg-gray-100 px-3 py-1 rounded-full">
                        {team.coders}
                      </span>

                      {/* PLUS */}
                      <button className="text-green-500 text-xl font-bold cursor-pointer">
                        +
                      </button>
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {/* MINUS */}
                      <button className="text-gray-400 text-xl font-bold cursor-pointer">
                        -
                      </button>

                      {/* COUNT */}
                      <span className="bg-gray-100 px-3 py-1 rounded-full">
                        {team.auditors}
                      </span>

                      {/* PLUS */}
                      <button className="text-green-500 text-xl font-bold cursor-pointer">
                        +
                      </button>
                    </div>
                  </td>

                  <td className="p-3">
                    {new Date(team.CreateAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>

                  <td className="relative p-3">
                    {/* THREE DOT BUTTON */}
                    <button
                      onClick={() =>
                        setActiveMenu(activeMenu === team.id ? null : team.id)
                      }
                      className="px-2 py-1 rounded hover:bg-gray-200"
                    >
                      ⋮
                    </button>

                    {/* DROPDOWN MENU */}
                    {activeMenu === team.id && (
                      <div className="absolute right-3 mt-2 w-[100px] bg-white border rounded shadow-lg z-10">
                        {/* EDIT */}
                        <button
                          className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-blue-600"
                          onClick={() => {
                            onEdit(team);

                            setActiveMenu(null);
                          }}
                        >
                          <MdEdit />
                          Edit
                        </button>

                        {/* DELETE */}
                        <button
                          className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-red-600"
                          onClick={() => {
                            handleDelete(team.id);

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
                <td colSpan="8" className="p-4 text-center">
                  No teams found
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

            <button className="w-8 h-8 border rounded hover:bg-gray-100">
              {">>"}
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

export default TeamsTable;
