import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function AddProjectForm({ onClose, project }: any) {
  const [clients, setClients] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    clientName: "",
    projectName: "",
    projectCode: "",
  });

  const [errors, setErrors] = useState<any>({});

  // Fetch Clients
  const fetchClients = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/clients");
      const data = await res.json();

      setClients(data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Edit Mode
  useEffect(() => {
    if (project) {
      setFormData({
        clientName: project.clientName || "",
        projectName: project.projectName || "",
        projectCode: project.projectCode || "",
      });
    }
  }, [project]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev: any) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    let newErrors: any = {};

    if (!formData.clientName) newErrors.clientName = "Client is required";

    if (!formData.projectName.trim())
      newErrors.projectName = "Project name is required";

    if (!formData.projectCode.trim())
      newErrors.projectCode = "Project code is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      let response;

      if (project) {
        response = await fetch(
          `http://localhost:3000/api/projects/${project.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          },
        );
      } else {
        response = await fetch("http://localhost:3000/api/projects", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      }

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);

        setTimeout(() => {
          onClose(true);
        }, 500);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Server Error");
    }
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-semibold">
        {project ? "Edit Project" : "Add New Project"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 flex-1 mt-3">
        {/* Client Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1">Client *</label>

          <select
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            className={`w-full border rounded-md p-2 ${
              errors.clientName ? "border-red-500" : ""
            }`}
          >
            <option value="">Select Client</option>

            {Array.isArray(clients) &&
              clients.map((client: any) => (
                <option key={client.id} value={client.clientName}>
                  {client.clientName} ({client.clientCode})
                </option>
              ))}
          </select>

          <p className="text-xs text-red-500 min-h-[16px]">
            {errors.clientName}
          </p>
        </div>

        {/* Project Name */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Project Name *
          </label>

          <input
            type="text"
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
            placeholder="Enter project name"
            className={`w-full border rounded-md p-2 ${
              errors.projectName ? "border-red-500" : ""
            }`}
          />

          <p className="text-xs text-red-500 min-h-[16px]">
            {errors.projectName}
          </p>
        </div>

        {/* Project Code */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Project Code *
          </label>

          <input
            type="text"
            name="projectCode"
            value={formData.projectCode}
            onChange={handleChange}
            placeholder="Enter project code"
            className={`w-full border rounded-md p-2 ${
              errors.projectCode ? "border-red-500" : ""
            }`}
          />

          <p className="text-xs text-red-500 min-h-[16px]">
            {errors.projectCode}
          </p>
        </div>

        {/* Buttons */}
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
            {project ? "Edit Project" : "Add Project"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProjectForm;
