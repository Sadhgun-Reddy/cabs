import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
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

    const [zones, setZones] = useState([]);
    const [fairPlans, setFairPlans] = useState([]);
    const [vehicleGroups, setVehicleGroups] = useState([]);

    const [selectedZone, setSelectedZone] = useState(null);
    const [selectedFairPlan, setSelectedFairPlan] = useState(null);
    const [selectedVehicleGroup, setSelectedVehicleGroup] = useState(null);

    const showPopup = (message, type = "success") => {
        setPopupMessage({ show: true, text: message, type });
        setTimeout(() => {
            setPopupMessage({ show: false, text: "", type: "success" });
        }, 3000);
    };

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const token = localStorage.getItem("token");
                const headers = { Authorization: `Bearer ${token}` };

                const [zonesRes, plansRes, groupsRes] = await Promise.all([
                    axios.post(URLS.GetActiveNormalZones, {}, { headers }),
                    axios.post(URLS.GetActiveFairPlans, {}, { headers }),
                    axios.post(URLS.GetActiveVehicleGroups, {}, { headers }),
                ]);

                if (zonesRes.data?.zones) setZones(zonesRes.data.zones);
                if (plansRes.data?.fairPlans) setFairPlans(plansRes.data.fairPlans);
                if (groupsRes.data?.groups) setVehicleGroups(groupsRes.data.groups);
            } catch (err) {
                console.error("Error fetching filters", err);
            }
        };
        fetchFilters();
    }, []);

    /* ===================== FETCH ALL CITY FAIRS ===================== */
    const fetchCityFairs = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");

            const payload = {};
            if (selectedZone) payload.zoneId = selectedZone.value;
            if (selectedVehicleGroup) payload.vehicleGroupId = selectedVehicleGroup.value;
            if (selectedFairPlan) payload.fairPlanId = selectedFairPlan.value;

            const res = await axios.post(
                URLS.GetAllCityFairs,
                payload,
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
                baseFareCharge: fair.baseFareCharge || "--",
                baseDistance: fair.baseDistance || "--",
                perDistanceCharge: fair.perDistanceCharge || "--",
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
    }, [selectedZone, selectedFairPlan, selectedVehicleGroup]);

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
        // {
        //     header: (
        //         <div className="form-check check-tables text-center">
        //             <input
        //                 className="form-check-input"
        //                 type="checkbox"
        //                 checked={
        //                     visibleData.length > 0 && selectedRows.length === visibleData.length
        //                 }
        //                 onChange={(e) => handleSelectAll(e.target.checked)}
        //             />
        //         </div>
        //     ),
        //     body: (row) => (
        //         <div className="form-check check-tables text-center">
        //             <input
        //                 className="form-check-input"
        //                 type="checkbox"
        //                 checked={row._selected || false}
        //                 onChange={() => handleRowSelect(row.id)}
        //             />
        //         </div>
        //     ),
        //     className: "text-center",
        // },
        {
            header: <div className="text-center">Sl.No</div>,
            body: (_row, options) => <div className="text-center">{options.rowIndex + 1}</div>,
            className: "text-center",
        },
        {
            header: <div className="text-center">Zone Name</div>,
            field: "zoneName",
            className: "text-center",
        },
        {
            header: <div className="text-center">Fair Plan</div>,
            field: "fairPlanName",
            className: "text-center",
        },
        {
            header: <div className="text-center">Vehicle Group Name</div>,
            field: "vechilegroupName",
            className: "text-center",
        },
        {
            header: <div className="text-center">Base Fare Charge</div>,
            field: "baseFareCharge",
            className: "text-center",
        },
        {
            header: <div className="text-center">Base Distance (Km)</div>,
            field: "baseDistance",
            className: "text-center",
        },
        {
            header: <div className="text-center">Per Distance Charge</div>,
            field: "perDistanceCharge",
            className: "text-center",
        },
        {
            header: <div className="text-center">Actions</div>,
            body: (row) => (
                <div className="edit-delete-action d-flex align-items-center justify-content-center">
                    <Link
                        className="me-2 p-2"
                        to={`/setworldPrice`}
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
                    <h4>Fare Prices</h4>
                    <Link to="/setworldPrice" className="btn btn-outline-success">
                        <i className="ti ti-circle-plus me-1" />
                        Add Fare Price
                    </Link>
                </div>

                <div className="card table-list-card">
                    <div className="card-body pb-0 mt-3 mx-3">
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label className="form-label">Zone</label>
                                <Select
                                    classNamePrefix="react-select"
                                    options={zones.map((z) => ({ value: z._id, label: z.name }))}
                                    value={selectedZone}
                                    onChange={setSelectedZone}
                                    isClearable
                                    placeholder="Filter by Zone"
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Vehicle Group</label>
                                <Select
                                    classNamePrefix="react-select"
                                    options={vehicleGroups.map((vg) => ({ value: vg._id, label: vg.name }))}
                                    value={selectedVehicleGroup}
                                    onChange={setSelectedVehicleGroup}
                                    isClearable
                                    placeholder="Filter by Vehicle Group"
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Fare Plan</label>
                                <Select
                                    classNamePrefix="react-select"
                                    options={fairPlans.map((fp) => ({ value: fp._id, label: fp.planName }))}
                                    value={selectedFairPlan}
                                    onChange={setSelectedFairPlan}
                                    isClearable
                                    placeholder="Filter by Fare Plan"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="card-header d-flex justify-content-between flex-wrap gap-2 border-top-0">
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