import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import PrimeDataTable from "../../components/data-table";
import CommonFooter from "../../components/footer/commonFooter";
import SearchFromApi from "../../components/data-table/search";
import { URLS } from "../../url";

export default function VehicleZone() {
  const location = useLocation();
  const groupName = location.state?.groupName;

  /* ===================== STATE ===================== */
  const [rows, setRows] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ===================== API FETCH ===================== */
  const fetchZones = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        URLS.GetAllZones,
        { zoneType: "normal" },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data?.success) {
        const formattedZones = response.data.zones.map((zone) => ({
          ...zone,
          id: zone._id,
          Status: zone.status === "active",
        }));
        setTableData(formattedZones);
      } else {
        setError(response.data?.message || "Failed to fetch zones");
      }
    } catch (err) {
      console.error("Error fetching zones:", err);
      setError("An error occurred while fetching zones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

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
      field: "name",
    },
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
            <h4>Vehicle Types Zones {groupName ? `- ${groupName}` : ""}</h4>
          </div>
          <Link to="#" className="btn btn-outline-success">
            <i className="ti ti-info-circle me-1" />
            Calculated
          </Link>
        </div>

        <div className="card table-list-card">
          <div className="card-body">
            {loading && <div className="text-center py-3">Loading...</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            {!loading && !error && (
              <PrimeDataTable
                column={columns}
                data={tableData}
                totalRecords={tableData.length}
                rows={rows}
              />
            )}
          </div>
        </div>
      </div>

      <CommonFooter />
    </div>
  );
}
