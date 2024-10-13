import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirect
import { useDispatch } from "react-redux"; // Import useDispatch
import Layout from "../../components/Layout/Layout";
import { getUserData } from "../../services/profileService";
import { storeAccountAsync } from "../../store/reducers/accountSlice"; // Import the action to store account

function App() {
  const [qrCode, setQrCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isConnected, setIsConnected] = useState(false); // To track if the client is connected
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate for redirection
  const dispatch = useDispatch(); // Initialize useDispatch for dispatching actions

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userData = await getUserData();
        setUserId(userData.id);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    // Fetch the QR code from the backend
    const fetchQrCode = async () => {
      try {
        const response = await axios.get("http://localhost:4000/get-qr");
        setQrCode(response.data.qrCode);
      } catch (error) {
        console.error("Error fetching QR code", error);
      }
    };

    // Fetch the phone number from the backend
    const fetchPhoneNumber = async () => {
      try {
        const response = await axios.get("http://localhost:4000/get-number");
        if (response.data.phoneNumber) {
          setPhoneNumber(response.data.phoneNumber);
          setIsConnected(true); // Set connection status to true after fetching the number

          // Dispatch the action to store the phone number in the database
          const accountData = {
            user_id: userId,
            phone: response.data.phoneNumber,
            name: "",
          };
          await dispatch(storeAccountAsync(accountData));

          // Redirect to the Account page after getting the number
          navigate("/my-accounts", {
            state: { phoneNumber: response.data.phoneNumber },
          });
        }
      } catch (error) {
        console.error("Error fetching phone number", error);
      }
    };

    fetchQrCode(); // Fetch the QR code on load

    // Polling function to check if phone number is available
    const checkConnectionStatus = setInterval(() => {
      fetchPhoneNumber(); // Poll the server for the phone number
    }, 5000); // Check every 5 seconds

    // Cleanup interval on unmount
    return () => clearInterval(checkConnectionStatus);
  }, [navigate, dispatch, userId]); // Add userId and dispatch to dependencies

  return (
    <Layout>
      <div className="container d-flex flex-column align-items-center">
        <h1>Scan this QR Code to Connect to WhatsApp</h1>
        {qrCode ? (
          <img
            src={qrCode}
            alt="WhatsApp QR Code"
            style={{
              width: "300px", // Custom width
              height: "300px", // Custom height
              border: "2px solid #000", // Add a border
              borderRadius: "10px", // Make the edges rounded
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Add a shadow
            }}
          />
        ) : (
          <p>Loading QR Code...</p>
        )}

        <h2>WhatsApp Account Info</h2>
        {isConnected ? (
          <p>Phone Number: {phoneNumber}</p>
        ) : (
          <p>Waiting for connection...</p>
        )}
      </div>
    </Layout>
  );
}

export default App;
