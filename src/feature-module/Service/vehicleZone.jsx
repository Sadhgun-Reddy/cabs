import { useState } from "react";
import { Link } from "react-router-dom";
import PrimeDataTable from "../../components/data-table";
import { CouponData } from "../../core/json/Coupons";
import EditZones from "../../core/modals/coupons/editcoupons";
import CommonFooter from "../../components/footer/commonFooter";
import DeleteModal from "../../components/delete-modal";
import SearchFromApi from "../../components/data-table/search";

export default function VehicleZone() {
  /* ===================== STATE ===================== */
  const [rows, setRows] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);

  const [tableData, setTableData] = useState(
    CouponData.map((item) => ({
      ...item,
      Status: item.Status ?? true,
    })),
  );

  /* ===================== HANDLERS ===================== */

  const handleSearch = (value) => setSearchQuery(value);

  const toggleStatus = (id) => {
    setTableData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, Status: !item.Status } : item,
      ),
    );
  };

  /* ===================== ROW SELECTION ===================== */

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  const handleSelectAll = (checked) => {
    setSelectedRows(checked ? tableData.map((row) => row.id) : []);
  };

  /* ===================== BULK ACTIONS ===================== */

  const handleBulkStatus = (status) => {
    if (!selectedRows.length) return;

    setTableData((prev) =>
      prev.map((item) =>
        selectedRows.includes(item.id) ? { ...item, Status: status } : item,
      ),
    );
    setSelectedRows([]);
  };

  /* ===================== COLUMNS ===================== */

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
      header: "Zone Name",
      field: "zonename",
    },
    // {
    //   header: "Currency Code",
    //   field: "currencycode",
    // },
    {
      header: "Priority",
      field: "priority",
    },
    {
      header: "Actions",
      body: () => (
        <div className="edit-price-zone-action">
          <Link className="btn btn-outline-success me-2 p-2" to="/setworldPrice">
            Set Price
          </Link>
          <Link to="/addIncentive" className="btn btn-outline-success me-2 p-2">
            Add Incentive
          </Link>
        </div>
      ),
    },
  ];

  /* ===================== JSX ===================== */

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header d-flex justify-content-between">
          <div>
            <h4>Vehicle Types Zones</h4>
          </div>
          <Link to="#" className="btn btn-outline-success">
            <i className="ti ti-info-circle me-1" />
            Calculated
          </Link>
        </div>

        <div className="card table-list-card">
          <div className="card-body">
            <PrimeDataTable
              column={columns}
              data={tableData}
              totalRecords={tableData.length}
              rows={rows}
            />
          </div>
        </div>
      </div>

      <CommonFooter />
    </div>
  );
}
