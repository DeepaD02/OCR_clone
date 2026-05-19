import React, { useState, useEffect } from "react";
import ClientTable from "./ClientTable";
import AddClientForm from "./AddClient";

function ClientPage() {
  const [open, setOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchClients = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/clients?page=${page}&perPage=${perPage}`,
      );

      const data = await res.json();

      setClients(data.data);

      setTotal(data.pagination.total);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [page, perPage]);

  const handleExport = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/clients/export");

      if (!res.ok) {
        throw new Error("Export failed");
      }

      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;
      a.download = "clients.xlsx";

      document.body.appendChild(a);

      a.click();

      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.log("EXPORT ERROR:", err);
    }
  };

  const filteredClients = clients.filter((client) => {
    return (
      client.clientName?.toLowerCase().includes(search.trim().toLowerCase()) ||
      client.clientCode?.toLowerCase().includes(search.trim().toLowerCase())
    );
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Clients</h1>

      {/* Action Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        {/* Left */}
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients by name, code..."
            className="w-full sm:w-80 h-[38px] px-3 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button className="h-[38px] px-3 border rounded-sm font-semibold hover:bg-gray-100">
            Filters
          </button>
        </div>

        {/* Right */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleExport}
            className="h-[38px] px-3 border rounded-sm font-semibold hover:bg-gray-100 cursor-pointer"
          >
            Export
          </button>
          <button
            onClick={() => setOpen(true)}
            className="h-[38px] px-4 rounded-sm bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            Add Client
          </button>
        </div>
      </div>

      <ClientTable
        clients={filteredClients}
        page={page}
        setPage={setPage}
        perPage={perPage}
        setPerPage={setPerPage}
        total={total}
        onEdit={(client: any) => {
          setSelectedClient(client);
          setOpen(true);
        }}
        onDeleteSuccess={fetchClients}
      />

      {open && (
        <div className="fixed inset-0 bg-black/30 z-40">
          <div className="fixed right-0 top-0 h-full w-[400px] bg-white shadow-lg z-50 p-6">
            <AddClientForm
              client={selectedClient}
              onClose={(refresh = false) => {
                setOpen(false);
                setSelectedClient(null);

                if (refresh) {
                  fetchClients();
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientPage;
