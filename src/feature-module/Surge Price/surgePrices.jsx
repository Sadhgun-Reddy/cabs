
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import PrimeDataTable from "../../components/data-table";
import { URLS } from "../../url";
import CommonFooter from "../../components/footer/commonFooter";
import SearchFromApi from "../../components/data-table/search";

const SurgePrices = () => {
  /* ===================== STATE ===================== */
  const [rows, setRows] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectionVersion, setSelectionVersion] = useState(0);

  /* ===================== FETCH DATA ===================== */
  const fetchSurgePrices = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.post(URLS.GetAllSurgePrices, {}, { headers });
      
      if (res.data.success && res.data.surges) {
        setTableData(res.data.surges.map(item => ({...item, id: item._id})));
      } else {
        toast.error(res.data.message || "Failed to fetch surge prices");
      }
    } catch (error) {
      console.error("Error fetching surge prices:", error);
      toast.error("An error occurred while fetching surge prices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurgePrices();
  }, []);

  /* ===================== HANDLERS ===================== */
  const handleSearch = (value) => setSearchQuery(value);

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return tableData;
    const query = searchQuery.toLowerCase();
    return tableData.filter(
      (item) =>
        item.zoneName?.toLowerCase().includes(query) ||
        item.fairPlanName?.toLowerCase().includes(query) ||
        item.vechilegroupName?.toLowerCase().includes(query) ||
        item.day?.toLowerCase().includes(query)
    );
  }, [tableData, searchQuery]);

  const allVisibleSelected = useMemo(() => {
    return (
      filteredData.length > 0 &&
      filteredData.every((row) => selectedRows.includes(row.id))
    );
  }, [filteredData, selectedRows]);

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
    setSelectionVersion((v) => v + 1);
  };

  const handleSelectAll = (checked) => {
    setSelectedRows((prev) => {
      const visibleIds = filteredData.map((row) => row.id);
      if (checked) {
        return [...new Set([...prev, ...visibleIds])];
      } else {
        return prev.filter((id) => !filteredData.some((row) => row.id === id));
      }
    });
    setSelectionVersion((v) => v + 1);
  };

  /* ===================== BULK ACTIONS ===================== */

  const handleBulkStatus = (status) => {
    if (!selectedRows.length) return;

    const newStatus = status ? "active" : "inactive";
    setTableData((prev) =>
      prev.map((item) =>
        selectedRows.includes(item.id) ? { ...item, status: newStatus } : item,
      ),
    );
    setSelectedRows([]);
  };

  /* ===================== COLUMNS ===================== */

  const columns = useMemo(
    () => [
      {
        header: (
          <div className="form-check check-tables text-center">
            <input
              className="form-check-input"
              type="checkbox"
              id="select-all"
              checked={allVisibleSelected}
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="select-all"></label>
          </div>
        ),
        body: (row) => (
          <div className="form-check check-tables text-center">
            <input
              className="form-check-input"
              type="checkbox"
              id={`select-${row.id}`}
              checked={selectedRows.includes(row.id)}
              onChange={() => handleRowSelect(row.id)}
            />
            <label
              className="form-check-label"
              htmlFor={`select-${row.id}`}
            ></label>
          </div>
        ),
        className: "text-center",
      },
      {
        header: <div className="text-center">Sl.No</div>,
        body: (_row, options) => (
          <div className="text-center">{options.rowIndex + 1}</div>
        ),
        className: "text-center",
      },
      {
        header: <div className="text-center">Peak Zone</div>,
        field: "zoneName",
        className: "text-center",
      },
      {
        header: <div className="text-center">Fair Plan</div>,
        field: "fairPlanName",
        className: "text-center",
      },
      {
        header: <div className="text-center">Vehicle Group</div>,
        field: "vechilegroupName",
        className: "text-center",
      },
      {
        header: <div className="text-center">Percentage (%)</div>,
        field: "percentage",
        className: "text-center",
      },
      {
        header: <div className="text-center">Day</div>,
        field: "day",
        className: "text-center",
      },
      {
        header: <div className="text-center">Start Time</div>,
        field: "startTime",
        className: "text-center",
      },
      {
        header: <div className="text-center">End Time</div>,
        field: "endTime",
        className: "text-center",
      },
      {
        header: <div className="text-center">Status</div>,
        body: (row) => (
          <div className="text-center">
            <span
              className={`badge ${
                row.status === "active" ? "bg-success" : "bg-danger"
              }`}
            >
              {row.status === "active" ? "Active" : "Inactive"}
            </span>
          </div>
        ),
        className: "text-center",
      },
      {
        header: <div className="text-center">Created Date</div>,
        body: (row) => (
          <div className="text-center">
            {row?.logCreatedDate
              ? new Date(row.logCreatedDate).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              : "--"}
          </div>
        ),
        className: "text-center",
      },
      {
        header: <div className="text-center">Actions</div>,
        body: (row) => (
          <div className="edit-delete-action d-flex justify-content-center">
            <Link
              className="me-2 p-2"
              to="/editSurgePrice"
              state={{ surgeData: row }}
              title="Edit Details"
            >
              <i className="ti ti-edit text-primary" />
            </Link>
            <Link
              to="#"
              className="p-2"
              title="Delete"
              onClick={(e) => {
                e.preventDefault();
                handleDelete(row.id);
              }}
            >
              <i className="ti ti-trash text-danger" />
            </Link>
          </div>
        ),
        className: "text-center",
      },
    ],
    [selectedRows, tableData, filteredData, allVisibleSelected],
  );

  /* ===================== DELETE LOGIC ===================== */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this surge price?")) return;

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.delete(`${URLS.DeleteSurgePrice}${id}`, { headers });

      if (res.data.success) {
        toast.success(res.data.message || "Surge price deleted successfully");
        fetchSurgePrices(); // Refresh data
      } else {
        toast.error(res.data.message || "Failed to delete surge price");
      }
    } catch (error) {
      console.error("Error deleting surge price:", error);
      toast.error("An error occurred while deleting");
    }
  };

  /* ===================== JSX ===================== */

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header d-flex justify-content-between">
          <div>
            <h4>Surge Prices</h4>
            {/* <h6>Manage Your Zones</h6> */}
          </div>
          <Link to="/addSurgePrice" className="btn btn-primary">
            <i className="ti ti-circle-plus me-1" /> Add New Surge Price
          </Link>
        </div>

        <div className="card table-list-card">
          <div className="card-header d-flex justify-content-between flex-wrap gap-2">
            <div className="d-flex gap-2 flex-wrap">
              {/* Rows Dropdown */}
              <div className="dropdown">
                <Link
                  to="#"
                  className="btn btn-white dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  {rows}
                </Link>
                <ul className="dropdown-menu">
                  {[5, 10, 15, 20, 25].map((num) => (
                    <li key={num}>
                      <Link
                        to="#"
                        className="dropdown-item"
                        onClick={() => setRows(num)}
                      >
                        {num}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bulk Actions */}
              <div className="dropdown">
                <Link
                  to="#"
                  className="btn btn-white dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  Bulk Actions
                </Link>
                <ul className="dropdown-menu">
                  <li>
                    <Link
                      to="#"
                      className="dropdown-item text-success"
                      onClick={() => handleBulkStatus(true)}
                    >
                      Active
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      className="dropdown-item text-danger"
                      onClick={() => handleBulkStatus(false)}
                    >
                      Inactive
                    </Link>
                  </li>
                </ul>
              </div>

              <button
                className="btn btn-outline-success"
                disabled={!selectedRows.length}
              >
                Apply
              </button>
            </div>

            <SearchFromApi
              callback={handleSearch}
              rows={rows}
              setRows={setRows}
            />
          </div>

          <div className="card-body">
            <PrimeDataTable
              key={selectionVersion}
              column={columns}
              data={filteredData}
              totalRecords={filteredData.length}
              rows={rows}
            />
          </div>
        </div>
      </div>

      <CommonFooter />
    </div>
  );
}

