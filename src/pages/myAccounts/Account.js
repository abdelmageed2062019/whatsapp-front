import React from "react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation to get the state
import Layout from "../../components/Layout/Layout";
import { ReactComponent as Conect } from "../../assets/model.svg";
import axios from "axios"; // For deleting the number
import "./Account.scss";

const Account = () => {
  const location = useLocation();
  const phoneNumber = location.state?.phoneNumber; // Get phone number from state

  const deletePhoneNumber = async () => {
    try {
      await axios.delete("http://localhost:4000/delete-number");
      alert("Phone number deleted successfully!");
      window.location.reload(); // Reload the page after deletion
    } catch (error) {
      console.error("Error deleting phone number", error);
    }
  };

  return (
    <Layout>
      <div className="container mt-4 account-section">
        <div className="row">
          <div className="col-md-12">
            <h2>حسابات الواتساب</h2>
            <p>يمكنك إضافة ما يصل إلى 1 حسابات وفقًا لباقتك</p>
          </div>
        </div>

        <div className="mb-3">
          <Link
            to="/my-accounts/connect"
            className="btn account d-inline-block"
          >
            <Conect />
            <p>أضف حساب </p>
          </Link>
        </div>

        {/* Display the phone number if it's available */}
        {phoneNumber && (
          <div className="mb-3">
            <h3>الاحسابات</h3>

            <div className="account-info">
              <h3>{phoneNumber}</h3>
              <button className="btn btn-danger" onClick={deletePhoneNumber}>
                Delete Number
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Account;
