import React from "react";
import Layout from "../../components/Layout/Layout";
import { CircularProgressBar } from "react-percentage-bar";
import "./dashboard.scss";

// Circular progress bar component with percentage and label
const CircularProgressBarWithLabel = ({ value, label, size, raduis }) => {
  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      <div
        style={{
          alignItems: "center",
        }}
      >
        {/* PercentageCircle from react-percentage-bar */}
        <CircularProgressBar
          percent={value}
          size={size}
          percentageStyle={{
            fontSize: "30px",
            fontWeight: "bold",
            color: "#fff",
            filter: "drop-shadow(0 0 0.2rem  #fff)",
          }}
          trackColor="#1D1439"
          color="#eee"
          radius={raduis}
          shadow={true}
          outerShadowStyle={{
            boxShadow: "0 0 5px 5px #827B9F", // Changed to create a border-like effect
          }}
          text={label}
          textStyle={{
            marginTop: "10px",
            fontSize: "14px",
            color: "#fff",
            filter: "drop-shadow(0 0 0.2rem  #fff)",
          }}
        />
      </div>
    </div>
  );
};

// Dashboard component
const Dashboard = () => {
  return (
    <Layout>
      <div className="container mt-5">
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "end",
            marginTop: "50px",
          }}
          className="bar-wrapper"
        >
          <div className="row">
            {/* Three Circular Progress Bars */}
            <div className="col">
              <CircularProgressBarWithLabel
                value={45}
                label="الميزانية المتبقية لديك"
                size={"0.5rem"}
                raduis={"6rem"}
              />
            </div>
            <div className="col">
              <CircularProgressBarWithLabel
                value={62.5}
                label="استهلاك الرسائل هذا الشهر"
                size={"0.7rem"}
                raduis={"8rem"}
              />
            </div>
            <div className="col">
              <CircularProgressBarWithLabel
                value={80}
                label="استهلاك الرسائل اليوم"
                size={"0.5rem"}
                raduis={"6rem"}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
