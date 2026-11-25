// import React, { useEffect, useMemo, useState } from "react";
// import "./Dashboard.css";
// import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
// import AdminDashboard from "../../components/Dashboard/AdminDashboard";
// import StaffDashboard from "../../components/Dashboard/StaffDashboard";
// import AgentDashboard from "../../components/Dashboard/AgentDashboard";
// import UserDashboard from "../../components/Dashboard/UserDashboard";
// import NiTool from "../../icons/ni-tool";
// import NiDashboardgph from "../../icons/NiDashboardgph";
// import { Link, useNavigate } from "react-router-dom";
// import AddLocationModal from "../../components/Modals/AddLocationModal";
// import RenderFormFields from "./RenderFormFields";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getAccountDetails,
//   getIncomeSummary,
//   getOffers,
// } from "../../Redux/Slices/AppSlices";
// import formatDate from "../../components/DateFormate/DateFormate";
// import { formatCurrency } from "../../components/Utils/FormatCurrency";
// import dashboardimg from "../../Assets/Bg/offer.png";
// import NiUser from "../../icons/ni-user";
// import NiBooking from "../../icons/ni-booking";
// import NiPayments from "../../icons/ni-payments";
// import { FaAngleRight } from "react-icons/fa";
// import TopPerformer from "../../components/Tables/TopPerformer";
// import TodayEventModal from "./Todayeventmodal";

// const Dashboard = ({ setAlert, mood, data }) => {
//   const dispatch = useDispatch();
//   const { userDetail, offersData, incomeSummary } = useSelector(
//     (state) => state.app,
//   );
//   useEffect(() => {
//     dispatch(getAccountDetails());
//     dispatch(getOffers());
//     dispatch(getIncomeSummary());
//   }, []);
//   const navigate = useNavigate();
//   const [open, setOpen] = useState(false);
//   const [actionType, setActionType] = useState("");
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [cycleFilter, setCycleFilter] = useState("");

//   const [formData, setFormData] = useState({});

//   const renderDashboard = () => {
//     switch (mood) {
//       case "admin":
//         return <AdminDashboard />;
//       // case "staff":
//       //   return <StaffDashboard />;
//       // case "agent":
//       //   return <AgentDashboard />;
//       // case "user":
//       default:
//         return <AdminDashboard />;
//     }
//   };

//   const renderFormFields = ({
//     actionType,
//     formData,
//     setFormData,
//     onClose,
//     setAlert,
//   }) => {
//     return (
//       <RenderFormFields
//         actionType={actionType}
//         formData={formData}
//         setFormData={setFormData}
//         data={data}
//         onClose={onClose}
//         setAlert={setAlert}
//       />
//     );
//   };

//   const quickActions = {
//     admin: [
//       { label: "Add Associate / Staff / Customer", icon: <NiUser /> },
//       { label: "Add Booking", icon: <NiBooking /> },
//       { label: "Add Payment (Received)", icon: <NiPayments /> },
//     ],
//     agent: [
//       { label: "Add Lead" },
//       { label: "Add Booking" },
//       { label: "Schedule Site Visit" },
//     ],
//     staff: [{ label: "Approve Payment" }, { label: "Verify Booking" }],
//     user: [{ label: "Download Receipt" }],
//   };

//   const visibleOffers = offersData?.filter((item) => {
//     const today = new Date();
//     const end = new Date(item.endDate);

//     if (end < today) return false;

//     if (mood === "admin" || mood === "staff") return true;

//     return item.userType?.includes(mood);
//   });

//   const [index, setIndex] = useState(0);

//   useEffect(() => {
//     if (visibleOffers?.length <= 1) return;

//     const interval = setInterval(() => {
//       setIndex((prev) => (prev + 1) % visibleOffers?.length);
//     }, 4000);

//     return () => clearInterval(interval);
//   }, [visibleOffers?.length]);

//   const getRemainingDays = (endDate) => {
//     const today = new Date();
//     const end = new Date(endDate);

//     const diff = end - today;

//     const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

//     if (days <= 0) return "Expired";

//     return `${days} days remaining`;
//   };

