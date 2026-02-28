import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import PrimeDataTable from "../../components/data-table";
import CommonFooter from "../../components/footer/commonFooter";
import SearchFromApi from "../../components/data-table/search";
import { URLS } from "../../url";

export default function FarePrices() {
    /* ===================== STATE ===================== */
    const [rows, setRows] = useState(10);
    const [selectedRows, setSelectedRows] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [popupMessage, setPopupMessage] = useState({
        show: false,
        text: "",
        type: "success",
    });

    const showPopup = (message, type = "success") => {
        setPopupMessage({ show: true, text: message, type });
        setTimeout(() => {
            setPopupMessage({ show: false, text: "", type: "success" });
        }, 3000);
    };

    /* ===================== FETCH ALL CITY FAIRS ===================== */
    const fetchCityFairs = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
                URLS.GetAllCityFairs,
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const cityFairs = res.data?.cityfairs || [];
            const formattedData = cityFairs.map((fair) => ({
                id: fair._id,
                zoneName: fair.zoneName || "--",
                vechilegroupName: fair.vechilegroupName || "--",
                fairPlanName: fair.fairPlanName || "--",
                taxName: fair.taxName || "--",
                baseFare: fair.baseFareCharge || "--",
                raw: fair,
            }));

            setTableData(formattedData);
        } catch (err) {
            console.error("Fetch City Fairs error", err);
            showPopup("Failed to load fare prices", "danger");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCityFairs();
    }, []);

    /* ===================== DELETE ===================== */
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this fare price?")) return;

        try {
            const token = localStorage.getItem("token");
            const res = await axios.delete(
                `${URLS.DeleteCityFair}/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.data?.success) {
                showPopup(res.data.message || "Deleted successfully", "success");
                fetchCityFairs(); // Refresh the list
            } else {
                showPopup(res.data?.message || "Failed to delete", "danger");
            }
        } catch (err) {
            console.error("Delete City Fair error", err);
            showPopup("Failed to delete the fare price", "danger");
        }
    };

    /* ===================== ROW SELECTION ===================== */
    const handleRowSelect = (id) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (checked) => {
        setSelectedRows(checked ? visibleData.map((row) => row.id) : []);
    };

    /* ===================== FILTER DATA ===================== */
    const visibleData = tableData
        .filter((item) => {
            const lowerQuery = searchQuery.toLowerCase();
            return (
                item.zoneName?.toLowerCase().includes(lowerQuery) ||
                item.fairPlanName?.toLowerCase().includes(lowerQuery) ||
                item.vechilegroupName?.toLowerCase().includes(lowerQuery)
            );
        })
        .map((item) => ({
            ...item,
            _selected: selectedRows.includes(item.id),
        }));

    /* ===================== COLUMNS ===================== */
    const columns = [
        {
            header: (
                <div className="form-check check-tables">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={
                            visibleData.length > 0 && selectedRows.length === visibleData.length
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                </div>
            ),
            body: (row) => (
                <div className="form-check check-tables">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={row._selected || false}
                        onChange={() => handleRowSelect(row.id)}
                    />
                </div>
            ),
        },
        {
            header: "Sl.No",
            body: (_row, options) => options.rowIndex + 1,
        },
        {
            header: "Zone Name",
            field: "zoneName",
        },
        {
            header: "Fair Plan",
            field: "fairPlanName",
        },
        {
            header: "Vehicle Group Name",
            field: "vechilegroupName",
        },
        {
            header: "Actions",
            body: (row) => (
                <div className="edit-delete-action d-flex align-items-center">
                    <Link
                        className="me-2 p-2"
                        to={`/setworldPrice`} // Adjust to your actual edit route if different
                        state={{ farePrice: row.raw }}
                        title="Edit"
                    >
                        <i className="ti ti-edit text-primary" />
                    </Link>

                    <Link
                        className="me-2 p-2"
                        to="#"
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
        },
    ];

    /* ===================== JSX ===================== */
    return (
        <div className="page-wrapper">
            <div className="content">
                {/* Popup Message */}
                {popupMessage.show && (
                    <div
                        className={`alert alert-${popupMessage.type} alert-dismissible fade show position-fixed top-0 end-0 m-3`}
                        style={{ zIndex: 9999, minWidth: "250px" }}
                        role="alert"
                    >
                        {popupMessage.text}
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() =>
                                setPopupMessage({ show: false, text: "", type: "success" })
                            }
                        />
                    </div>
                )}

                <div className="page-header d-flex justify-content-between align-items-center">
                    <h4>Fare Prices (City Fairs)</h4>
                    <Link to="/setworldPrice" className="btn btn-outline-success">
                        <i className="ti ti-circle-plus me-1" />
                        Add Fare Price
                    </Link>
                </div>

                <div className="card table-list-card">
                    <div className="card-header d-flex justify-content-between flex-wrap gap-2">
                        <div className="d-flex gap-2 flex-wrap align-items-center">
                            {/* Rows */}
                            <div className="dropdown">
                                <Link
                                    to="#"
                                    className="btn btn-white dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                >
                                    {rows}
                                </Link>
                                <ul className="dropdown-menu">
                                    {[10, 20, 30].map((num) => (
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

                            {loading && (
                                <div className="spinner-border spinner-border-sm text-primary ms-3" />
                            )}
                        </div>

                        <SearchFromApi
                            rows={rows}
                            setRows={setRows}
                            callback={(val) => setSearchQuery(val)}
                        />
                    </div>

                    <div className="card-body">
                        <div className="table-responsive">
                            <PrimeDataTable
                                column={columns}
                                data={visibleData}
                                totalRecords={visibleData.length}
                                rows={rows}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <CommonFooter />
        </div>
    );
}