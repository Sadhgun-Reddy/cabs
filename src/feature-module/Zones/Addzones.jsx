import { useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";
//

const Addzones = () => {
  const route = all_routes;
  const [Addzones, setAddzones] = useState(false);
  const [Addzones2, setAddzones2] = useState(true);
  // const [date1, setDate1] = useState(new Date());
  // const [date2, setDate2] = useState(new Date());
  // const [selectedStore, setSelectedStore] = useState(null);
  // const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  // const [selectedSellingType, setSelectedSellingType] = useState(null);
  // const [selectedCategory, setSelectedCategory] = useState(null);
  // const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  // const [selectedBrand, setSelectedBrand] = useState(null);
  // const [selectedUnit, setSelectedUnit] = useState(null);
  // const [selectedBarcodeSymbol, setSelectedBarcodeSymbol] = useState(null);
  // const [selectedTaxType, setSelectedTaxType] = useState(null);
  // const [selectedDiscountType, setSelectedDiscountType] = useState(null);
  // const [selectedWarranty, setSelectedWarranty] = useState(null);
  // const [text, setText] = useState("");
  const [status, setStatus] = useState(true);


  const [isImageVisible, setIsImageVisible] = useState(true);

  const handleRemoveAddzones = () => {
    setIsImageVisible(false);
  };
  const [isImageVisible1, setIsImageVisible1] = useState(true);

  const handleRemoveAddzones1 = () => {
    setIsImageVisible1(false);
  };
  return (
    <>
      <div className="page-wrapper">
        <div className="content">
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
          {/* /add */}
          <div className="row">
            <div className="col-lg-6 col-md-6 col-12">
              <form>
                <div className="add-Addzones">
                  <div className="">
                    <div className="accordion-item border mb-4">
                      <h2 className="accordion-header" id="headingSpacingOne">
                        <div className="accordion-button collapsed bg-white">
                          <div className="d-flex align-items-center justify-content-between flex-fill">
                            <h5 className="d-flex align-items-center">
                              <i className="feather icon-info text-primary me-2" />
                              <span>Addzones Information</span>
                            </h5>
                          </div>
                        </div>
                      </h2>

                      <div className="accordion-body border-top">
                        <div className="row">
                          <div className="col-sm-6 col-12 w-100">
                            <div className="mb-3">
                              <label className="form-label">
                                Zone Name
                                <span className="text-danger ms-1">*</span>
                              </label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-sm-6 col-12 w-100">
                            <div className="mb-3">
                              <label className="form-label">
                                Place Points
                                <span className="text-danger ms-1">*</span>
                              </label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-sm-6 col-12 w-100">
                            <div className="mb-3 list position-relative">
                              <label className="form-label">
                                Search Location
                                <span className="text-danger ms-1">*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control list"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-sm-6 col-12">
                            <div className="mb-3 list position-relative">
                              <label className="form-label">Map</label>
                            </div>
                            <iframe
                              class="embed-map-frame"
                              frameborder="0"
                              scrolling="no"
                              marginheight="0"
                              marginwidth="0"
                              width={550}
                              height={400}
                              src="https://maps.google.com/maps?width=600&height=400&hl=en&q=Hyderabad&t=&z=14&ie=UTF8&iwloc=B&output=embed"
                            ></iframe>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-lg-6 col-sm-6 col-12">
                            <div className="row">
                              <div className="col-lg-6 col-sm-6 col-12">
                                <div className="mb-3">
                                  <label className="form-label">
                                    Status{" "}
                                    <span className="text-danger ms-1">*</span>
                                  </label>

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
                                      {status ? "" : ""}
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
                </div>
                <div className="col-lg-6">
                  <div className="d-flex align-items-center justify-content-end mb-4">
                    <button type="button" className="btn btn-secondary me-2">
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Addzone
                    </button>
                  </div>
                </div>
              </form>
            </div>

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
                      Start adding pins to the map to outline a zone.
                    </li>
                  </ul>
                  <img
                    src="/src/assets/img/taxido-osm.gif"
                    alt=""
                    className="img-fluid rounded"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* /add */}
        </div>
        <div className="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3">
          <p className="mb-0 text-gray-9">
            2014 - 2026 © Gk Cabs. All Right Reserved
          </p>
          <p>
            Designed &amp; Developed by{" "}
            <Link to="#" className="text-primary">
              Gk Cabs
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Addzones;