//   const commissionData = incomeSummary || [];

//   const filteredData = useMemo(() => {
//     return commissionData.filter((item) => {
//       const matchPayable = Number(item?.incomeSummary?.payableAmount || 0) > 0;

//       const matchCycle = !cycleFilter || item?.cycleDate === cycleFilter;

//       return matchPayable && matchCycle;
//     });
//   }, [commissionData]);

//   const truncateWords = (text = "", limit = 10) => {
//     const words = text.trim().split(/\s+/);
//     return words.length > limit
//       ? words.slice(0, limit).join(" ") + "..."
//       : text;
//   };

//   return (
//     <div className="plot-container">
//       {/* <div className="table-filters">
//         <div className="page-head-title">
//           <h2>Welcome back, {userDetail?.name}</h2>
//           <Breadcrumb />
//         </div>
//       </div> */}
//       <div className="dashboard-container">
//         <div className="dashboard-container-left">{renderDashboard()}</div>
//         <div className="dashboard-container-right">
//           <div className="dashboard-box">
//             <div className="dashboard-box-right">
//               <h6>Quick Actions</h6>
//               {quickActions[mood]?.map((action, i) => (
//                 <div
//                   className="dashboard-box-item card"
//                   key={i}
//                   onClick={() => {
//                     setActionType(action.label);
//                     setFormData({});
//                     setIsEditMode(false);
//                     setOpen(true);
//                   }}
//                   style={{ cursor: "pointer" }}
//                 >
//                   <div className="dashboard-box-item-left">{action.icon}</div>
//                   <div className="dashboard-box-item-right">
//                     <h6>{action.label}</h6>
//                     <p>Quick access to {action.label}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="dashboard-box-left">
//               <div
//                 className="dashboard-box-item card main"
//                 style={{
//                   alignItems: "flex-start",
//                   padding: "1.5rem",
//                 }}
//               >
//                 <div className="dashboard-box-item-left">
//                   <div className="offer-carousel">
//                     {visibleOffers?.length === 0 ? (
//                       <div className="no-offers">
//                         <h4>Welcome!</h4>
//                         <p>
//                           No offers available right now. Stay tuned for exciting
//                           deals!
//                         </p>
//                         <button
//                           className="btn"
//                           onClick={() => navigate(`/offers-discounts`)}
//                         >
//                           Manage Offers
//                         </button>
//                       </div>
//                     ) : (
//                       visibleOffers?.map((item, i) => (
//                         <div
//                           key={item._id}
//                           className={`offer-slide ${i === index ? "active" : ""}`}
//                         >
//                           <h4>{item.title}</h4>

//                           <p>{truncateWords(item.description, 10)}</p>

//                           {item.priceValue && (
//                             <span className="offer-badge">
//                               Offer ₹{formatCurrency(item.priceValue)}
//                             </span>
//                           )}
//                           {item.amount && (
//                             <span className="discount-badge">
//                               Discount {item.amount}
//                               {item.type === "percentage" ? "%" : "₹"}
//                             </span>
//                           )}
//                           <div className="offer-dates">
//                             <p>
//                               <strong>From:</strong>{" "}
//                               {formatDate(item.startDate)} to{" "}
//                               {formatDate(item.endDate)} (
//                               <span className="countdown">
//                                 {getRemainingDays(item.endDate)}
//                               </span>
//                               )
//                             </p>
//                           </div>
//                           <button
//                             className="btn"
//                             onClick={() => navigate(`/offers-discounts`)}
//                           >
//                             Manage Offers
//                           </button>
//                         </div>
//                       ))
//                     )}
//                   </div>
//                 </div>

