import "bootstrap/dist/css/bootstrap.min.css";
import CommonFooter from "../../components/footer/commonFooter";

const SosAlertDetails = () => {
  const generalDetails = [
    ["Ride Number", "#10032"],
    ["Ride Status", "Completed"],
    ["Payment Status", "Cash"],
    ["Service", "Cab"],
    ["Service Category", "Rental"],
    ["Start Ride OTP", "2222"],
    ["Total Distance", "10KM"],
    ["Zone", "Hyderabad"],
  ];

  const sosalertDetails = [
    ["Status", "Requested"],
    ["Alert Time", "2026-02-18 15:46:31 PM"],
    ["Created By", "Daniel Miller"],
  ];

  return (
    <div className="page-wrapper">
      <div className="container-fluid py-4" style={{ background: "#f4f6f9" }}>
        <div className="container">
          {/* HEADER */}

          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0">Sos Alert Details</h4>

            <div style={{ minWidth: "180px" }}>
              <select className="form-select">
                <option value="requested">Requested</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="row g-4">
            {/* LEFT SIDE */}
            <div className="col-lg-6">
              {/* GENERAL DETAILS */}
              <div className="card shadow-sm border-0 rounded-4 mb-4">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4">General Details</h5>

                  {generalDetails.map((item, index) => (
                    <div
                      key={index}
                      className="d-flex justify-content-between border-bottom py-2"
                    >
                      <span className="text-muted">{item[0]}</span>
                      <span className="fw-semibold">{item[1]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="col-lg-6">
              {/* SOS ALERT DETAILS */}

              <div className="card shadow-sm border-0 rounded-4 mb-4">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4">Sos Alert Details</h5>

                  {sosalertDetails.map((item, index) => (
                    <div
                      key={index}
                      className="d-flex justify-content-between border-bottom py-2"
                    >
                      <span className="text-muted">{item[0]}</span>
                      <span className="fw-semibold">{item[1]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* -------- Map View -------- */}

            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">Location Map</h5>
                <div
                  className="rounded-3"
                  style={{
                    height: "400px",
                    background:
                      "linear-gradient(135deg, #dfe9f3 0%, #ffffff 100%)",
                  }}
                >
                  <iframe
                    class="embed-map-frame"
                    frameborder="0"
                    scrolling="no"
                    marginheight="0"
                    marginwidth="0"
                    width={"100%"}
                    height={400}
                    src="https://maps.google.com/maps?width=600&height=400&hl=en&q=Hyderabad&t=&z=14&ie=UTF8&iwloc=B&output=embed"
                  ></iframe>
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

export default SosAlertDetails;
