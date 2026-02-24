import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import axios from "axios";
import { all_routes } from "../../routes/all_routes";
import CommonFooter from "../../components/footer/commonFooter";
import { URLS } from "../../url";
import ZoneMap from "./Google-Map";

// Stable libraries array – prevents script reload
const LIBRARIES = ["places", "drawing"];
const DEFAULT_CENTER = { lat: 17.385044, lng: 78.486671 };

const Addzones = () => {
  const navigate = useNavigate();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: URLS.GoogleMapsKey,
    libraries: LIBRARIES,
  });

  const [status, setStatus] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [polygonCoordinates, setPolygonCoordinates] = useState([]);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [formData, setFormData] = useState({
    name: "",
    place: "",
    priority: "",
    zoneType: "normal",
  });

  const autocompleteRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePolygonComplete = (coordinates) => {
    setPolygonCoordinates(coordinates);
  };

  // Called when user selects a place from autocomplete dropdown
  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setMapCenter({ lat, lng });
        setFormData((prev) => ({
          ...prev,
          place: place.formatted_address || place.name,
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (polygonCoordinates.length < 3) {
      alert("Please draw a polygon with at least 3 points on the map.");
      return;
    }

    try {
      setLoading(true);

      const locations = polygonCoordinates.map((point) => ({
        latitude: point.lat,
        longitude: point.lng,
      }));

      const payload = {
        name: formData.name,
        place: formData.place,
        priority: formData.priority,
        locations: locations,
        zoneType: formData.zoneType,
        status: status ? "active" : "inactive",
      };

      await axios.post(URLS.AddZone, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("Zone Added Successfully");
      navigate("/Zones");
    } catch (err) {
      console.error(err);
      setError("Failed to Add zone");
      alert("Error adding zone. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/Zones");
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        {/* Page Header */}
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Create Addzones</h4>
            </div>
          </div>
          <ul className="table-top-head">
            <li>
              <div className="page-btn">
                <Link to="/Zones" className="btn btn-secondary">
                  <i className="feather icon-arrow-left me-2" />
                  Back to zones
                </Link>
              </div>
            </li>
          </ul>
        </div>

        {/* Error display */}
        {error && (
          <div
            className="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => setError("")}
              aria-label="Close"
            />
          </div>
        )}

        <div className="row">
          {/* LEFT COLUMN – FORM */}
          <div className="col-lg-6 col-md-6 col-12">
            <form onSubmit={handleSubmit}>
              <div className="add-Addzones">
                <div className="card border mb-4">
                  <h2 className="card-header" id="headingSpacingOne">
                    <div className="d-flex align-items-center justify-content-between flex-fill">
                      <h5 className="d-flex align-items-center">
                        <i className="feather icon-info text-primary me-2" />
                        <span>Addzones Information</span>
                      </h5>
                    </div>
                  </h2>

                  <div className="accordion-body border-top">
                    {/* Zone Name */}
                    <div className="row">
                      <div className="col-sm-6 col-12 w-100">
                        <div className="mb-3">
                          <label className="form-label">Zone Name</label>
                          <input
                            type="text"
                            name="name"
                            className="form-control"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter Zone Name"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Priority */}
                    <div className="row">
                      <div className="col-sm-6 col-12 w-100">
                        <div className="mb-3 list position-relative">
                          <label className="form-label">Priority</label>
                          <input
                            type="number"
                            name="priority"
                            className="form-control"
                            value={formData.priority}
                            onChange={handleChange}
                            placeholder="Enter Priority"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Search Location with Autocomplete */}
                    <div className="row">
                      <div className="col-sm-6 col-12 w-100">
                        <div className="mb-3 list position-relative">
                          <label className="form-label">Search Location</label>
                          {isLoaded ? (
                            <Autocomplete
                              onLoad={(autocomplete) => {
                                autocompleteRef.current = autocomplete;
                              }}
                              onPlaceChanged={onPlaceChanged}
                            >
                              <input
                                type="text"
                                name="place"
                                className="form-control"
                                value={formData.place}
                                onChange={handleChange}
                                placeholder="Enter a location to center the map"
                                required
                              />
                            </Autocomplete>
                          ) : (
                            <input
                              type="text"
                              className="form-control"
                              disabled
                              placeholder="Loading maps..."
                            />
                          )}
                          <small className="text-muted">
                            Type a location and select from the dropdown to
                            center the map.
                          </small>
                        </div>
                      </div>
                    </div>

                    {/* Zone Type Dropdown (commented out as original) */}
                    {/* <div className="row">
                      <div className="col-sm-6 col-12 w-100">
                        <div className="mb-3">
                          <label className="form-label">Zone Type</label>
                          <select
                            name="zoneType"
                            className="form-control"
                            value={formData.zoneType}
                            onChange={handleChange}
                            required
                          >
                            <option value="peak">Peak</option>
                            <option value="normal">Normal</option>
                            <option value="off-peak">Off-Peak</option>
                          </select>
                        </div>
                      </div>
                    </div> */}

                    {/* Map */}
                    <div className="row">
                      <div className="mb-3 list position-relative">
                        <label className="form-label">Draw Zone on Map</label>
                      </div>
                      <ZoneMap
                        isLoaded={isLoaded}
                        onPolygonComplete={handlePolygonComplete}
                        center={mapCenter}
                      />
                    </div>

                    {/* Status Toggle */}
                    <div className="row">
                      <div className="col-lg-6 col-sm-6 col-12">
                        <div className="row">
                          <div className="col-lg-6 col-sm-6 col-12">
                            <div className="mb-3">
                              <label className="form-label">Status</label>
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="zoneStatus"
                                  checked={status}
                                  onChange={() => setStatus(!status)}
                                />
                                <label
                                  className="form-check-label ms-2"
                                  htmlFor="zoneStatus"
                                >
                                  {status ? "Active" : "Inactive"}
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="col-lg-12">
                <div className="d-flex align-items-center justify-content-end mb-4">
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Adding..." : "Add Zone"}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* RIGHT COLUMN – INSTRUCTIONS CARD */}
          <div className="col-lg-6 col-md-6 col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Instructions</h5>
              </div>
              <div className="card-body">
                <ul className="list-unstyled mb-0">
                  <li className="mb-2">
                    Click on the map to move to the desired location.
                  </li>
                  <li className="mb-2">
                    You need at least three points to create a zone.
                  </li>
                  <li className="mb-2">
                    Use the drawing tool to outline the zone.
                  </li>
                  <li className="mb-2">
                    Use the search field to center the map on a specific place.
                  </li>
                </ul>
                <img
                  src="/src/assets/img/taxido-osm.gif"
                  alt="Zone drawing instructions"
                  className="img-fluid rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <CommonFooter />
    </div>
  );
};

export default Addzones;