//                 <div className="dashboard-box-item-right">
//                   <img src={dashboardimg} alt="" />
//                 </div>
//               </div>
//             </div>
//             <div className="top-perf dashboard-box-left card">
//               <div className="dashboard-title-box">
//                 <h4 style={{ margin: "0" }}>Top Performing</h4>
//                 <Link to="/commission" className="view-all">
//                   <FaAngleRight /> View All
//                 </Link>
//               </div>
//               <div className="table-box">
//                 <div className="table ">
//                   {filteredData?.length === 0 ? (
//                     <p>No Top Performers Found</p>
//                   ) : (
//                     filteredData
//                       ?.slice(0, 5)
//                       ?.map((item, index) => (
//                         <TopPerformer
//                           item={item}
//                           index={index}
//                           dashboard={() => navigate("/bookings")}
//                           mood={"user"}
//                         />
//                       ))
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//           <TodayEventModal userId={userDetail?._id} />
//         </div>
//       </div>
//       <AddLocationModal
//         open={open}
//         onClose={() => setOpen(false)}
//         title={actionType}
//       >
//         {renderFormFields({
//           actionType,
//           formData,
//           setFormData,
//           onClose: () => setOpen(false),
//           setAlert,
//         })}
//         {/* <p style={{ color: "#9f9f9f" }}>
//           Simple modal to create or modify item information.
//         </p> */}

//         {/* <div className="modal-actions">
//           <button onClick={() => setOpen(false)}>Submit</button>
//         </div> */}
//       </AddLocationModal>
//     </div>
//   );
// };

// export default Dashboard;


import React, { useEffect, useMemo, useState } from "react";
import "./Dashboard.css";
import AdminDashboard from "../../components/Dashboard/AdminDashboard";
import { Link, useNavigate } from "react-router-dom";
import AddLocationModal from "../../components/Modals/AddLocationModal";
import RenderFormFields from "./RenderFormFields";
import { useDispatch, useSelector } from "react-redux";
import {
  getAccountDetails,
  getIncomeSummary,
  getOffers,
} from "../../Redux/Slices/AppSlices";
import formatDate from "../../components/DateFormate/DateFormate";
import { formatCurrency } from "../../components/Utils/FormatCurrency";
import dashboardimg from "../../Assets/Bg/offer.png";
import { FaAngleRight } from "react-icons/fa";
import TopPerformer from "../../components/Tables/TopPerformer";
import TodayEventModal from "./Todayeventmodal";

