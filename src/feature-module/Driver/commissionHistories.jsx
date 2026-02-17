import { useState } from "react";
import { Link } from "react-router-dom";
import PrimeDataTable from "../../components/data-table";
import { CouponData } from "../../core/json/Coupons";
import EditZones from "../../core/modals/coupons/editcoupons";
import CommonFooter from "../../components/footer/commonFooter";
import DeleteModal from "../../components/delete-modal";
import SearchFromApi from "../../components/data-table/search";
import { Search } from "react-feather";

export default function Commissionhostories() {
  /* ===================== STATE ===================== */
  const [searchQuery, setSearchQuery] = useState("");
  const [rows, setRows] = useState(5);
  const [tableData, setTableData] = useState(CouponData);
  const [selectedRows, setSelectedRows] = useState([]);

  /* ===================== HANDLERS ===================== */

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  const handleSelectAll = (checked) => {
    setSelectedRows(checked ? tableData.map((row) => row.id) : []);
  };

//   const toggleStatus = (id) => {
//     setTableData((prev) =>
//       prev.map((item) =>
//         item.id === id ? { ...item, Status: !item.Status } : item,
//       ),
//     );
//   };

  /* ===================== COLUMNS ===================== */

//   const handleBulkAction = (type) => {
//     if (!selectedRows.length) return;

//     if (type === "active") {
//       setTableData((prev) =>
//         prev.map((item) =>
//           selectedRows.includes(item.id) ? { ...item, Status: true } : item,
//         ),
//       );
//     }

//     if (type === "inactive") {
//       setTableData((prev) =>
//         prev.map((item) =>
//           selectedRows.includes(item.id) ? { ...item, Status: false } : item,
//         ),
//       );
//     }
//   };

  const columns = [
    {
      header: (
        <input
          type="checkbox"
          checked={
            tableData.length > 0 && selectedRows.length === tableData.length
          }
          onChange={(e) => handleSelectAll(e.target.checked)}
        />
      ),
      body: (row) => (
        <input
          type="checkbox"
          checked={selectedRows.includes(row.id)}
          onChange={() => handleRowSelect(row.id)}
        />
      ),
    },
    {
      header: "Sl.No",
      body: (_row, options) => options.rowIndex + 1,
    },
    {
      header: "Ride Number",
      field: "ridenumber",
    },
    {
      header: "Driver",
      field: "driver",
    },
    {
      header: "Admin Commission",
      field: "admincommission",
    },
    {
      header: "Driver Commission",
      field: "drivercommission",
    },
    {
      header: "Fleet Commission",
      field: "fleetcommission",
    },
    {
      header: "Created Date",
      body: (row) =>
        row?.date
          ? new Date(row.date).toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
            })
          : "--",
    },
  ];

  /* ===================== JSX ===================== */

  return (
    <div>   
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Commission Histories</h4>
            </div>
          </div>

          <div className="card table-list-card">
            <div className="card-header d-flex justify-content-between">
              <div className="d-flex align-items-center gap-2 flex-wrap">
              </div>
              <SearchFromApi
                callback={handleSearch}
                rows={rows}
                setRows={setRows}
              />
            </div>

            <div className="card-body">
              <div className="table-responsive">
                <PrimeDataTable
                  column={columns}
                  data={tableData}
                  totalRecords={tableData.length}
                  rows={rows}
                />
              </div>
            </div>
          </div>
        </div>

        <CommonFooter />
      </div>
    </div>
  );
}
