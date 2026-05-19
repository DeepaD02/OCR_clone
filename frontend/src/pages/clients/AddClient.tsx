import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

function AddClientForm({ onClose, client }: any) {
  const [formData, setFormData] = useState({
    clientName: "",
    clientCode: "",
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

    if (!formData.clientName.trim())
      newErrors.clientName = "Client name is required";

    if (!formData.clientCode.trim())
      newErrors.clientCode = "Client code is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      let response;
      if (client) {
        response = await fetch(
          `http://localhost:3000/api/clients/${client.id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          },
        );
      } else {
        response = await fetch("http://localhost:3000/api/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Saved successfully");

        setTimeout(() => {
          onClose(true);
        }, 500);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    }
  };

  useEffect(() => {
    if (client) {
      setFormData({
        clientName: client.clientName || "",
        clientCode: client.clientCode || "",
      });
    } else {
      setFormData({
        clientName: "",
        clientCode: "",
      });
    }
  }, [client]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <h2 className="text-xl font-semibold">
        {client ? "Edit Client" : "Add New Client"}
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 flex-1 mt-3">
        {/* Client Name */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Client Name *
          </label>

          <input
            name="clientName"
            type="text"
            placeholder="Enter client name"
            value={formData.clientName}
            onChange={handleChange}
            className={`w-full border rounded-md p-2 ${
              errors.clientName ? "border-red-500" : ""
            }`}
          />

          <p className="text-xs text-red-500 min-h-[16px]">
            {errors.clientName}
          </p>
        </div>

        {/* Client Code */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Client Code *
          </label>

          <input
            name="clientCode"
            type="text"
            placeholder="Enter client code"
            value={formData.clientCode}
            onChange={handleChange}
            className={`w-full border rounded-md p-2 ${
              errors.clientCode ? "border-red-500" : ""
            }`}
          />

          <p className="text-xs text-red-500 min-h-[16px]">
            {errors.clientCode}
          </p>
        </div>
        ++

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
            {client ? "Edit Client" : "Add Client"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddClientForm;
