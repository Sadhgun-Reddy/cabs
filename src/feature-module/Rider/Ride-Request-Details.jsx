import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaStar } from "react-icons/fa";

const RideRequestDetails = () => {
  const generalDetails = [
    ["Service", "Cab"],
    ["Service Category", "Rental"],
    ["Total Distance", "10KM"],
    ["Total", ""],
    ["Status", ""],
    ["Cancellation Reason", ""],
  ];

  return (
    <div className="page-wrapper">
      <div className="container-fluid py-4" style={{ background: "#f4f6f9" }}>
        <div className="container">
          {/* HEADER */}
          <h4 className="fw-bold mb-4">Ride Request Details</h4>

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

                  {/* Payment Method Row Separate */}
                  <div className="d-flex justify-content-between py-2">
                    <span className="text-muted">Payment Method</span>
                    <img
                      src="/src/assets/img/cod.png"
                      alt="payment"
                      width={60}
                    />
                  </div>
                </div>
              </div>

              <div className="card shadow-sm border-0 rounded-4 mb-4">
                <div className="card-body p-4">
                  <div
                    className="personal-information"
                    style={{
                      backgroundImage: "url('/src/assets/img/bg-img-000.png')",
                      backgroundSize: "cover",
                      backgroundPosition: "left",
                      backgroundColor: "#f8f9fa",
                      padding: "23px 29px",
                    }}
                  >
                    <h5 className="fw-bold mb-4">Rider Details</h5>

                    <div className="row align-items-center">
                      <div className="col-md-5 d-flex align-items-center">
                        <div
                          className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center me-3"
                          style={{ width: 80, height: 80, fontSize: "28px" }}
                        >
                          H
                        </div>

                        <div>
                          <h5 className="fw-bold mb-1">Sharath Kumar</h5>
                          <div className="d-flex align-items-center">
                            <span className="me-2 text-muted">Rating</span>
                            <div className="text-warning">
                              {[...Array(5)].map((_, i) => (
                                <FaStar key={i} />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-1 d-none d-md-flex justify-content-center">
                        <div
                          style={{
                            width: "1px",
                            height: "120px",
                            backgroundColor: "#dee2e6",
                          }}
                        ></div>
                      </div>

                      <div className="col-md-6">
                        <p className="mb-2">
                          <strong>Email :</strong> rideexample@gmail.com
                        </p>
                        <p className="mb-2">
                          <strong>Phone :</strong> +91 7006505391
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="col-lg-6">
              {/* -------- Map View -------- */}
              <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3">Map View</h5>
                  <div
                    className="rounded-3"
                    style={{
                      height: "350px",
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
                      width={550}
                      height={350}
                      src="https://maps.google.com/maps?width=600&height=400&hl=en&q=Hyderabad&t=&z=14&ie=UTF8&iwloc=B&output=embed"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideRequestDetails;
