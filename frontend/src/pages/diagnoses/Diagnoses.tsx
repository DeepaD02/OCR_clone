import React, { useEffect, useState } from "react";
import DiagnosesTable from "./DiagnosesTable";
import AddDiagnoses from "./AddDiagnoses";

function Diagnoses() {
  const [open, setOpen] = useState(false);
  const [diagnoses, setDiagnoses] = useState([]);
  const [editData, setEditData] = useState(null);
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [page, setPage] = useState(1);

  const [perPage, setPerPage] = useState(10);

  const [total, setTotal] = useState(0);

  const labelOptions = ["Diagnosis", "Title"];

  const typeOptions = ["Acute", "Chronic"];

  const fetchDiagnoses = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/diagnoses?search=${search}&label=${selectedLabel}&type=${selectedType}&page=${page}&perPage=${perPage}`,
      );

      const data = await response.json();

      setDiagnoses(data.data);

      setTotal(data.pagination.total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDiagnoses();
  }, [search, selectedLabel, selectedType, page, perPage]);

  const handleDelete = async (id: number) => {
    try {
      await fetch(`http://localhost:3000/api/diagnoses/${id}`, {
        method: "DELETE",
      });
      fetchDiagnoses();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (item: any) => {
    setEditData(item);
    setOpen(true);
  };

  // const filteredDiagnoses = diagnoses.filter((item: any) => {
  //   const matchesSearch =
  //     item?.code?.toLowerCase().includes(search.toLowerCase()) ||
  //     item?.describtion?.toLowerCase().includes(search.toLowerCase());

  //   const matchesLabel =
  //     selectedLabel === "" ||
  //     item?.label?.toLowerCase() === selectedLabel.toLowerCase();

  //   const matchesType =
  //     selectedType === "" ||
  //     item?.type?.toLowerCase() === selectedType.toLowerCase();

  //   return matchesSearch && matchesLabel && matchesType;
  // });
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Diagnoses</h1>

      {/* Action Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        {/* Left */}
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search diagnoses by code,description..."
            className="w-full sm:w-80 h-[38px] px-3 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="relative">
            {/* FILTER BUTTON */}
            <button
              className="h-[38px] px-4 border rounded-md font-semibold hover:bg-gray-100"
              onClick={() => setShowFilter(!showFilter)}
            >
              Filters
            </button>

            {/* FILTER POPUP */}
            {showFilter && (
              <div className="absolute top-12 left-0 w-[320px] bg-white border rounded-2xl shadow-lg p-5 z-50">
                <h2 className="text-xl font-semibold mb-6">Filter Users</h2>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Label
                  </label>

                  <select
                    className="w-full h-[45px] px-4 border rounded-xl outline-none"
                    value={selectedLabel}
                    onChange={(e) => setSelectedLabel(e.target.value)}
                  >
                    <option value="">All Label</option>
                    {labelOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Type
                  </label>

                  <select
                    className="w-full h-[45px] px-4 border rounded-xl outline-none"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option value="">All Type</option>
                    {typeOptions.map((item) => (
                      <option value={item} key={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="h-[38px] px-3 border rounded-sm font-semibold hover:bg-gray-100 cursor-pointer">
            Export
          </button>
          <button
            className="h-[38px] px-4 rounded-sm bg-blue-600 text-white font-semibold hover:bg-blue-700"
            onClick={() => setOpen(true)}
          >
            Add Diagnoses
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/30 z-40">
          <div className="fixed right-0 top-0 h-full w-[400px] bg-white shadow-lg z-50 p-6">
            <AddDiagnoses
              onClose={() => {
                setOpen(false);
                setEditData(null);
                fetchDiagnoses();
              }}
              editData={editData}
            />
          </div>
        </div>
      )}
      <DiagnosesTable
        diagnoses={diagnoses}
        page={page}
        setPage={setPage}
        perPage={perPage}
        setPerPage={setPerPage}
        total={total}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default Diagnoses;
