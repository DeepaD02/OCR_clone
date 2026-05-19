import React from "react";
import { FileText } from "lucide-react";

function PDFExtractor() {
  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">PDF Extractor</h1>

          <p className="text-gray-500 text-sm mt-1">
            Search for processed medical charts by Chart ID and view the
            corresponding PDF documents.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1 text-xs border rounded bg-gray-100">
            Ctrl+K
          </kbd>

          <span className="text-xs text-gray-500">to search</span>
        </div>
      </div>

      {/* Form */}
      <form className="space-y-6">
        <div className="flex flex-col xl:flex-row gap-4 items-end">
          {/* Chart ID */}
          <div className="w-full">
            <label className="block text-sm font-medium mb-2">
              Chart ID <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              placeholder="Chart ID must be 8 characters."
              className="w-full h-[38px] border rounded-xl px-4 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Upload File */}
          <div className="w-full">
            <label className="block text-sm font-medium mb-2">
              Upload File <span className="text-red-500">*</span>
            </label>

            <input
              type="file"
              accept=".pdf"
              className="w-full h-[38px] border rounded-xl px-4 py-2 outline-none"
            />
          </div>

          {/* Button */}
          <div className="w-full xl:w-[180px]">
            <button
              type="button"
              className="w-full h-[38px] border rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-100"
            >
              <FileText size={18} />
              Extract
            </button>
          </div>
        </div>
      </form>

      {/* Empty State */}
      <div className="rounded-2xl h-[320px] flex flex-col items-center justify-center text-center bg-gray-50">
        <FileText size={70} className="text-gray-400 mb-5" />

        <h2 className="text-3xl font-semibold text-gray-400 mb-3">
          Search for a Chart
        </h2>

        <p className="text-gray-500 max-w-2xl text-sm w-[400px]">
          Enter a Chart ID above to view the processed PDF document and
          extracted medical information.
        </p>
      </div>
    </div>
  );
}

export default PDFExtractor;
