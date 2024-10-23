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
import io from "socket.io-client"; // Import socket.io-client

function Reconnect() {
  const [qrCode, setQrCode] = useState(""); // Store the QR code
  const [phoneNumber, setPhoneNumber] = useState(""); // Store the phone number once connected
  const [isConnected, setIsConnected] = useState(false); // Track connection status
  const [userId, setUserId] = useState(null); // Store userId from getUserData
  const navigate = useNavigate(); // Navigation for redirection
  const dispatch = useDispatch(); // Redux dispatch

  // Establish socket connection and listen for QR code and connection status
  useEffect(() => {
    const socket = io("http://localhost:4000"); // Connect to your backend using Socket.io

    // Emit the request for QR code, passing the userId when available
    if (userId) {
      socket.emit("requestQR", userId);
    }

    // Listen for real-time QR code updates
    socket.on("qrCode", (qr) => {
      console.log("QR Code received: ", qr); // Debugging log

      setQrCode(qr); // Set the QR code state when received
    });

    // Listen for connection status updates
    socket.on("connectionStatus", (status) => {
      if (status.status === "connected") {
        setPhoneNumber(status.phoneNumber); // Update phone number if connected
        setIsConnected(true); // Update connection status
      }
    });

    // Cleanup the socket connection on component unmount
    return () => socket.disconnect();
  }, [userId]);

  // Fetch user ID once the component is mounted
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userData = await getUserData();
        setUserId(userData.data.id); // Set user ID from API response
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserId();
  }, []);

  // Check if already connected (useful for page reloads)
  useEffect(() => {
    const checkConnectionStatus = async () => {
      try {
        const response = await axios.get("http://localhost:4000/get-number");
        if (response.data.phoneNumber) {
          setPhoneNumber(response.data.phoneNumber);
          setIsConnected(true); // Set as connected if the phone number is available
        } else {
          setIsConnected(false); // Not connected if no phone number found
        }
      } catch (error) {
        console.error("Error checking connection status:", error);
        setIsConnected(false);
      }
    };

    checkConnectionStatus();
    const statusInterval = setInterval(checkConnectionStatus, 10000); // Poll every 10 seconds

    return () => clearInterval(statusInterval); // Cleanup interval on unmount
  }, []);

  // Store account information and navigate to another page once connected
  useEffect(() => {
    if (isConnected && phoneNumber && userId) {
      navigate("/my-accounts", {
        state: { phoneNumber: phoneNumber }, // Redirect to accounts page
      });
    }
  }, [isConnected, phoneNumber, userId, dispatch, navigate]);

  return (
    <Layout>
      <div className="container d-flex flex-column align-items-center">
        <h1 className="mb-4">WhatsApp Account Authentication</h1>

        {/* QR Code Section */}
        <div className="qr-code-container text-center">
          {qrCode ? (
            <div style={{ position: "relative", display: "inline-block" }}>
              <QRCodeSVG
                value={qrCode} // QR code from socket
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
            Open WhatsApp on your phone and scan the QR code
          </h2>
        </div>
      </div>
    </Layout>
  );
}

export default Reconnect;
