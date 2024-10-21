import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import io from "socket.io-client"; // Import socket.io-client
import Layout from "../../components/Layout/Layout";
import { getUserData } from "../../services/profileService";
import { ReactComponent as Scan } from "../../assets/scan.svg";
import { QRCodeSVG } from "qrcode.react";
import logo from "../../assets/scan.svg"; // Replace with your logo path
import "./QR.scss"; // Import your CSS file

// Connect to backend WebSocket server
const socket = io("http://localhost:4000");

function Reconnect() {
  const [qrCode, setQrCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isReconnecting, setIsReconnecting] = useState(false);
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
    // Listen for QR code from the server
    socket.on("qrCode", (qr) => {
      setQrCode(qr);
    });

    // Listen for connection status changes
    socket.on("connectionStatus", (statusData) => {
      if (statusData.status === "connected") {
        setPhoneNumber(statusData.phoneNumber);
        setIsConnected(true);

        navigate("/my-accounts", {
          state: { phoneNumber: statusData.phoneNumber },
        });
      } else {
        setIsConnected(false);
      }
    });

    return () => {
      socket.off("qrCode");
      socket.off("connectionStatus");
    };
  }, [dispatch, navigate, userId]);

  const initiateReconnect = async () => {
    setIsReconnecting(true);
    try {
      await fetch("http://localhost:4000/reconnect", {
        method: "POST",
      });
      // The QR code will be received through the WebSocket
    } catch (error) {
      console.error("Error initiating reconnection", error);
      setIsReconnecting(false);
    }
  };

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

export default Reconnect;
