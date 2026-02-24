import React, { useState } from "react";
import { Link } from "react-router";

const AddRolePermission = () => {
  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState({});

  const permissionModules = [
    "Dashboard",
    "Zones",
    "All Zones",
    "Add Zones",
    "Edit Zones",
    "Airport Zones",
    "All Airport Zones",
    "Add Airport Zones",
    "Edit Airport Zones",
    "Peak Zones",
    "All Peak Zones",
    "Add Peak Zones",
    "Edit Peak Zones",
    "Peak Zone Map",
    "Rider",
    "All Riders",
    "Rider Wallet",
    "Driver",
    "Verified Drivers",
    "Unverified Drivers",
    "Driver Rules",
    "Driver Location",
    "Driver Documents",
    "Withdraw Requests",
    "Driver Wallet",
    "Commission Histories",
    "Rides",
    "Ride Requests",
    "All Rides",
    "Scheduled Rides",
    "Accepted Rides",
    "Arrived Rides",
    "Startes Rides",
    "Cancelled Rides",
    "Completed Rides",
    "Service Types",
    "Service Categories",
    "Vehicle Group",
    "Vehicle Model",
    "Add Vehicle Group",
    "Edit Vehicle Group",
    "Add Vehicle Model",
    "Edit Vehicle Model",
    "Fare Manages",
    "Fare Plans",
    "Push Notifications",
    "Send Push Notification",
    "Advertising Banners",
    "Wallet Comments",
    "Surge Prices",
    "Add Surge Price",
    "Edit Surge Price",
    "Coupons",
    "Add Coupons",
    "Edit Coupons",
    "Preferences",
    "Add Preference",
    "Chats",
    "Manage Admin",
    "user",
    "Add User",
    "Edit User",
    "Role And Permission",
    "Add Role Permission",
    "Edit Role Permission",
    "Settings",
    "General Settings",
    "App Settings",
  ];

  const actions = ["All", "Index", "Create", "Edit", "Delete"];

  const handleCheckboxChange = (module, action) => {
    setPermissions((prev) => {
      const modulePermissions = prev[module] || {};

      // If clicking "All"
      if (action === "All") {
        const isAllChecked = modulePermissions["All"];

        let updatedModule = {};

        actions.forEach((act) => {
          updatedModule[act] = !isAllChecked;
        });

        return {
          ...prev,
          [module]: updatedModule,
        };
      }

      // If clicking other actions
      const updatedModule = {
        ...modulePermissions,
        [action]: !modulePermissions[action],
      };

      // Check if all actions except "All" are selected
      const allActionsSelected = actions
        .filter((act) => act !== "All")
        .every((act) => updatedModule[act]);

      updatedModule["All"] = allActionsSelected;

      return {
        ...prev,
        [module]: updatedModule,
      };
    });
  };

  const handleSelectAll = () => {
    const allSelected = permissionModules.every((module) =>
      actions.every((action) => permissions[module]?.[action]),
    );

    let updated = {};

    permissionModules.forEach((module) => {
      updated[module] = {};
      actions.forEach((action) => {
        updated[module][action] = !allSelected;
      });
    });

    setPermissions(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Role Name:", roleName);
    console.log("Permissions:", permissions);
  };

  return (
    <div className="page-wrapper">
      <div className="container mt-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4>Add Role & Permission</h4>

              <Link to="/Role-Permission" className="btn btn-secondary">
                <i className="feather icon-arrow-left me-2" />
                Back to Role
              </Link>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Role Name */}
              <div className="mb-3">
                <label className="form-label fw-bold">Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Role Name"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  required
                />
              </div>

              {/* Permissions */}
              <div className="mb-3">
                <label className="form-label fw-bold">Permissions</label>

                {/* Scrollable Container */}
                <div
                  style={{
                    maxHeight: "350px",
                    overflowY: "auto",
                    border: "1px solid #ddd",
                    padding: "15px",
                    borderRadius: "6px",
                    background: "#f9f9f9",
                  }}
                >
                  {/* Select All */}
                  <div className="mb-3">
                    <label className="fw-bold">
                      <input
                        type="checkbox"
                        className="form-check-input me-2"
                        onChange={handleSelectAll}
                      />
                      Select All Permissions
                    </label>
                  </div>

                  <hr />

                  {/* Permission Modules */}
                  {permissionModules.map((module, index) => (
                    <div
                      key={index}
                      className="d-flex align-items-center justify-content-between mb-3 p-2 bg-white rounded border"
                    >
                      <strong>{module}:</strong>

                      <div className="d-flex gap-3 flex-wrap">
                        {actions.map((action, i) => (
                          <label key={i} className="form-check-label">
                            <input
                              type="checkbox"
                              className="form-check-input me-1"
                              checked={permissions[module]?.[action] || false}
                              onChange={() =>
                                handleCheckboxChange(module, action)
                              }
                            />
                            {action}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-end mt-3">
                <button type="submit" className="btn btn-success">
                  Add Role
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRolePermission;
