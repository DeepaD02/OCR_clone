import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { X } from "lucide-react";

function AddDiagnoses({ onClose, editData }: any) {
  const [formData, setFormData] = useState({
    label: "Diagnosis",
    code: "",
    type: "A",
    description: "",
  });

  const [errors, setErrors] = useState<any>({});

  const labelOptions = ["Diagnosis", "Title"];
  const typeOptions = ["Acute", "Chronic"];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
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

    if (!formData.label) newErrors.label = "Label is required";

    if (!formData.code.trim()) newErrors.code = "Diagnosis code is required";

    if (!formData.type) newErrors.type = "Diagnosis type is required";

    if (!formData.description.trim())
      newErrors.description = "Description is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch(
        editData
          ? `http://localhost:3000/api/diagnoses/${editData.id}`
          : "http://localhost:3000/api/diagnoses",
        {
          method: editData ? "PATCH" : "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            code: formData.code,
            describtion: formData.description,
            type: formData.type,
            label: formData.label,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(
          editData
            ? "Diagnosis updated succesfully"
            : "Diagnosis added successfully",
        );

        setTimeout(() => {
          onClose?.(true);
        }, 500);
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    }
  };

  useEffect(() => {
    if (editData) {
      setFormData({
        label: editData.label || "Diagnosis",
        code: editData.code || "",
        type: editData.type || "",
        description: editData.describtion || "",
      });
    }
  }, [editData]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">
          {editData ? "Edit Diagnosis" : "Add New Diagnosis"}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>

      <p className="text-sm text-gray-500 mt-1">
        Create a new medical diagnosis entry with appropriate categorization and
        documentation.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className=" flex-1 mt-3">
        {/* Label */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Label <span className="text-red-500">*</span>
          </label>

          <select
            name="label"
            value={formData.label}
            onChange={handleChange}
            className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.label ? "border-red-500" : "border-gray-300"
            }`}
          >
            {labelOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <p className="text-xs text-red-500 min-h-[16px] mt-1">
            {errors.label}
          </p>
        </div>

        {/* Diagnosis Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Code <span className="text-red-500">*</span>
          </label>

          <input
            name="code"
            type="text"
            placeholder="Enter diagnosis code"
            value={formData.code}
            onChange={handleChange}
            className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.code ? "border-red-500" : "border-gray-300"
            }`}
          />

          <p className="text-xs text-red-500 min-h-[16px] mt-1">
            {errors.code}
          </p>
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Type <span className="text-red-500">*</span>
          </label>

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.type ? "border-red-500" : "border-gray-300"
            }`}
          >
       

            {typeOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <p className="text-xs text-red-500 min-h-[16px] mt-1">
            {errors.type}
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Description <span className="text-red-500">*</span>
          </label>

          <input
            name="description"
            type="text"
            maxLength={255}
            placeholder="Enter a Diagnoses description"
            value={formData.description}
            onChange={handleChange}
            className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
          />

          <p className="text-xs text-gray-500 mt-1">
            Description must be unique and cannot exceed 255 characters
          </p>

          <p className="text-xs text-red-500 min-h-[16px] mt-1">
            {errors.description}
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-xl py-3 font-medium hover:bg-gray-50 transition"
        >
          {editData ? "Edit Diagnoses" : "Add Diagnoses"}
        </button>
      </form>
    </div>
  );
}

export default AddDiagnoses;
