import React, { useEffect, useState } from "react";
import TeamsTable from "./TeamsTable";
import AddTeam from "./AddTeam";

function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedProjectHead, setSelectedProjectHead] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [projectHead, setProjectHeads] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [perPage, setPerPage] = useState(10);

  const [total, setTotal] = useState(0);

  // fetch teams data
  const fetchTeams = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/teams?page=${page}&perPage=${perPage}`,
      );

      const data = await res.json();

      console.log(data);

      setTeams(data.data);
      setProjectHeads(data.data);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [page, perPage]);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/teams/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        fetchTeams();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const filteredTeams = teams.filter((team) => {
    // SEARCH BY TEAM NAME OR TEAM LEAD
    const matchesSearch =
      team.TeamName?.toLowerCase().includes(search.trim().toLowerCase()) ||
      team.TeamLead?.toLowerCase().includes(search.trim().toLowerCase());

    // FILTER BY PROJECT HEAD
    const matchesProjectHead =
      selectedProjectHead === "" || team.ProjectHead === selectedProjectHead;

    return matchesSearch && matchesProjectHead;
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Teams</h1>

      {/* Action Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        {/* Left */}
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search teams by teamName,teamLead.."
            className="w-full sm:w-80 h-[38px] px-3 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="relative">
            <button
              className="h-[38px] px-3 border rounded-sm font-semibold hover:bg-gray-100"
              onClick={() => setShowFilter(!showFilter)}
            >
              Filters
            </button>

            {/* FILTER POPUP */}
            {showFilter && (
              <div className="absolute top-12 left-0 w-[320px] bg-white border rounded-2xl shadow-lg p-5 z-50">
                <h2 className="text-xl font-semibold mb-6">Filter Teams</h2>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Project Head
                  </label>

                  <select
                    className="w-full h-[45px] px-4 border rounded-xl outline-none"
                    value={selectedProjectHead}
                    onChange={(e) => {
                      setSelectedProjectHead(e.target.value);
                      setShowFilter(false);
                    }}
                  >
                    <option value="">All project heads</option>

                    {[
                      ...new Set(projectHead.map((team) => team.ProjectHead)),
                    ].map((head, index) => (
                      <option key={index} value={head}>
                        {head}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right */}
        <button
          onClick={() => setOpen(true)}
          className="h-[38px] px-4 rounded-sm bg-blue-600 text-white font-semibold hover:bg-blue-700"
        >
          Add Team
        </button>

        {/* MODAL */}
        {open && (
          <div className="fixed inset-0 bg-black/30 z-40">
            <div className="fixed right-0 top-0 h-full w-[450px] bg-white shadow-lg z-50 p-6 overflow-y-auto">
              <AddTeam
                onClose={() => {
                  setOpen(false);

                  setSelectedTeam(null);
                }}
                fetchTeams={fetchTeams}
                selectedTeam={selectedTeam}
              />
            </div>
          </div>
        )}
      </div>

      {/* TABLE (moved outside flex) */}
      <TeamsTable
        teams={filteredTeams}
        page={page}
        setPage={setPage}
        perPage={perPage}
        setPerPage={setPerPage}
        total={total}
        onEdit={(team) => {
          setSelectedTeam(team);

          setOpen(true);
        }}
        handleDelete={handleDelete}
      />
    </div>
  );
}

export default TeamsPage;
