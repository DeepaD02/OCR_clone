import React, { useState, useEffect } from "react";

function AddUserForm({ onClose, user }: any) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    employeeId: "",
    branch: "",
    wfh: "",
  });

  const [errors, setErrors] = useState<any>({});

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

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.employeeId.trim())
      newErrors.employeeId = "Employee ID is required";
    if (!formData.branch) newErrors.branch = "Branch is required";
    if (!formData.wfh) newErrors.wfh = "WFH selection is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (user) {
        await fetch(`http://localhost:3000/api/users/${user.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        // alert("User Updated Successfully");
      } else {
        await fetch("http://localhost:3000/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        // alert("User Added Successfully");
      }

      onClose();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">
          {user ? "Edit User" : "Add New User"}
        </h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 flex-1 mt-3">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Name *</label>

          <input
            name="name"
            type="text"
            placeholder="Enter name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full border rounded-md p-2 ${
              errors.name ? "border-red-500" : ""
            }`}
          />

          <p className="text-xs text-red-500 min-h-[16px]">{errors.name}</p>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">Email *</label>

          <input
            name="email"
            type="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full border rounded-md p-2 ${
              errors.email ? "border-red-500" : ""
            }`}
          />

          <p className="text-xs text-red-500 min-h-[16px]">{errors.email}</p>
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium mb-1">Role *</label>

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={`w-full border rounded-md p-2 ${
              errors.role ? "border-red-500" : ""
            }`}
          >
            <option value="">Select Role</option>
            <option>Super Admin</option>
            <option>Manager</option>
            <option>Project Head</option>
            <option>Lead</option>
            <option>Coder</option>
            <option>Auditor</option>
          </select>

          <p className="text-xs text-red-500 min-h-[16px]">{errors.role}</p>
        </div>

        {/* Employee ID */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Employee ID *
          </label>

          <input
            name="employeeId"
            type="text"
            value={formData.employeeId}
            onChange={handleChange}
            className={`w-full border rounded-md p-2 ${
              errors.employeeId ? "border-red-500" : ""
            }`}
          />

          <p className="text-xs text-red-500 min-h-[16px]">
            {errors.employeeId}
          </p>
        </div>

        {/* Branch */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Branch / Location *
          </label>

          <select
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            className={`w-full border rounded-md p-2 ${
              errors.branch ? "border-red-500" : ""
            }`}
          >
            <option value="">Select Branch</option>
            <option>Chennai</option>
            <option>Bangalore</option>
            <option>Hyderabad</option>
          </select>

          <p className="text-xs text-red-500 min-h-[16px]">{errors.branch}</p>
        </div>

        {/* WFH */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Work From Home (WFH) *
          </label>

          <select
            name="wfh"
            value={formData.wfh}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          >
            <option value="">Select</option>
            <option>Yes</option>
            <option>No</option>
          </select>

          {/* <p className="text-xs text-red-500 min-h-[16px]">{errors.wfh}</p> */}
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
            {user ? "Edit User" : "Add User"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddUserForm;
