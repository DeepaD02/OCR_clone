import React, { useEffect, useState } from "react";
import ProjectTable from "./ProjectTable";
import AddProjectForm from "./AddProjectForm";

function ProjectPage() {
  const [open, setOpen] = useState(false);

  const [projects, setProjects] = useState([]);

  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedClient, setSelectedClient] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [clients, setClients] = useState([]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [perPage, setPerPage] = useState(10);

  const [total, setTotal] = useState(0);

  // FETCH PROJECTS
  const fetchProjects = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/projects?page=${page}&perPage=${perPage}`,
      );

      const data = await res.json();

      setProjects(data.data);

      setTotal(data.pagination.total);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchClients();
  }, [page, perPage]);

  // EXPORT
  const handleExport = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/projects/export");

      if (!res.ok) {
        throw new Error("Export failed");
      }

      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;

      a.download = "projects.xlsx";

      document.body.appendChild(a);

      a.click();

      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.log("EXPORT ERROR:", err);
    }
  };

  //  filter
  const fetchClients = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/clients");

      const data = await res.json();

      setClients(data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Projects</h1>

      {/* Action Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        {/* Left */}
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by name..."
            className="w-full sm:w-80 h-[38px] px-3 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="relative">
            {/* FILTER BUTTON */}
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="h-[38px] px-4 border rounded-md font-semibold hover:bg-gray-100"
            >
              Filters
            </button>

            {/* FILTER POPUP */}
            {showFilter && (
              <div className="absolute top-12 left-0 w-[320px] bg-white border rounded-2xl shadow-lg p-5 z-50">
                <h2 className="text-xl font-semibold mb-6">Filter Projects</h2>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Client
                  </label>

                  <select
                    value={selectedClient}
                    onChange={(e) => {
                      setSelectedClient(e.target.value);
                      setShowFilter(false);
                    }}
                    className="w-full h-[45px] px-4 border rounded-xl outline-none"
                  >
                    <option value="">All clients</option>

                    {clients.map((client) => (
                      <option key={client.id} value={client.clientName}>
                        {client.clientName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="h-[38px] px-3 border rounded-sm font-semibold hover:bg-gray-100"
          >
            Export
          </button>

          <button
            className="h-[38px] px-4 rounded-sm bg-blue-600 text-white font-semibold hover:bg-blue-700"
            onClick={() => setOpen(true)}
          >
            Add Project
          </button>
        </div>
      </div>

      {/* TABLE */}
      <ProjectTable
        projects={projects}
        search={search}
        selectedClient={selectedClient}
        page={page}
        setPage={setPage}
        perPage={perPage}
        setPerPage={setPerPage}
        total={total}
        onEdit={(project: any) => {
          setSelectedProject(project);

          setOpen(true);
        }}
        onDeleteSuccess={fetchProjects}
      />

      {/* MODAL */}
      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/30 flex justify-end z-40">
          <div className="h-full w-[400px] bg-white shadow-lg p-6 z-50">
            <AddProjectForm
              project={selectedProject}
              onClose={(refresh = false) => {
                setOpen(false);

                setSelectedProject(null);

                if (refresh) {
                  fetchProjects();
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectPage;
