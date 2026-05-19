import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function AddTeam({ onClose, fetchTeams, selectedTeam }) {
  const [projects, setProjects] = useState([]);

  const [projectHeads, setProjectHeads] = useState([]);

  const [teamLeads, setTeamLeads] = useState([]);

  const [formData, setFormData] = useState({
    projectHead: selectedTeam?.ProjectHead || "",
    project: selectedTeam?.project || "",
    teamLead: selectedTeam?.TeamLead || "",
  });

  const [errors, setErrors] = useState({});
  const isEdit = !!selectedTeam;

  // FETCH PROJECTS
  const fetchProjects = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/projects");

      const data = await res.json();

      setProjects(data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  // FETCH PROJECT HEADS
  const fetchProjectHeads = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/users/project-heads");

      const data = await res.json();

      setProjectHeads(data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  // FETCH TEAM LEADS
  const fetchTeamLeads = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/users/team-leads");

      const data = await res.json();

      setTeamLeads(data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchProjectHeads();
    fetchTeamLeads();
  }, []);

  // HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!formData.project.trim()) {
      newErrors.project = "Project is required";
    }

    if (!formData.teamLead.trim()) {
      newErrors.teamLead = "Team lead is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      const url = isEdit
        ? `http://localhost:3000/api/teams/${selectedTeam.id}`
        : "http://localhost:3000/api/teams";

      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      console.log(data);

      if (data.success) {
        toast.success(data.message || "Team created successfully");

        // RESET FORM
        setFormData({
          projectHead: "",
          project: "",
          teamLead: "",
        });

        onClose();
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (err) {
      console.log(err);

      toast.error("Server error");
    }
  };
  return (
    <div className="h-full flex flex-col">
      {/* HEADER */}
      <h2 className="text-xl font-semibold">
        {isEdit ? "Edit Team" : "Add New Team"}
      </h2>

      <p className="text-sm text-gray-500 mt-1">
        Create a new team and assign members to collaborative workflows.
      </p>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4 flex-1 mt-5">
        {/* PROJECT HEAD */}
        <div>
          <label className="block text-sm font-medium mb-1">Project Head</label>

          <select
            name="projectHead"
            value={formData.projectHead}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          >
            <option value="">Select project head (optional)</option>

            {Array.isArray(projectHeads) &&
              projectHeads.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
          </select>
        </div>

        {/* PROJECT */}
        <div>
          <label className="block text-sm font-medium mb-1">Project *</label>

          <select
            name="project"
            value={formData.project}
            onChange={handleChange}
            className={`w-full border rounded-md p-2 ${
              errors.project ? "border-red-500" : ""
            }`}
          >
            <option value="">Select project</option>

            {Array.isArray(projects) &&
              projects.map((project) => (
                <option key={project.id} value={project.projectName}>
                  {project.projectName}
                </option>
              ))}
          </select>

          <p className="text-xs text-red-500 min-h-[16px]">{errors.project}</p>
        </div>

        {/* TEAM LEAD */}
        <div>
          <label className="block text-sm font-medium mb-1">Team Lead *</label>

          <select
            name="teamLead"
            value={formData.teamLead}
            onChange={handleChange}
            className={`w-full border rounded-md p-2 ${
              errors.teamLead ? "border-red-500" : ""
            }`}
          >
            <option value="">Select team lead</option>

            {Array.isArray(teamLeads) &&
              teamLeads.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
          </select>

          <p className="text-xs text-red-500 min-h-[16px]">{errors.teamLead}</p>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 pt-2">
      
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            {isEdit ? "Update Team" : "Create Team"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddTeam;
