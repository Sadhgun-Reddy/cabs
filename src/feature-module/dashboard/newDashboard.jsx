import { Link } from "react-router-dom";
import "bootstrap-daterangepicker/daterangepicker.css";
import Chart from "react-apexcharts";
import { Doughnut } from "react-chartjs-2";
import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { all_routes } from "../../routes/all_routes";
import CommonDateRangePicker from "../../components/date-range-picker/common-date-range-picker";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);
const NewDashboard = () => {
  const [active, setActive] = useState("Cab");
  const route = all_routes;

  const dashboardCards = [
    {
      count: 3,
      title: "All Rides",
      iconClass: "fa-solid fa-car fs-18",
      iconBg: "bg-cyan-transparent text-cyan",
      link: "profit-and-loss.html",
      showStats: false,
    },
    {
      count: 0,
      title: "Scheduled Rides",
      iconClass: "fa-solid fa-calendar-check fs-18",
      iconBg: "bg-teal-transparent text-teal",
      link: route.invoicereport,
      showStats: false,
    },
    {
      count: 1,
      title: "Accepted Rides",
      iconClass: "fa-solid fa-thumbs-up fs-18",
      iconBg: "bg-orange-transparent text-orange",
      link: route.expenselist,
      showStats: false,
    },
    {
      count: 0,
      title: "On the way rides",
      iconClass: "fa-solid fa-route fs-18",
      iconBg: "bg-indigo-transparent text-indigo",
      link: route.salesreport,
      showStats: false,
    },
    {
      count: 0,
      title: "Client Location",
      iconClass: "fa-solid fa-location-dot fs-18",
      iconBg: "bg-cyan-transparent text-cyan",
      link: "profit-and-loss.html",
      showStats: false,
    },
    {
      count: 1,
      title: "Start Rides",
      iconClass: "fa-solid fa-play-circle fs-18",
      iconBg: "bg-teal-transparent text-teal",
      link: route.invoicereport,
      showStats: false,
    },
    {
      count: 0,
      title: "Cancelled Rides",
      iconClass: "fa-solid fa-xmark-circle fs-18",
      iconBg: "bg-orange-transparent text-orange",
      link: route.expenselist,
      showStats: false,
    },
    {
      count: 1,
      title: "Completed Rides",
      iconClass: "fa-solid fa-circle-check fs-18",
      iconBg: "bg-indigo-transparent text-indigo",
      link: route.salesreport,
      showStats: false,
    },
    {
      count: 0,
      title: "Cancelled Rides(Passenger)",
      iconClass: "fa-solid fa-user-xmark fs-18",
      iconBg: "bg-cyan-transparent text-cyan",
      link: "profit-and-loss.html",
      showStats: false,
    },
    {
      count: 0,
      title: "Cancelled Rides(Driver)",
      iconClass: "fa-solid fa-car-burst fs-18",
      iconBg: "bg-teal-transparent text-teal",
      link: route.invoicereport,
      showStats: false,
    },
    {
      count: 0,
      title: "User Wallet Report",
      iconClass: "fa-solid fa-wallet fs-18",
      iconBg: "bg-orange-transparent text-orange",
      link: route.expenselist,
      showStats: false,
    },
    {
      count: 5273,
      title: "Driver Wallet Report",
      iconClass: "fa-solid fa-wallet fs-18",
      iconBg: "bg-indigo-transparent text-indigo",
      link: route.salesreport,
      showStats: false,
    },
    {
      count: 0,
      title: "Card Payment",
      iconClass: "fa-solid fa-credit-card fs-18",
      iconBg: "bg-indigo-transparent text-indigo",
      link: route.salesreport,
      showStats: false,
    },
    {
      count: 3,
      title: "Cash Payment",
      iconClass: "fa-solid fa-money-bill-wave fs-18",
      iconBg: "bg-cyan-transparent text-cyan",
      link: "profit-and-loss.html",
      showStats: false,
    },
    {
      count: 1325,
      title: "Revenue",
      iconClass: "fa-solid fa-chart-line fs-18",
      iconBg: "bg-teal-transparent text-teal",
      link: route.invoicereport,
      showStats: false,
    },
    {
      count: 1466,
      title: "Total Verified Drivers",
      iconClass: "fa-solid fa-user-check fs-18",
      iconBg: "bg-orange-transparent text-orange",
      link: route.expenselist,
      showStats: false,
    },
    {
      count: 1466,
      title: "Total not Verified Drivers",
      iconClass: "fa-solid fa-user-xmark fs-18",
      iconBg: "bg-indigo-transparent text-indigo",
      link: route.salesreport,
      showStats: false,
    },
    {
      count: 0,
      title: "Active Peak Zone",
      iconClass: "fa-solid fa-bolt fs-18",
      iconBg: "bg-indigo-transparent text-indigo",
      link: route.salesreport,
      showStats: false,
    },
    {
      count: 32,
      title: "Rides",
      iconClass: "fa-solid fa-taxi fs-18",
      iconBg: "bg-indigo-transparent text-indigo",
      link: route.salesreport,
      showStats: false,
    },
  ];

  const ridesMonthlySeries = [
    {
      name: "Completed Rides",
      data: [195, 28, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: "Cancelled Rides",
      data: [30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: "Users",
      data: [170, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: "Drivers",
      data: [10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  ];

  const ridesMonthlyOptions = {
    chart: {
      type: "bar",
      stacked: false,
      toolbar: { show: false },
    },

    colors: ["#28a745", "#dc3545", "#1f4fa3", "#e56ad7"],

    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        borderRadius: 4,
        endingShape: "rounded",
      },
    },

    dataLabels: {
      enabled: false,
    },

    legend: {
      show: true,
      position: "top",
      horizontalAlign: "center",
      markers: {
        width: 14,
        height: 14,
        radius: 2,
      },
    },

    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "13px",
        },
      },
    },

    yaxis: {
      min: 0,
      max: 200,
      tickAmount: 10,
      title: {
        text: "No. of Rides",
        style: {
          color: "#6B7280",
          fontSize: "13px",
        },
      },
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "13px",
        },
      },
    },

    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 4,
    },

    tooltip: {
      shared: true,
      intersect: false,
    },
  };

  const categories = [
    { label: "City Rides", value: 513, color: "#30a652", text: "text-green" },
    { label: "One Way", value: 232, color: "#0984E3", text: "text-orange" },
    { label: "Rental", value: 55, color: "#15a9e8", text: "text-blue" },
    { label: "Airport Transfer", value: 8, color: "#e81c15", text: "text-red" },
    { label: "Round Trip", value: 15, color: "#a515e8", text: "text-violet" },
  ];

  const datas = {
    labels: categories.map((item) => item.label),
    datasets: [
      {
        data: categories.map((item) => item.value),
        backgroundColor: categories.map((item) => item.color),
        hoverBorderWidth: 0,
        cutout: "65%",
      },
    ],
  };

  const option = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: -20,
        bottom: -20,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const drivers = [
    {
      name: "Daniel Miller",
      email: "driver@example.com",
      rides: 13,
      rating: 5.0,
      earnings: "₹923.27",
      avatar: "DM",
    },
    {
      name: "Mike ",
      email: "driver@example.com",
      rides: 3,
      rating: 4.0,
      earnings: "₹0.00",
      avatar: "DM",
    },
    {
      name: "Thomas",
      email: "driver@example.com",
      rides: 3,
      rating: 4.0,
      earnings: "₹0.00",
      avatar: "DM",
    },
    {
      name: "john",
      email: "driver@example.com",
      rides: 5,
      rating: 3.0,
      earnings: "₹0.00",
      avatar: "DM",
    },
  ];

  const rides = [
    {
      id: "#100027",
      name: "Daniel Miller",
      email: "driver@example.com",
      km: "6.639 Km",
      showStats: "Accepeted",
      avatar: "DM",
    },
    {
      id: "#100102",
      name: "Daniel Miller",
      email: "driver@example.com",
      km: "0",
      showStats: "Completed",
      avatar: "DM",
    },
    {
      id: "#100010",
      name: "Robert King",
      email: "robert@example.com",
      km: "15 Km",
      showStats: "Accepeted",
      avatar: "RK",
    },
  ];

  return (
    <section className="page-wrapper">
      <div className="content">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-2">
          <div className="mb-3">
            <h1 className="mb-1">Welcome, Admin</h1>
            <p className="fw-medium">
              You have <span className="text-primary fw-bold">200+</span>{" "}
              Orders, Today
            </p>
          </div>
          <div className="input-icon-start position-relative mb-3">
            <span className="input-icon-addon fs-16 text-gray-9">
              <i className="ti ti-calendar" />
            </span>
            <CommonDateRangePicker />
          </div>
        </div>

        <div className="row">
          {dashboardCards.map((item, index) => (
            <div key={index} className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="card revenue-widget flex-fill">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom">
                    <div>
                      <h4 className="mb-1">{item.count}</h4>
                      <h5>{item.title}</h5>
                    </div>
                    <span className={`revenue-icon ${item.iconBg}`}>
                      <i className={item.iconClass} />
                    </span>
                  </div>

                  <div className="d-flex align-items-center justify-content-between">
                    {item.showStats ? (
                      <p className="mb-0">
                        <span className={`fs-13 fw-bold ${item.statClass}`}>
                          {item.statText}
                        </span>{" "}
                        vs Last Month
                      </p>
                    ) : (
                      <span />
                    )}

                    <Link
                      to={item.link}
                      className="text-decoration-underline fs-13 fw-medium"
                    >
                      View All
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container-fluid px-4">
        <div className="row">
          {/* Monthly Rides Overview */}

          <div className="col-xl-8 col-lg-7 col-md-12 d-flex">
            <div className="card flex-fill">
              <div className="card-header d-flex align-items-center">
                <span className="title-icon bg-soft-primary me-2">
                  <i className="bi bi-bar-chart-line"></i>
                </span>
                <h5 className="card-title mb-0">Monthly Rides Overview</h5>
              </div>

              <div className="card-body pb-0">
                <Chart
                  options={ridesMonthlyOptions}
                  series={ridesMonthlySeries}
                  type="bar"
                  height={245}
                />
                <p className="text-center text-muted mt-2">Month</p>
              </div>
            </div>
          </div>

          {/* Service Category */}

          <div className="col-xl-4 col-lg-5 col-md-12 d-flex">
            <div className="card flex-fill">
              <div className="card-header d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <span className="title-icon bg-soft-orange me-2">
                    <i className="ti ti-tools" />
                  </span>
                  <h5 className="card-title mb-0">Service Categories</h5>
                </div>

                <div className="dropdown">
                  <button
                    className="btn btn-sm btn-white dropdown-toggle"
                    data-bs-toggle="dropdown"
                  >
                    Cab
                  </button>

                  <ul className="dropdown-menu">
                    {["Cab", "Sedan", "SUV", "SUV+", "Prime SUV"].map(
                      (item) => (
                        <li key={item}>
                          <button className="dropdown-item">{item}</button>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </div>

              <div className="card-body">
                <div className="d-flex justify-content-center mb-3">
                  <Doughnut
                    data={datas}
                    options={option}
                    style={{ height: 230, width: 200 }}
                  />
                </div>
                <h6 className="mb-2">Category Statistics</h6>

                <div className="d-flex flex-wrap gap-3">
                  {categories.map((item) => (
                    <span
                      key={item.label}
                      className="d-inline-flex align-items-center"
                    >
                      <i
                        className={`ti ti-square-rounded-filled ${item.text} fs-8 me-2`}
                      />
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid px-4">
        <div className="row">
          {/* Top Drivers */}
          <div className="col-xl-6 col-lg-6 col-md-12 d-flex">
            <div className="card flex-fill shadow-sm rounded-2 p-4">
              <div className="d-flex justify-content-between mb-3">
                <h6 className="fw-semibold mb-0">Top Drivers</h6>
                <button className="text-muted small">View All</button>
              </div>

              <table className="table align-middle mb-0">
                <thead className="small text-muted">
                  <tr>
                    <th>Driver</th>
                    <th>Rides</th>
                    <th>Ratings</th>
                    <th>Earnings</th>
                  </tr>
                </thead>

                <tbody>
                  {drivers.map((d, i) => (
                    <tr key={i} style={{ borderBottom: "1px dashed #e5e5e5" }}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="rounded-circle text-white fw-semibold d-flex align-items-center justify-content-center"
                            style={{
                              width: 42,
                              height: 42,
                              background: "#4caf91",
                            }}
                          >
                            {d.avatar}
                          </div>
                          <div>
                            <div className="fw-semibold">{d.name}</div>
                            <small className="text-muted">{d.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>{d.rides}</td>
                      <td>
                        <span className="text-warning fs-5">★</span> ({d.rating}
                        )
                      </td>
                      <td>{d.earnings}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Rides */}
          <div className="col-xl-6 col-lg-6 col-md-12 d-flex">
            <div className="card shadow-sm rounded-4 p-4 ">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-semibold mb-0">Recent Rides</h6>
                <button className="text-success fw-medium">View All</button>
              </div>

              <ul className="nav border-bottom mb-3">
                {["Cab", "Parcel", "Freight", "Ambulance"].map((tab) => (
                  <li key={tab} className="nav-item">
                    <button
                      className={`nav-link px-3 ${active === tab ? "text-success border-bottom border-success border-2" : "text-muted"}`}
                      onClick={() => setActive(tab)}
                    >
                      {tab}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="row text-muted small fw-semibold bg-light py-2 rounded">
                <div className="col-3">Ride Number</div>
                <div className="col-4">Driver</div>
                <div className="col-2 text-end">Distance</div>
                <div className="col-3 text-end">Status</div>
              </div>

              {rides.map((r, i) => (
                <div
                  key={i}
                  className="row align-items-center py-3 border-bottom"
                  style={{ borderBottomStyle: "dashed" }}
                >
                  <div className="col-3">
                    <span className="badge bg-success-subtle text-success fw-semibold px-3 py-2">
                      {r.id}
                    </span>
                  </div>

                  <div className="col-4">
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="rounded-circle text-white fw-semibold d-flex align-items-center justify-content-center"
                        style={{
                          width: 40,
                          height: 40,
                          background: "#4caf91",
                        }}
                      >
                        {r.avatar}
                      </div>
                      <div>
                        <div className="fw-semibold">{r.name}</div>
                        <small className="text-muted">{r.email}</small>
                      </div>
                    </div>
                  </div>

                  <div className="col-2 text-end fw-medium">{r.km}</div>
                  <div className="col-3 text-end fw-medium">{r.showStats}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="copyright-footer d-flex align-items-center justify-content-between border-top bg-white gap-3 flex-wrap">
        <p className="fs-13 text-gray-9 mb-0">
          2014-2026 © Gk Cabs. All Right Reserved
        </p>
        <p>
          Designed &amp; Developed By{" "}
          <Link to="#" className="link-primary">
            Gk Cabs
          </Link>
        </p>
      </div>
    </section>
  );
};

export default NewDashboard;
