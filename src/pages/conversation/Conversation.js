import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import { getConversation } from "../../services/messageService";
import { useParams } from "react-router-dom";
import axios from "axios";

const Conversation = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [conversationData, setConversationData] = useState({
    id: null,
    phone_sender: "",
    phone: "",
    user_id: null,
    receiver_name: "",
    employee_id: null,
  });

  const { id: conId } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const conversation = await getConversation(conId);
        setConversationData({
          id: conversation.id,
          phone_sender: conversation.phone_sender,
          phone: conversation.phone,
          user_id: conversation.user_id,
          receiver_name: conversation.name,
          employee_id: conversation.employee_id,
        });
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch conversation:", error);
        setLoading(false);
      }
    };

    fetchConversation();

    // Fetch messages for the conversation when it loads
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/messages?conversationId=${conId}`
        );
        setMessages(response.data); // Assuming the API returns an array of messages
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();

    // Set up an interval to fetch messages every 5 seconds
    const intervalId = setInterval(fetchMessages, 5000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [conId]);

  const formatPhoneNumber = (number) => {
    if (number.startsWith("0")) {
      return `2${number.substring(1)}`; // Formatting number for Egypt
    }
    return number;
  };

  const handleSendMessage = async () => {
    if (
      !conversationData.id ||
      !conversationData.phone_sender ||
      !conversationData.phone
    ) {
      console.error("Conversation data is not ready yet:", conversationData);
      return;
    }

    if (inputMessage.trim() !== "") {
      setInputMessage(""); // Clear input after sending

      try {
        const formattedNumber = formatPhoneNumber(conversationData.phone);

        // Send the message via the API
        const response = await axios.post(
          "http://localhost:4000/send-message",
          {
            number: formattedNumber,
            message: inputMessage, // Ensure inputMessage is correctly passed
          }
        );

        if (response.data.success) {
          // Optionally, fetch updated messages after sending
          const messagesResponse = await axios.get(
            `http://localhost:4000/messages?conversationId=${conId}`
          );
          setMessages(messagesResponse.data);
        } else {
          console.error("Failed to send message:", response.data.error);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <Layout>
      <div className="container-fluid d-flex flex-column vh-100">
        <div className="row flex-grow-1 overflow-auto">
          <div className="col-md-8 mx-auto">
            <div className="chat-messages p-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-3 ${
                    message.type === "sent" ? "text-end" : "text-start"
                  }`}
                >
                  <div
                    className={`d-inline-block p-2 rounded ${
                      message.type === "sent"
                        ? "bg-primary text-white" // Sent messages (user)
                        : "bg-light" // Received messages
                    }`}
                  >
                    {message.body}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="row p-3 bg-light">
          <div className="col-md-8 mx-auto">
            <div className="input-group">
              <input
                type="text"
                className="form-control rounded-0"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button
                className="btn btn-primary rounded-0"
                onClick={handleSendMessage}
                disabled={loading || !inputMessage.trim()}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Conversation;
