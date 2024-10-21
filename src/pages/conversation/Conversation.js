import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import {
  getConversation,
  storeMessage,
  receiveMessage,
} from "../../services/messageService";
import { showConversation } from "../../services/conversationService";
import { useParams } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client"; // Import Socket.io client

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

    const fetchMessages = async () => {
      try {
        const { messages } = await showConversation(conId);
        // Filter messages to only include those with matching conversation_id
        const filteredMessages = messages.filter(
          (message) => message.conversation_id === +conId
        );
        console.log(filteredMessages);

        setMessages(filteredMessages);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    // Connect to Socket.io
    const socket = io("http://localhost:4000");

    // Listen for received messages
    socket.on("messageReceived", (newMessage) => {
      receiveMessage({
        sender_number: newMessage.from.substring(1),
        receive_number: newMessage.to,
        body: newMessage.body,
      });
      // Add condition to check if the message belongs to the current conversation
      if (newMessage.conversation_id === conId) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    fetchConversation();
    fetchMessages();

    const intervalId = setInterval(fetchMessages, 5000);

    return () => {
      clearInterval(intervalId);
      socket.disconnect(); // Disconnect from Socket.io on unmount
    };
  }, [conId]);

  console.log();

  const formatPhoneNumber = (number) => {
    if (number.startsWith("0")) {
      return `2${number.substring(1)}`;
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
      const messageToSend = inputMessage;
      setInputMessage("");

      try {
        const formattedNumber = formatPhoneNumber(conversationData.phone);

        const response = await axios.post(
          "http://localhost:4000/send-message",
          {
            number: conversationData.phone,
            message: messageToSend,
          }
        );

        if (response.data.success) {
          await storeMessage({
            conversation_id: conversationData.id,
            sender_number: conversationData.phone_sender,
            receive_number: conversationData.phone,
            body: messageToSend,
            user_id: conversationData.user_id,
            employee_id: conversationData.employee_id,
            receiver_name: conversationData.receiver_name,
            type: "sent",
          });

          setMessages((prevMessages) => [
            ...prevMessages,
            {
              body: messageToSend,
              type: "sent",
              conversation_id: conversationData.id,
            },
          ]);
        } else {
          console.error("Failed to send message:", response.data.error);
        }
      } catch (error) {
        console.error("Error sending or storing message:", error);
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
                  <span
                    className={`badge fs-3 ${
                      message.type === "sent" ? "bg-success" : "bg-primary"
                    }`}
                  >
                    {message.body}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-8 mx-auto">
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Type your message"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
              />
              <button
                className="btn btn-primary"
                type="button"
                onClick={handleSendMessage}
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
