import React, { useState } from "react";
import CommonFooter from "../components/footer/commonFooter";
import { width } from "@fortawesome/free-solid-svg-icons/fa0";

const Chat = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  return (
    <div className="page-wrapper">
      <div className="content d-flex flex-column p-0">
        <div className="flex-grow-1 d-flex overflow-hidden">
          {/* LEFT MAIN SIDEBAR */}
          <div className="bg-white border-end"></div>

          {/* DRIVERS + MAP */}
          <div className="flex-grow-1 d-flex">
            {/* DRIVERS SIDEBAR */}
            <div
              className="bg-white border-end d-flex flex-column"
              style={{ width: "300px", minWidth: "300px" }}
            >
              <div className="p-3 flex-grow-1 overflow-auto">
                <h5 className="fw-bold mb-3">Chats</h5>

                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search Driver"
                  />
                </div>

                <div className="d-flex gap-4 mb-3">
                  <span
                    role="button"
                    onClick={() => setActiveFilter("all")}
                    className={`fw-semibold ${
                      activeFilter === "all" ? "text-success" : "text-muted"
                    }`}
                  >
                    All
                  </span>

                  <span
                    role="button"
                    onClick={() => setActiveFilter("onride")}
                    className={`fw-semibold ${
                      activeFilter === "onride" ? "text-success" : "text-muted"
                    }`}
                  >
                    Riders
                  </span>

                  <span
                    role="button"
                    onClick={() => setActiveFilter("online")}
                    className={`fw-semibold ${
                      activeFilter === "online" ? "text-success" : "text-muted"
                    }`}
                  >
                    Drivers
                  </span>
                </div>

                <hr />

                {/* <div className="text-center mt-5">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    alt="No Driver"
                    width="80"
                    className="mb-3"
                  />
                  <p className="text-muted">No Driver Found</p>
                </div> */}
              </div>
            </div>

            {/* MAP SECTION */}

            <div className="flex-grow">
              {/* <div
                className="position-absolute top-0 start-0 m-3 d-flex gap-2"
                style={{ zIndex: 10 }}
              >
                <button className="btn btn-light btn-sm fw-semibold">
                  Map
                </button>
                <button className="btn btn-light btn-sm">Satellite</button>
              </div>

              <div
                className="position-absolute top-0 end-0 m-3"
                style={{ zIndex: 10 }}
              >
                <select className="form-select form-select-sm">
                  <option>Vehicle Type</option>
                  <option>Car</option>
                  <option>Rental Car</option>
                </select>
              </div> */}
{/* 
              <img
                // title="chat"
                src="/src/assets/img/gk-chat.png"
                className="d-block mx-auto"
                alt="no chat"
                loading="lazy"

              /> */}
            </div>
          </div>
        </div>
      </div>
      <CommonFooter />
    </div>
  );
};

export default Chat;
