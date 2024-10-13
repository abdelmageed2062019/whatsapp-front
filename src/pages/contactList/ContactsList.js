import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { ReactComponent as Contact } from "../../assets/contacts.svg";
import "./Contacts.scss";
import {
  getContactsAsync,
  selectAllContacts,
  selectContactsFetchStatus,
  selectContactsFetchError,
} from "../../store/reducers/contactSlice";
import { Trash2 } from "lucide-react";

const ContactsList = () => {
  const dispatch = useDispatch();
  const contacts = useSelector(selectAllContacts);
  const status = useSelector(selectContactsFetchStatus);
  const error = useSelector(selectContactsFetchError);

  useEffect(() => {
    dispatch(getContactsAsync());
  }, [dispatch]);

  const handleDelete = (id) => {
    // TODO: Implement delete functionality
    console.log(`Delete contact with id: ${id}`);
  };

  return (
    <Layout>
      <div className="container mt-4 contacts-section">
        <div className="row">
          <div className="col-md-12">
            <h2>قوائم الاتصال</h2>
            <p>
              يمكنك تقسيم عملائك إلى مجموعات غير محدودة ، لتسهيل إدارتهم لاحقًا
            </p>
          </div>
        </div>
        <div className="mb-3">
          <Link
            to="/contact-list/create"
            className="btn contact d-inline-block"
          >
            <Contact />
            <p>أنشاء قائمة اتصال جديدة</p>
          </Link>
        </div>

        {status === "loading" && <div>جاري التحميل...</div>}
        {status === "failed" && <div>خطأ: {error.message}</div>}

        {status === "succeeded" && (
          <>
            {contacts && contacts.length > 0 ? (
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mt-5">
                {contacts.map((contact) => (
                  <div key={contact.id} className="col-md-6">
                    <div className="card">
                      <div className="card-body d-flex justify-content-between flex-column align-items-start">
                        <h5 className="card-title mb-0 fw-bold fs-4">
                          {contact.list_name}
                        </h5>
                        <p> {contact.contacts.length} جهة اتصال </p>
                        <button
                          className="btn delete"
                          onClick={() => handleDelete(contact.id)}
                        >
                          <Trash2 />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert alert-info mt-4">
                لا توجد قوائم اتصال حالياً. يرجى إنشاء قائمة جديدة.
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default ContactsList;
