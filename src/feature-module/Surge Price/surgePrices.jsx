
import { useState } from "react";
import { Link } from "react-router-dom";
import PrimeDataTable from "../../components/data-table";
import { CouponData } from "../../core/json/Coupons";
import EditZones from "../../core/modals/coupons/editcoupons";
import CommonFooter from "../../components/footer/commonFooter";
import DeleteModal from "../../components/delete-modal";
import SearchFromApi from "../../components/data-table/search";

export default function SurgePrices() {
  /* ===================== STATE ===================== */
  const [rows, setRows] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);

  const [tableData, setTableData] = useState(
    CouponData.map((item) => ({
      ...item,
      Status: item.Status ?? true, // default Active
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
      header: "Day",
      field: "day",
    },
    {
      header: "Start Time",
      field: "starttime",
    },
    {
      header: "End Time",
      field: "endtime",
    },
    {
      header: "Status",
      body: (row) => (
        <div className="form-check form-switch">
          <input
            type="checkbox"
            className={`form-check-input ${
              row.Status ? "bg-success" : "bg-danger"
            }`}
            checked={row.Status}
            onChange={() => toggleStatus(row.id)}
          />
        </div>
      ),
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
    {
      header: "Actions",
      body: () => (
        <div className="edit-delete-action">
          <Link
            className="me-2 p-2"
            to="/editSurgePrice"
            title="Day Details"
            // data-bs-toggle="modal"
            // data-bs-target="#edit-units"
          >
            <i className="ti ti-edit" />
          </Link>
          <Link
            to="#"
            className="p-2"
            title="Delete"
            // data-bs-toggle="modal"
            // data-bs-target="#delete-modal"
          >
            <i className="ti ti-trash" />
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
              column={columns}
              data={tableData}
              totalRecords={tableData.length}
              rows={rows}
            />
          </div>
        </div>
      </div>

      <CommonFooter />
      <EditZones />
      <DeleteModal />
    </div>
  );
}



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
