import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout/Layout";
import { getUserData } from "../../services/profileService";
import { storeAccountAsync } from "../../store/reducers/accountSlice";
import { ReactComponent as Scan } from "../../assets/scan.svg";
import { QRCodeSVG } from "qrcode.react";
import logo from "../../assets/scan.svg"; // Replace with your logo path
import "./QR.scss"; // Import your CSS file

function Connect() {
  const [qrCode, setQrCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userData = await getUserData();
        setUserId(userData.data.id);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchQrCode = async () => {
      try {
        const response = await axios.get("http://localhost:4000/get-qr");
        setQrCode(response.data.qrCode);
      } catch (error) {
        console.error("Error fetching QR code", error);
      }
    };

    const fetchPhoneNumber = async () => {
      try {
        const response = await axios.get("http://localhost:4000/get-number");
        if (response.data.phoneNumber) {
          setPhoneNumber(response.data.phoneNumber);
          setIsConnected(true);

          const accountData = {
            user_id: userId,
            phone: response.data.phoneNumber,
            name: "حسابك",
          };

          await dispatch(storeAccountAsync(accountData));
          navigate("/my-accounts", {
            state: { phoneNumber: response.data.phoneNumber },
          });
        }
      } catch (error) {
        console.error("Error fetching phone number", error);
      }
    };

    fetchQrCode();

    const checkConnectionStatus = setInterval(() => {
      fetchPhoneNumber();
    }, 5000);

    return () => clearInterval(checkConnectionStatus);
  }, [navigate, dispatch, userId]);

  return (
    <Layout>
      <div className="container d-flex flex-column align-items-center">
        <h1 className="mb-4">مصادقة حساب الواتساب</h1>

        {/* QR Code Section */}
        <div className="qr-code-container text-center">
          {qrCode ? (
            <div style={{ position: "relative", display: "inline-block" }}>
              <QRCodeSVG
                value={qrCode}
                size={300}
                bgColor={"#ffffff"}
                fgColor={"#473786"}
                level={"L"}
                style={{
                  border: "2px solid #473786",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              />
              <img
                src={logo}
                alt="Logo"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "60px",
                  height: "60px",
                }}
              />
            </div>
          ) : (
            <div className="loading-spinner">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p>Loading QR Code...</p>
            </div>
          )}
        </div>

        {/* Instruction Section */}
        <div className="scan-instruction mt-5 text-center">
          <Scan className="scan-icon" />
          <h2 className="mt-3">
            افتح واتساب على هاتفك المحمول ، وامسح الرمز ضوئيًا
          </h2>
        </div>
      </div>
    </Layout>
  );
}

export default Connect;