const Dashboard = ({ setAlert, mood, data }) => {
  const dispatch = useDispatch();
  const { userDetail, offersData, incomeSummary } = useSelector(
    (state) => state.app,
  );
  useEffect(() => {
    dispatch(getAccountDetails());
    dispatch(getOffers());
    dispatch(getIncomeSummary());
  }, []);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [cycleFilter, setCycleFilter] = useState("");

  const [formData, setFormData] = useState({});

  const renderDashboard = () => {
    switch (mood) {
      case "admin":
        return <AdminDashboard />;
      default:
        return <AdminDashboard />;
    }
  };

  const renderFormFields = ({
    actionType,
    formData,
    setFormData,
    onClose,
    setAlert,
  }) => {
    return (
      <RenderFormFields
        actionType={actionType}
        formData={formData}
        setFormData={setFormData}
        data={data}
        onClose={onClose}
        setAlert={setAlert}
      />
    );
  };

  /* Icons now come from the arrow button, so only labels are needed. */
  const quickActions = {
    admin: [
      { label: "Add Associate / Staff / Customer" },
      { label: "Add Booking" },
      { label: "Add Payment (Received)" },
    ],
    agent: [
      { label: "Add Lead" },
      { label: "Add Booking" },
      { label: "Schedule Site Visit" },
    ],
    staff: [{ label: "Approve Payment" }, { label: "Verify Booking" }],
    user: [{ label: "Download Receipt" }],
  };

  const visibleOffers = offersData?.filter((item) => {
    const today = new Date();
    const end = new Date(item.endDate);

    if (end < today) return false;

    if (mood === "admin" || mood === "staff") return true;

    return item.userType?.includes(mood);
  });

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (visibleOffers?.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % visibleOffers?.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [visibleOffers?.length]);

  const getRemainingDays = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);

    const diff = end - today;

    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days <= 0) return "Expired";

    return `${days} days remaining`;
  };

  const commissionData = incomeSummary || [];

  const filteredData = useMemo(() => {
    return commissionData.filter((item) => {
      const matchPayable = Number(item?.incomeSummary?.payableAmount || 0) > 0;

      const matchCycle = !cycleFilter || item?.cycleDate === cycleFilter;

      return matchPayable && matchCycle;
    });
  }, [commissionData]);

  const truncateWords = (text = "", limit = 10) => {
    const words = text.trim().split(/\s+/);
    return words.length > limit
      ? words.slice(0, limit).join(" ") + "..."
      : text;
  };

  const openAction = (label) => {
    setActionType(label);
    setFormData({});
    setIsEditMode(false);
    setOpen(true);
  };

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="plot-container dashboard-page">
      {/* Hero + quick actions */}
      <div className="dash-top">
        <section className="dash-hero">
          <p className="dash-hero-date">{today}</p>
          <h1>
            Welcome back,
            <br />
            {userDetail?.name}
          </h1>
        </section>

        <section className="dash-actions card">
          <h6>Quick Actions</h6>
          {quickActions[mood]?.map((action, i) => (
            <button
              type="button"
              className="dash-action"
              key={i}
              onClick={() => openAction(action.label)}
            >
              <span>
                {action.label}
                <small>Quick access to {action.label}</small>
              </span>
              <span className="dash-arrow" aria-hidden="true">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </button>
          ))}
        </section>
      </div>

      {/* Stat cards + recent bookings / payments */}
      <div className="dash-main">{renderDashboard()}</div>

      {/* Top performing + offers */}
      <div className="dash-bottom">
        <section className="top-perf card">
          <div className="dashboard-title-box">
            <h4 style={{ margin: "0" }}>Top Performing</h4>
            <Link to="/commission" className="view-all">
              <FaAngleRight /> View All
            </Link>
          </div>
          <div className="table-box">
            <div className="table">
              {filteredData?.length === 0 ? (
                <p className="dash-empty">No Top Performers Found</p>
              ) : (
                filteredData
                  ?.slice(0, 5)
                  ?.map((item, index) => (
                    <TopPerformer
                      key={item?._id || index}
                      item={item}
                      index={index}
                      dashboard={() => navigate("/bookings")}
                      mood={"user"}
                    />
                  ))
              )}
            </div>
          </div>
        </section>

        <section className="dash-offer">
          <div className="dash-offer-text">
            <div className="offer-carousel">
              {visibleOffers?.length === 0 ? (
                <div className="no-offers">
                  <h4>Offers &amp; Discounts</h4>
                  <p>
                    No offers available right now. Stay tuned for exciting
                    deals!
                  </p>
                  <button
                    className="btn"
                    onClick={() => navigate(`/offers-discounts`)}
                  >
                    Manage Offers
                  </button>
                </div>
              ) : (
                visibleOffers?.map((item, i) => (
                  <div
                    key={item._id}
                    className={`offer-slide ${i === index ? "active" : ""}`}
                  >
                    <h4>{item.title}</h4>

                    <p>{truncateWords(item.description, 10)}</p>

                    {item.priceValue && (
                      <span className="offer-badge">
                        Offer ₹{formatCurrency(item.priceValue)}
                      </span>
                    )}
                    {item.amount && (
                      <span className="discount-badge">
                        Discount {item.amount}
                        {item.type === "percentage" ? "%" : "₹"}
                      </span>
                    )}
                    <div className="offer-dates">
                      <p>
                        <strong>From:</strong> {formatDate(item.startDate)} to{" "}
                        {formatDate(item.endDate)} (
                        <span className="countdown">
                          {getRemainingDays(item.endDate)}
                        </span>
                        )
                      </p>
                    </div>
                    <button
                      className="btn"
                      onClick={() => navigate(`/offers-discounts`)}
                    >
                      Manage Offers
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
          <img className="dash-offer-img" src={dashboardimg} alt="" />
        </section>
      </div>

      <TodayEventModal userId={userDetail?._id} />

      <AddLocationModal
        open={open}
        onClose={() => setOpen(false)}
        title={actionType}
      >
        {renderFormFields({
          actionType,
          formData,
          setFormData,
          onClose: () => setOpen(false),
          setAlert,
        })}
      </AddLocationModal>
    </div>
  );
};

export default Dashboard;