import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { RefreshCcw } from "lucide-react";

const Account = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const accounts = useSelector(selectAccounts);
  const status = useSelector(selectAccountStatus);
  const error = useSelector(selectAccountError);
  const [connectionStatuses, setConnectionStatuses] = useState({});

  useEffect(() => {
    dispatch(fetchAccountsAsync());
  }, [dispatch]);

  useEffect(() => {
    const checkConnectionStatus = async () => {
      if (Array.isArray(accounts.numbers) && accounts.numbers.length > 0) {
        const statuses = {};
        for (const account of accounts.numbers) {
          try {
            const response = await axios.get(
              `http://localhost:4000/connection-status/${account.phone_number}`
            );
            statuses[account.phone_number] = response.data.status;
          } catch (error) {
            console.error("Error checking connection status:", error);
            statuses[account.phone_number] = "error";
          }
        }
        setConnectionStatuses(statuses);
      }
    };

    if (status === "succeeded") {
      checkConnectionStatus();
    }
  }, [accounts, status]);

  const handleReconnect = (phoneNumber) => {
    navigate("/my-accounts/reconnect", { state: { phoneNumber } });
  };

  const handleAddAccount = () => {
    const planLimit = accounts.plan?.plan_no;
    const accountCount = accounts.numbers?.length || 0;

    if (accountCount >= planLimit) {
      toast.warning("لا يمكن ان تضيف اكثر من 1 حساب");
    } else {
      navigate("/my-accounts/connect");
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
          <button
            onClick={handleAddAccount}
            className="btn account d-inline-block"
          >
            <Conect />
            <p>أضف حساب </p>
          </button>
        </div>

        <div className="mb-3">
          <h3>الاحسابات</h3>
          {status === "loading" && <p>Loading accounts...</p>}
          {status === "failed" && <p className="text-danger">Error: {error}</p>}
          {status === "succeeded" && (
            <div>
              {Array.isArray(accounts.numbers) &&
              accounts.numbers.length > 0 ? (
                accounts.numbers.map((account, index) => (
                  <div key={index} className="account-info">
                    <div className="mb-4 d-flex w-100 justify-content-between align-items-center">
                      <h3 className="m-0">{account.name}</h3>
                      {connectionStatuses[account.phone_number] ===
                        "disconnected" && (
                        <span
                          className="reconnect-option"
                          onClick={() => handleReconnect(account.phone_number)}
                          style={{
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <span style={{ marginRight: "8px" }}>
                            اعادة ربط الرقم
                          </span>
                          <RefreshCcw
                            className="reconnect-icon"
                            style={{
                              width: "20px",
                              height: "20px",
                            }}
                          />
                        </span>
                      )}
                    </div>
                    <h3>{account.phone_number}</h3>
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
