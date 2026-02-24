import { useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";
import CommonFooter from "../../components/footer/commonFooter";

const PeakZoneMap = () => {
  const route = all_routes;
  const [status, setStatus] = useState(true);

  return (
    <div className="page-wrapper">
      <div className="content">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-title">
            <h4>Peak Zone Map</h4>
          </div>
        </div>

        {/* Main Card */}
        <div className="row">
          <div className="col-lg-12">
            <form>
              <div className="card border mb-4">
                {/* Card Header */}
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Peakzones Map</h5>

                  <select className="form-select w-auto">
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Card Body */}
                <div className="card-body">
                  {/* Google Map */}
                  <div className="w-100">
                    <iframe
                      title="Hyderabad Map"
                      className="w-100"
                      height="500"
                      frameBorder="0"
                      scrolling="no"
                      marginHeight="0"
                      marginWidth="0"
                      src="https://maps.google.com/maps?width=600&height=400&hl=en&q=Hyderabad&t=&z=14&ie=UTF8&iwloc=B&output=embed"
                      style={{ border: 0 }}
                    ></iframe>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <CommonFooter />
    </div>
  );
};

export default PeakZoneMap;
