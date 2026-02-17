import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ColorPicker } from "antd";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  resetAllMode,
  setDataColor,
  setDataColorAll,
  setDataSidebarAll,
  setDataTopbarAll,
  setDataTopBarColorAll,
} from "../../core/redux/themeSettingSlice";

const ThemeSettings = () => {
  const buyNow = () => {
    window.open(
      "https://themeforest.net/item/Gk Cabs-pos-inventory-management-admin-dashboard-template/38834413?s_rank=13",
      "_blank",
    );
  };

  const dispatch = useDispatch();

  // Redux state selectors
  const dataLayout = useSelector((state) => state.themeSetting.dataLayout);
  const dataWidth = useSelector((state) => state.themeSetting.dataWidth);
  const dataTopBar = useSelector((state) => state.themeSetting.dataTopBar);
  const dataTopBarColor = useSelector(
    (state) => state.themeSetting.dataTopBarColor,
  );
  const dataTheme = useSelector((state) => state.themeSetting.dataTheme);
  const dataSidebarAll = useSelector(
    (state) => state.themeSetting.dataSidebarAll,
  );
  const dataColorAll = useSelector((state) => state.themeSetting.dataColorAll);
  const dataTopBarColorAll = useSelector(
    (state) => state.themeSetting.dataTopBarColorAll,
  );
  const dataTopbarAll = useSelector(
    (state) => state.themeSetting.dataTopbarAll,
  );
  const dataSidebar = useSelector((state) => state.themeSetting.dataSidebar);
  const dataSidebarBg = useSelector(
    (state) => state.themeSetting.dataSidebarBg,
  );
  const dataTopbarBg = useSelector((state) => state.themeSetting.dataTopbarBg);
  const dataColor = useSelector((state) => state.themeSetting.dataColor);

  const [colorRgb, setColorRgb] = useState(`rgb(${dataSidebarAll})`);
  const [colorRgb2, setColorRgb2] = useState(`rgb(${dataTopbarAll})`);
  const [colorRgb3, setColorRgb3] = useState(`rgb(${dataTopBarColorAll})`);
  const [colorRgb4, setColorRgb4] = useState(`rgb(${dataColorAll})`);
  const [colorRgb5, setColorRgb5] = useState(`rgb(${dataColorAll})`);
  const [colorRgb6, setColorRgb6] = useState(`rgb(${dataColorAll})`);
  const [formatRgb, setFormatRgb] = useState("rgb");

  // RGB String calculations
  const rgbString = React.useMemo(
    () => (typeof colorRgb === "string" ? colorRgb : colorRgb?.toRgbString()),
    [colorRgb],
  );

  const rgbString2 = React.useMemo(
    () =>
      typeof colorRgb2 === "string" ? colorRgb2 : colorRgb2?.toRgbString(),
    [colorRgb2],
  );

  const rgbString3 = React.useMemo(
    () =>
      typeof colorRgb3 === "string" ? colorRgb3 : colorRgb3?.toRgbString(),
    [colorRgb3],
  );

  const rgbString4 = React.useMemo(
    () =>
      typeof colorRgb4 === "string" ? colorRgb4 : colorRgb4?.toRgbString(),
    [colorRgb4],
  );

  const rgbString5 = React.useMemo(
    () =>
      typeof colorRgb5 === "string" ? colorRgb5 : colorRgb5?.toRgbString(),
    [colorRgb5],
  );

  const rgbString6 = React.useMemo(
    () =>
      typeof colorRgb6 === "string" ? colorRgb6 : colorRgb6?.toRgbString(),
    [colorRgb6],
  );

  // Dispatch updates when color values change
  useEffect(() => {
    dispatch(setDataSidebarAll(rgbString.replace(/rgb\(|\)/g, "").trim()));
    dispatch(setDataTopbarAll(rgbString2.replace(/rgb\(|\)/g, "").trim()));
    dispatch(setDataTopBarColorAll(rgbString3.replace(/rgb\(|\)/g, "").trim()));
    dispatch(setDataColorAll(rgbString4.replace(/rgb\(|\)/g, "").trim()));
    dispatch(setDataColorAll(rgbString5.replace(/rgb\(|\)/g, "").trim()));
  }, [dispatch, rgbString, rgbString2, rgbString3, rgbString4, rgbString5]);

  // Event handlers for dispatching actions

  const handleDataColorChange = (bg) => {
    dispatch(setDataColor(bg));
  };

  const handleReset = () => {
    dispatch(resetAllMode());
  };
  useEffect(() => {
    document.documentElement.setAttribute("data-layout", dataLayout);
    document.documentElement.setAttribute("data-width", dataWidth);
    document.documentElement.setAttribute("data-sidebar", dataSidebar);
    document.documentElement.setAttribute("data-theme", dataTheme);
    document.documentElement.setAttribute("data-topbar", dataTopBar);
    document.documentElement.setAttribute("data-topbarcolor", dataTopBarColor);
    document.documentElement.setAttribute("data-color", dataColor);
    document.body.setAttribute("data-sidebarbg", dataSidebarBg);
    document.body.setAttribute("data-topbarbg", dataTopbarBg);

    // Add mini-sidebar class to body when required by layout settings
    if (
      dataLayout === "mini" ||
      dataLayout === "layout-hovered" ||
      dataWidth === "box"
    ) {
      document.body.classList.add("mini-sidebar");
    } else {
      document.body.classList.remove("mini-sidebar");
    }

    setColorRgb(`rgb(${dataSidebarAll})`);
    setColorRgb2(`rgb(${dataTopbarAll})`);
    setColorRgb3(`rgb(${dataTopBarColorAll})`);
    setColorRgb4(`rgb(${dataColorAll})`);
    setColorRgb5(`rgb(${dataColorAll})`);
  }, [
    dataLayout,
    dataWidth,
    dataSidebar,
    dataSidebarAll,
    dataTheme,
    dataSidebarBg,
    dataTopBarColor,
    dataTopBar,
    dataTopbarBg,
    dataColor,
    dataColorAll,
    dataTopBarColorAll,
    dataTopbarAll,
  ]);
  return (
    <>
      <>
        <div className="sidebar-contact ">
          <div
            className="toggle-theme"
            data-bs-toggle="offcanvas"
            data-bs-target="#theme-setting"
          >
            <i className="fa fa-cog fa-w-16 fa-spin" />
          </div>
        </div>
        <div
          className="sidebar-themesettings offcanvas offcanvas-end"
          id="theme-setting"
        >
          <div className="offcanvas-header d-flex align-items-center justify-content-between bg-dark">
            <div>
              <h3 className="mb-1 text-white">Theme Customizer</h3>
              <p className="text-light">
                Choose your themes &amp; layouts etc.
              </p>
            </div>
            <Link
              to="#"
              className="custom-btn-close d-flex align-items-center justify-content-center text-white"
              data-bs-dismiss="offcanvas"
            >
              <i className="ti ti-x" />
            </Link>
          </div>
          <div className="themecard-body offcanvas-body">
            <div
              className="accordion accordion-customicon1 accordions-items-seperate"
              id="settingtheme"
            >
              <div className="accordion-item border px-3">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button text-dark fs-16 px-0 py-3 bg-transparent"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#sidebarcolor"
                    aria-expanded="true"
                  >
                    Theme Colors
                  </button>
                </h2>
                <div
                  id="sidebarcolor"
                  className="accordion-collapse collapse show"
                >
                  <div className="accordion-body pb-2 px-0 py-3 border-top">
                    <div className="d-flex align-items-center flex-wrap">
                      <div className="theme-colorsset me-2 mb-2">
                        <input
                          type="radio"
                          name="color"
                          id="primaryColor"
                          defaultValue="primary"
                          checked={dataColor === "primary" ? true : false}
                          onChange={() => handleDataColorChange("primary")}
                        />

                        <label htmlFor="primaryColor" className="primary-clr" />
                      </div>
                      <div className="theme-colorsset me-2 mb-2">
                        <input
                          type="radio"
                          name="color"
                          id="brightblueColor"
                          defaultValue="brightblue"
                          checked={dataColor === "brightblue" ? true : false}
                          onChange={() => handleDataColorChange("brightblue")}
                        />

                        <label
                          htmlFor="brightblueColor"
                          className="theme-color-1"
                        />
                      </div>
                      <div className="theme-colorsset me-2 mb-2">
                        <input
                          type="radio"
                          name="color"
                          id="lunargreenColor"
                          defaultValue="lunargreen"
                          checked={dataColor === "lunargreen" ? true : false}
                          onChange={() => handleDataColorChange("lunargreen")}
                        />

                        <label
                          htmlFor="lunargreenColor"
                          className="theme-color-2"
                        />
                      </div>
                      <div className="theme-colorsset me-2 mb-2">
                        <input
                          type="radio"
                          name="color"
                          id="lavendarColor"
                          defaultValue="lavendar"
                          checked={dataColor === "lavendar" ? true : false}
                          onChange={() => handleDataColorChange("lavendar")}
                        />

                        <label
                          htmlFor="lavendarColor"
                          className="theme-color-3"
                        />
                      </div>
                      <div className="theme-colorsset me-2 mb-2">
                        <input
                          type="radio"
                          name="color"
                          id="magentaColor"
                          defaultValue="magenta"
                          checked={dataColor === "magenta" ? true : false}
                          onChange={() => handleDataColorChange("magenta")}
                        />

                        <label
                          htmlFor="magentaColor"
                          className="theme-color-4"
                        />
                      </div>
                      <div className="theme-colorsset me-2 mb-2">
                        <input
                          type="radio"
                          name="color"
                          id="chromeyellowColor"
                          defaultValue="chromeyellow"
                          checked={dataColor === "chromeyellow" ? true : false}
                          onChange={() => handleDataColorChange("chromeyellow")}
                        />

                        <label
                          htmlFor="chromeyellowColor"
                          className="theme-color-5"
                        />
                      </div>
                      {/* <div className="theme-colorsset me-2 mb-2">
                        <input
                          type="radio"
                          name="color"
                          id="blueColor"
                          defaultValue="blue"
                          checked={dataColor === "blue" ? true : false}
                          onChange={() => handleDataColorChange("blue")}
                        />

                        <label htmlFor="blueColor" className="theme-color-6" />
                      </div> */}
                      <div className="theme-colorsset me-2 mb-2">
                        <input
                          type="radio"
                          name="color"
                          id="orangeColor"
                          defaultValue="orange"
                          checked={dataColor === "orange" ? true : false}
                          onChange={() => handleDataColorChange("orange")}
                        />

                        <label
                          htmlFor="orangeColor"
                          className="theme-color-7"
                        />
                      </div>
                      <div
                        className={`theme-colorsset round-style select-theme-color position-relative  mb-2 ${dataColor === "all" ? "active" : ""}`}
                        onClick={() => handleDataColorChange("all")}
                      >
                        <div className="select-color position-absolute">
                          <i className="ti ti-palette"></i>
                        </div>
                        <ColorPicker
                          format={formatRgb}
                          value={colorRgb4}
                          onChange={setColorRgb4}
                          onFormatChange={(format) => {
                            if (format) setFormatRgb(format);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="p-3 pt-0">
            <div className="row gx-3">
              <div className="col-6">
                <Link
                  to="#"
                  id="resetbutton"
                  className="btn btn-light close-theme w-100"
                  onClick={handleReset}
                >
                  <i className="ti ti-restore me-1" />
                  Reset
                </Link>
              </div>
              <div className="col-6">
                <Link
                  to="#"
                  className="btn btn-primary w-100"
                  onClick={buyNow}
                  data-bs-dismiss="offcanvas"
                >
                  <i className="ti ti-shopping-cart-plus me-1" />
                  Buy Product
                </Link>
              </div>
            </div>
          </div> */}
        </div>
      </>
    </>
  );
};

export default ThemeSettings;
