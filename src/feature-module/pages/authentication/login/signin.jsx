import React, { useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../../routes/all_routes";
import { logoPng } from "../../../../utils/imagepath";


const Signin = () => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  const route = all_routes;

  return (
    <>
      {/* Main Wrapper */}
      <div className="main-wrapper">
        <div className="account-content">
          <div className="login-wrapper bg-img">
            <div className="login-content authent-content">
              <form>
                <div className="login-userset">
                  <div className="login-logo logo-normal">
                    <img src={logoPng} alt="img" />
                  </div>
                  <Link to={route.dashboard} className="login-logo logo-white">
                    <img src={logoPng} alt="Img" />
                  </Link>
                  <div className="login-userheading">
                    <h3>Sign In</h3>
                    <h4 className="fs-16">
                      Access the Gk Cabs panel using your email and passcode.
                    </h4>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Email <span className="text-danger"> *</span>
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        defaultValue=""
                        className="form-control border-end-0" />
                      
                      <span className="input-group-text border-start-0">
                        <i className="ti ti-mail" />
                      </span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Password <span className="text-danger"> *</span>
                    </label>
                    <div className="pass-group">
                      <input
                        type={isPasswordVisible ? "text" : "password"}
                        className="pass-input form-control" />
                      
                      <span
                        className={`ti toggle-password text-gray-9 ${
                        isPasswordVisible ? "ti-eye" : "ti-eye-off"}`
                        }
                        onClick={togglePasswordVisibility}>
                      </span>
                    </div>
                  </div>
                  <div className="form-login authentication-check">
                    <div className="row">
                      <div className="col-12 d-flex align-items-center justify-content-between">
                        <div className="custom-control custom-checkbox">
                          <label className="checkboxs ps-4 mb-0 pb-0 line-height-1 fs-16 text-gray-6">
                            <input type="checkbox" className="form-control" />
                            <span className="checkmarks" />
                            Remember me
                          </label>
                        </div>
                        <div className="text-end">
                          <Link
                            className="text-orange fs-16 fw-medium"
                            to={route.forgotPassword}>
                            
                            Forgot Password?
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-login">
                    <Link
                      to={route.newdashboard}
                      className="btn btn-primary w-100">
                      
                      Sign In
                    </Link> 
                  </div>
                  {/* <div className="signinform">
                    <h4>
                      New on our platform?
                      <Link to={route.register} className="hover-a">
                        {" "}
                        Create an account
                      </Link>
                    </h4>
                  </div> */}


                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Main Wrapper */}
    </>);

};

export default Signin;