export default SurgePrices;

// import { useState } from "react";
// import { Link } from "react-router-dom";

// const EditSurgePrice = () => {
//   const [formData, setFormData] = useState({
//     startTime: "",
//     endTime: "",
//     day: "",
//     status: "Active",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log(formData);
//   };

//   return (
//     <div className="page-wrapper">
//       <div className="content">
        
//         {/* Page Header */}
//         <div className="page-header d-flex justify-content-between align-items-center">
//           <div>
//             <h4>Edit Surge Price</h4>
//             <h6 className="text-muted">Update surge pricing details</h6>
//           </div>
//           <Link to="/surgePrices" className="btn btn-light">
//             <i className="ti ti-arrow-left me-1" /> Back to Surge Prices
//           </Link>
//         </div>

//         {/* Card */}
//         <div className="card">
//           <div className="card-body">
//             <form onSubmit={handleSubmit}>
              
//               {/* Start Time & End Time - Same Row */}
//               <div className="row">
//                 <div className="col-md-6 mb-3">
//                   <label className="form-label fw-semibold">
//                     Start Time <span className="text-danger">*</span>
//                   </label>
//                   <input
//                     type="time"
//                     name="startTime"
//                     className="form-control"
//                     value={formData.startTime}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label className="form-label fw-semibold">
//                     End Time <span className="text-danger">*</span>
//                   </label>
//                   <input
//                     type="time"
//                     name="endTime"
//                     className="form-control"
//                     value={formData.endTime}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Day Dropdown */}
//               <div className="row">
//                 <div className="col-md-6 mb-3">
//                   <label className="form-label fw-semibold">
//                     Day <span className="text-danger">*</span>
//                   </label>
//                   <select
//                     name="day"
//                     className="form-select"
//                     value={formData.day}
//                     onChange={handleChange}
//                     required
//                   >
//                     <option value="">Select Day</option>
//                     <option value="Monday">Monday</option>
//                     <option value="Tuesday">Tuesday</option>
//                     <option value="Wednesday">Wednesday</option>
//                     <option value="Thursday">Thursday</option>
//                     <option value="Friday">Friday</option>
//                     <option value="Saturday">Saturday</option>
//                     <option value="Sunday">Sunday</option>
//                   </select>
//                 </div>

//                 {/* Status */}
//                 <div className="col-md-6 mb-3">
//                   <label className="form-label fw-semibold">
//                     Status
//                   </label>
//                   <select
//                     name="status"
//                     className="form-select"
//                     value={formData.status}
//                     onChange={handleChange}
//                   >
//                     <option value="Active">Active</option>
//                     <option value="Inactive">Inactive</option>
//                   </select>
//                 </div>
//               </div>

//               {/* Buttons */}
//               <div className="d-flex justify-content-end mt-3">
//                 <Link
//                   to="/surgePrices"
//                   className="btn btn-light me-2"
//                 >
//                   Cancel
//                 </Link>
//                 <button type="submit" className="btn btn-primary">
//                   <i className="ti ti-device-floppy me-1" />
//                   Update Surge
//                 </button>
//               </div>

//             </form>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default EditSurgePrice;
