import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getFilesAsync,
  selectAllFiles,
  selectFilesFetchStatus,
  selectFilesFetchError,
} from "../../store/reducers/filesSlice"; // Adjust the import path as necessary
import Layout from "../../components/Layout/Layout";
import { ReactComponent as Upload } from "../../assets/upload.svg";
import "./Files.scss";
import { getUserData } from "../../services/profileService";

const FileManager = () => {
  const [userId, setUserId] = useState(null);
  const dispatch = useDispatch();
  const files = useSelector(selectAllFiles);
  const filesFetchStatus = useSelector(selectFilesFetchStatus);
  const filesFetchError = useSelector(selectFilesFetchError);

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

  // Fetch files only if userId is available
  useEffect(() => {
    if (userId) {
      dispatch(getFilesAsync(userId));
    }
  }, [dispatch, userId]);

  // Optional handleDelete function
  const handleDelete = (fileIndex) => {
    // Implement your delete functionality here
    console.log(`Delete file at index: ${fileIndex}`);
    // dispatch(deleteFileAsync(files[fileIndex].id)); // Example for dispatching delete action
  };

  return (
    <Layout>
      <div className="container mt-4 upload-section">
        <div className="row">
          <div className="col-md-12">
            <h2>إدارة الملفات</h2>
            <p>الاستخدام: 0 / 100 ميجابايت</p>
            <p className="text-danger">
              عند حذف ملف ، سيتم تخطي الرسائل التي تستخدمه ، لذلك توخى الحذر عند
              الحذف
            </p>
            {filesFetchStatus === "loading" && <p>جاري تحميل الملفات...</p>}
            {filesFetchStatus === "failed" && (
              <p className="text-danger">{filesFetchError.message}</p>
            )}
          </div>
        </div>
        <div className="mb-3">
          <Link
            to="/file-managment/create"
            className="btn upload d-inline-block"
          >
            <Upload />
            <p>تحميال ملف جديد</p>
          </Link>
        </div>
        <h3>الملفات</h3>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {files.map((file, index) => (
            <div key={index} className="col">
              <div className="card">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">{file.type}</h5>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDelete(index)} // Use the handleDelete function here
                  >
                    &times;
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default FileManager;
