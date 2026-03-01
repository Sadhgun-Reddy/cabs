import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import CommonFooter from "../../components/footer/commonFooter";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import ZoneMap from "../Zones/Google-Map";
import { URLS } from "../../url";

const LIBRARIES = ["places", "drawing"];
const DEFAULT_CENTER = { lat: 17.385044, lng: 78.486671 };

const EditPeakZones = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: URLS.GoogleMapsKey,
    libraries: LIBRARIES,
  });

  const [status, setStatus] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [mapCenter, setMapCenter] = useState({
    lat: 17.385044,
    lng: 78.486671,
  });
  const [polygonCoordinates, setPolygonCoordinates] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    searchLocation: "",
    priority: "",
    zoneType: "peak",
  });

  const autocompleteRef = useRef(null);

  // Fetch zone by ID
  useEffect(() => {
    if (!id) return;
    fetchZoneById();
  }, [id]);

  const fetchZoneById = async () => {
    try {
      const res = await axios.post(
        URLS.GetPeakZoneById,
        { id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const zone = res.data.zone;

      // `place` is an array – take first element or join
      const placeValue = Array.isArray(zone.place) ? zone.place[0] : zone.place;

      setFormData({
        name: zone.name,
        searchLocation: placeValue,
        priority: zone.priority,
        zoneType: zone.zoneType,
      });

      setStatus(zone.status === "active");

      // Convert locations to map format
      let coords = [];
      if (zone.location && zone.location.type === "Polygon" && zone.location.coordinates.length > 0) {
        // GeoJSON format: [lng, lat]
        coords = zone.location.coordinates[0].map((coord) => ({
          lat: coord[1],
          lng: coord[0],
        }));
      } else if (zone.locations && zone.locations.length > 0) {
        // Legacy format
        coords = zone.locations.map((loc) => ({
          lat: loc.latitude,
          lng: loc.longitude,
        }));
      }
      setPolygonCoordinates(coords);
    } catch (err) {
      console.error(err);
      setError("Failed to load zone data. Please try again.");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePolygonComplete = (coordinates) => {
    setPolygonCoordinates(coordinates);
  };

  // Handle place selection from Autocomplete
  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setMapCenter({ lat, lng });
        setFormData((prev) => ({
          ...prev,
          searchLocation: place.formatted_address || place.name,
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (polygonCoordinates.length < 3) {
      alert("Please draw a valid polygon (minimum 3 points)");
      return;
    }

    try {
      setLoading(true);

      // GeoJSON Polygon coordinates were requested in [longitude, latitude] order.
      // GeoJSON Polygons must be closed (the first and last point must be identical).
      const geoJsonCoordinates = polygonCoordinates.map((point) => [
        point.lng,
        point.lat,
      ]);

      if (geoJsonCoordinates.length > 0) {
        geoJsonCoordinates.push(geoJsonCoordinates[0]);
      }

      const payload = {
        name: formData.name,
        place: formData.searchLocation,
        priority: formData.priority,
        zoneType: formData.zoneType,
        status: status ? "active" : "inactive",
        location: {
          type: "Polygon",
          coordinates: [geoJsonCoordinates],
        },
      };

      await axios.put(`${URLS.EditPeakZone}/${id}`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("PeakZone Updated Successfully");
      navigate("/Peakzones");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to update peakzone";
      setError(msg);
      alert(`Update failed: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/Peakzones");
  };

  if (fetchLoading) {
    return (
      <div className="page-wrapper">
        <div
          className="content d-flex justify-content-center align-items-center"
          style={{ minHeight: "300px" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        <CommonFooter />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header d-flex justify-content-between align-items-center">
          <h4>Edit Peakzone</h4>
          <Link to="/Peakzones" className="btn btn-secondary">
            <i className="feather icon-arrow-left me-2" /> Back to Peakzones
          </Link>
        </div>

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
          {/* LEFT COLUMN – FORM + MAP */}
          <div className="col-lg-6">
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  {/* Zone Name */}
                  <div className="mb-3">
                    <label className="form-label">Zone Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Priority */}
                  <div className="mb-3">
                    <label className="form-label">Priority</label>
                    <input
                      type="number"
                      name="priority"
                      className="form-control"
                      value={formData.priority}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Search Location with Autocomplete */}
                  <div className="mb-3">
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
                          name="searchLocation"
                          className="form-control"
                          value={formData.searchLocation}
                          onChange={handleChange}
                          required
                        />
                      </Autocomplete>
                    ) : (
                      <input
                        type="text"
                        name="searchLocation"
                        className="form-control"
                        value={formData.searchLocation}
                        onChange={handleChange}
                        required
                        disabled
                      />
                    )}
                  </div>

                  {/* Map (inside the form, after fields) */}
                  <div className="mb-4">
                    <label className="form-label">
                      Zone Area (draw / edit)
                    </label>
                    <ZoneMap
                      isLoaded={isLoaded}
                      onPolygonComplete={handlePolygonComplete}
                      initialCoordinates={polygonCoordinates}
                      center={mapCenter}
                    />
                  </div>

                  {/* Status Toggle */}
                  <div className="mb-4">
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

                  {/* Form Buttons */}
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          />
                          Updating...
                        </>
                      ) : (
                        "Update Peakzone"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN – INSTRUCTIONS CARD */}
          <div className="col-lg-6">
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

export default EditPeakZones;
