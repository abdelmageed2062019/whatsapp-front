import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { ReactComponent as Chat } from "../../assets/single-chat.svg";
import "./SingleMessaging.scss";
const SingleMessaging = () => {
  return (
    <Layout>
      <div className="container mt-4 singlemessaging-section">
        <div className="row">
          <div className="col-md-12">
            <h2> المراسلة الفردية</h2>
            <p>تواصل مباشرة مع عملاءك من خلال الدردشة المباشرة لاد واتس</p>
            <p className="text-danger">
              تنبيه: المراسلة الفردية توقف عمل الرد التلقائي والروبوت الذكي
              للمستخدمين النشطين هنا ، وتعود للعمل فور اغلاق المراسلة الخاصة بهم
              هنا
            </p>
          </div>
        </div>
        <div className="mb-3">
          <Link
            to="/individual-messaging/create"
            className="btn singlemessaging d-inline-block"
          >
            <Chat />
            <p>أنشاء دردشة جديدة </p>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default SingleMessaging;
