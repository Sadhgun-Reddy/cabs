
import "bootstrap/dist/css/bootstrap.min.css";
import { useRef } from "react";
import CommonFooter from "../../components/footer/commonFooter";

const HeatMap = () => {
  const mapRef = useRef(null);

  const handleFullScreen = () => {
    if (mapRef.current.requestFullscreen) {
      mapRef.current.requestFullscreen();
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="container-fluid py-4" style={{ background: "#f4f6f9" }}>
          <div className="row">
            <div className="col-12">

              {/* ===== Heat Map Card ===== */}
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body">

                  {/* Header */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0">Heat Map</h5>

                    <button
                      className="btn btn-primary btn-sm"
                      onClick={handleFullScreen}
                    >
                      <i className="ti ti-maximize me-1"></i>
                      Full Screen
                    </button>
                  </div>

                  {/* Map Container */}
                  <div
                    ref={mapRef}
                    className="rounded-3 overflow-hidden"
                    style={{
                      height: "400px",
                      background:
                        "linear-gradient(135deg, #dfe9f3 0%, #ffffff 100%)",
                    }}
                  >
                    <iframe
                      title="Heat Map"
                      className="w-100 h-100"
                      frameBorder="0"
                      scrolling="no"
                      src="https://maps.google.com/maps?width=600&height=400&hl=en&q=Hyderabad&t=&z=14&ie=UTF8&iwloc=B&output=embed"
                      allowFullScreen
                    ></iframe>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <CommonFooter />
    </div>
  );
};

export default HeatMap;
