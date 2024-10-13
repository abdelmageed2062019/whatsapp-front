import React from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { ReactComponent as GroupChat } from "../../assets/microphone.svg";
const Groupessaging = () => {
  return (
    <Layout>
      <div className="container mt-4 contacts-section">
        <div className="row">
          <div className="col-md-12">
            <h2>المراسلة الجماعية </h2>
            <p>هنا الرسائل الجماعية التي يتم إرسالها آلياً </p>
          </div>
        </div>
        <div className="mb-3">
          <Link
            to="/group-messaging/create"
            className="btn contact d-inline-block"
          >
            <GroupChat />
            <p>أنشاء قوائمة اتصال جديدة </p>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Groupessaging;
