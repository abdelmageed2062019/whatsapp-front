import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAccountsAsync,
  selectAccounts,
  selectAccountStatus,
  selectAccountError,
} from "../../store/reducers/accountSlice";
import Layout from "../../components/Layout/Layout";
import { ReactComponent as Conect } from "../../assets/model.svg";
import axios from "axios";
import { toast } from "react-toastify";
import "./Account.scss";

const Account = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate

  // Get accounts and status from Redux store
  const accounts = useSelector(selectAccounts);
  const status = useSelector(selectAccountStatus);
  const error = useSelector(selectAccountError);

  // Fetch accounts when component mounts
  useEffect(() => {
    dispatch(fetchAccountsAsync());
  }, [dispatch]);

  const deletePhoneNumber = async () => {
    try {
      await axios.delete("http://localhost:4000/delete-number");
      alert("Phone number deleted successfully!");
    } catch (error) {
      console.error("Error deleting phone number", error);
      alert("Failed to delete phone number. Please try again.");
    }
  };

  const handleAddAccount = () => {
    const planLimit = accounts.plan?.plan_no; // Assuming accounts.plan.plan_no gives the limit
    const accountCount = accounts.numbers?.length || 0; // Safe access to the length

    if (accountCount >= planLimit) {
      toast.warning("لا يمكن ان تضيف اكثر من 1 حساب");
    } else {
      navigate("/my-accounts/connect"); // Navigate to connect if within limit
    }
  };

  console.log(accounts);

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
          <button
            onClick={handleAddAccount} // Call handleAddAccount on button click
            className="btn account d-inline-block"
          >
            <Conect />
            <p>أضف حساب </p>
          </button>
        </div>

        {/* Display accounts fetched from Redux store */}
        <div className="mb-3">
          <h3>الاحسابات</h3>

          {/* Show loading, error, or list of accounts */}
          {status === "loading" && <p>Loading accounts...</p>}
          {status === "failed" && <p className="text-danger">Error: {error}</p>}
          {status === "succeeded" && (
            <div>
              {/* Check if accounts.numbers is defined and has length */}
              {Array.isArray(accounts.numbers) &&
              accounts.numbers.length > 0 ? (
                accounts.numbers.map((account, index) => (
                  <div key={index} className="account-info">
                    <h3>{account.name}</h3>
                    <h3>{account.phone_number}</h3>
                    <button
                      className="btn btn-danger"
                      onClick={deletePhoneNumber}
                    >
                      Delete Number
                    </button>
                  </div>
                ))
              ) : (
                <p>No accounts available. Please add an account.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Account;
