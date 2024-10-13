import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAccountsAsync,
  selectAccounts,
  selectAccountStatus,
  selectAccountError,
} from "../../store/reducers/accountSlice";

import {
  getContactsAsync,
  selectAllContacts,
  selectContactsFetchStatus,
  selectContactsFetchError,
} from "../../store/reducers/contactSlice";
import axios from "axios";
const GroupMessagingForm = () => {
  const [formData, setFormData] = useState({
    campaignName: "",
    whatsappAccount: "",
    contactList: "",
    minInterval: "",
    maxInterval: "",
    startDate: "",
    endDate: "",
    message: "",
  });

  const dispatch = useDispatch();

  // Fetch accounts and contacts
  useEffect(() => {
    dispatch(fetchAccountsAsync());
    dispatch(getContactsAsync());
  }, [dispatch]);

  // Selectors for accounts and contacts
  const accounts = useSelector(selectAccounts);
  const contacts = useSelector(selectAllContacts);

  console.log(contacts);

  const [messages, setMessages] = useState([]);

  // Mock data for image and video dropdowns
  const imageOptions = ["image1.jpg", "image2.jpg", "image3.jpg"];
  const videoOptions = ["video1.mp4", "video2.mp4", "video3.mp4"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMessageChange = (index, field, value) => {
    const newMessages = [...messages];
    newMessages[index] = { ...newMessages[index], [field]: value };
    setMessages(newMessages);
  };

  const addMessageInput = (type) => {
    setMessages([
      ...messages,
      { messageType: type, content: "", url: "", file: "" },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalMessage = messages
      .map((msg) => {
        switch (msg.messageType) {
          case "رسالة نصية برابط":
            return `${msg.content} - رابط: ${msg.url}`;
          case "صورة":
          case "صورة بنص كبير":
            return `صورة: ${msg.file} - نص: ${msg.content}`;
          case "فيديو":
          case "فيديو بنص كبير":
            return `فيديو: ${msg.file} - نص: ${msg.content}`;
          case "ملف":
            return `ملف: ${msg.file} - نص: ${msg.content}`;
          default:
            return msg.content;
        }
      })
      .join("\n");

    const dataToSend = {
      campaignName: formData.campaignName || "Default Campaign",
      contacts: contacts[0].contacts.map((contact) => ({
        name: contact.name,
        number: contact.phone_number,
      })),
      message: finalMessage || "Default Message",
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      minInterval: formData.minInterval || 10,
      maxInterval: formData.maxInterval || 20,
      whatsappAccount: formData.whatsappAccount || "Default Account",
    };

    try {
      const response = await axios.post(
        "http://localhost:4000/create-campaign",
        dataToSend
      );
      console.log("Campaign created successfully:", response.data);
    } catch (error) {
      console.error(
        "Error creating campaign:",
        error.response?.data || error.message
      );
    }
  };

  const renderMessageInput = (message, index) => {
    switch (message.messageType) {
      case "رسالة نصية":
      case "رسالة نصية برابط":
        return (
          <>
            <textarea
              name="content"
              className="form-control mb-2"
              value={message.content}
              onChange={(e) =>
                handleMessageChange(index, "content", e.target.value)
              }
              placeholder={`اكتب محتوى ${message.messageType} هنا...`}
              required
            />
            {message.messageType === "رسالة نصية برابط" && (
              <input
                type="url"
                name="url"
                className="form-control mb-2"
                placeholder="أدخل الرابط هنا"
                value={message.url}
                onChange={(e) =>
                  handleMessageChange(index, "url", e.target.value)
                }
                required
              />
            )}
          </>
        );
      case "صورة":
      case "صورة بنص كبير":
        return (
          <>
            <select
              name="file"
              className="form-select mb-2"
              value={message.file}
              onChange={(e) =>
                handleMessageChange(index, "file", e.target.value)
              }
              required
            >
              <option value="">اختر صورة...</option>
              {imageOptions.map((img, i) => (
                <option key={i} value={img}>
                  {img}
                </option>
              ))}
            </select>
            <textarea
              name="content"
              className="form-control mb-2"
              value={message.content}
              onChange={(e) =>
                handleMessageChange(index, "content", e.target.value)
              }
              placeholder="أدخل النص المصاحب للصورة هنا..."
              required
            />
          </>
        );
      case "فيديو":
      case "فيديو بنص كبير":
        return (
          <>
            <select
              name="file"
              className="form-select mb-2"
              value={message.file}
              onChange={(e) =>
                handleMessageChange(index, "file", e.target.value)
              }
              required
            >
              <option value="">اختر فيديو...</option>
              {videoOptions.map((vid, i) => (
                <option key={i} value={vid}>
                  {vid}
                </option>
              ))}
            </select>
            <textarea
              name="content"
              className="form-control mb-2"
              value={message.content}
              onChange={(e) =>
                handleMessageChange(index, "content", e.target.value)
              }
              placeholder="أدخل النص المصاحب للفيديو هنا..."
              required
            />
          </>
        );
      case "ملف":
        return (
          <>
            <input
              type="file"
              name="file"
              className="form-control mb-2"
              onChange={(e) =>
                handleMessageChange(index, "file", e.target.files[0].name)
              }
              required
            />
            <textarea
              name="content"
              className="form-control mb-2"
              value={message.content}
              onChange={(e) =>
                handleMessageChange(index, "content", e.target.value)
              }
              placeholder="أدخل النص المصاحب للملف هنا..."
              required
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="container my-5">
        <div className="row">
          <div className="col-12">
            <h2>حملة الرسائل</h2>
            <p>نموذج حملة الرسائل</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5">
          <div className="row">
            <div className="col-md-6">
              <div className="form-section mb-4">
                <div className="card-header">
                  <h3 className="mb-0">بيانات الحملة</h3>
                </div>
                <div className="card-body p-4 p-4">
                  <div className="mb-3">
                    <label htmlFor="campaignName" className="form-label">
                      اسم الحملة
                    </label>
                    <input
                      type="text"
                      id="campaignName"
                      name="campaignName"
                      className="form-control"
                      value={formData.campaignName}
                      onChange={handleInputChange}
                      required
                      placeholder="أدخل اسم الحملة"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="whatsappAccount" className="form-label">
                      حساب الواتساب
                    </label>
                    <select
                      id="whatsappAccount"
                      name="whatsappAccount"
                      className="form-select"
                      value={formData.whatsappAccount}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled>
                        اختر...
                      </option>
                      {accounts.numbers &&
                        accounts.numbers.map((account, i) => (
                          <option key={account.id} value={account.phone_number}>
                            {account.name || account.phone_number}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="contactList" className="form-label">
                      قائمة الاتصال
                    </label>
                    <select
                      id="contactList"
                      name="contactList"
                      className="form-select"
                      value={formData.contactList}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled>
                        اختر...
                      </option>
                      {contacts.map((contact, i) => (
                        <option key={i} value={contact.id}>
                          {contact.list_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-section mb-4">
                <div className="card-header">
                  <h3 className="mb-0">سرعة الإرسال</h3>
                </div>
                <div className="card-body p-4">
                  <div className="mb-3">
                    <label htmlFor="minInterval" className="form-label">
                      الحد الأدنى للفاصل الزمني (بالثواني)
                    </label>
                    <input
                      type="number"
                      id="minInterval"
                      name="minInterval"
                      className="form-control"
                      value={formData.minInterval}
                      onChange={handleInputChange}
                      required
                      placeholder="أدخل الحد الأدنى للفاصل الزمني"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="maxInterval" className="form-label">
                      الحد الأقصى للفاصل الزمني (بالثواني)
                    </label>
                    <input
                      type="number"
                      id="maxInterval"
                      name="maxInterval"
                      className="form-control"
                      value={formData.maxInterval}
                      onChange={handleInputChange}
                      required
                      placeholder="أدخل الحد الأقصى للفاصل الزمني"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section mb-4">
                <div className="card-header">
                  <h3 className="mb-0">تاريخ الحملة</h3>
                </div>
                <div className="card-body p-4">
                  <div className="mb-3">
                    <label htmlFor="startDate" className="form-label">
                      تاريخ بدء الحملة
                    </label>
                    <input
                      type="datetime-local"
                      id="startDate"
                      name="startDate"
                      className="form-control"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="endDate" className="form-label">
                      إيقاف الحملة قبل تاريخ
                    </label>
                    <input
                      type="datetime-local"
                      id="endDate"
                      name="endDate"
                      className="form-control"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-section mb-4">
            <div className="card-header">
              <h3 className="mb-0">نوع الرسالة</h3>
            </div>
            <div className="card-body p-4">
              <div className="mb-3">
                <label htmlFor="messageType" className="form-label">
                  اختر نوع الرسالة
                </label>
                <div className="d-flex flex-column align-items-start">
                  <span className="mb-2">
                    يمكنك استخدام المتغيرات بإدراجها بين قوسين هكذا: "Param1"
                  </span>
                  <div className="dropdown">
                    <button
                      className="btn btn-secondary dropdown-toggle"
                      type="button"
                      id="messageTypeDropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      إضافة رسالة
                    </button>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="messageTypeDropdown"
                    >
                      {[
                        "رسالة نصية",
                        "رسالة نصية برابط",
                        "صورة",
                        "صورة بنص كبير",
                        "فيديو",
                        "فيديو بنص كبير",
                        "ملف",
                      ].map((type, index) => (
                        <li key={index}>
                          <button
                            className="dropdown-item"
                            type="button"
                            onClick={() => addMessageInput(type)}
                          >
                            {type}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {messages.map((message, index) => (
                <div key={index} className="form-section mb-3">
                  <div className="card-header">
                    <h5 className="mb-0 p-4">{message.messageType}</h5>
                  </div>
                  <div className="card-body p-4">
                    {renderMessageInput(message, index)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary mt-3">
            إنشاء
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default GroupMessagingForm;