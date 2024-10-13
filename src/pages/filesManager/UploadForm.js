import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUploadStatus,
  selectUploadError,
  setCurrentFileName,
  setCurrentFileContent,
  clearCurrentFile,
  uploadFilesAsync,
} from "../../store/reducers/filesSlice";
import Layout from "../../components/Layout/Layout";
import { ReactComponent as Upload } from "../../assets/upload.svg";
import { getUserData } from "../../services/profileService";
import "./Files.scss";

const UploadForm = () => {
  const [fileName, setFileName] = useState("");
  const [fileContent, setFileContent] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [userId, setUserId] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const uploadStatus = useSelector(selectUploadStatus);
  const uploadError = useSelector(selectUploadError);

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      const userData = await getUserData();
      setUserId(userData.id);
    };
    fetchUserData();

    return () => {
      // Clear file data when component unmounts
      dispatch(clearCurrentFile());
    };
  }, [dispatch]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileContent(file);
    setCurrentFileName(file.name); // Dispatch action to update file name in state
    if (
      file &&
      (file.type.startsWith("image/") || file.type === "application/pdf")
    ) {
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (fileName && fileContent) {
      dispatch(
        uploadFilesAsync({ name: fileName, content: fileContent, id: userId })
      )
        .unwrap()
        .then(() => {
          navigate("/file-management");
        })
        .catch((error) => {
          console.error("Upload failed:", error);
        });
      // Clear the current file data from the Redux store
      dispatch(clearCurrentFile());
    }
  };

  const handleDeleteFile = () => {
    setFileContent(null);
    setPreviewUrl(null);
    setFileName("");
  };

  return (
    <Layout>
      <div className="container my-5 upload-form">
        <div className="row">
          <div className="col-md-12">
            <h2>إدارة الملفات</h2>
            <p> نموذج الملف</p>
          </div>
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-12">
                <h3>بيانات الملف</h3>
              </div>
            </div>
            <div className="mb-3 p-3">
              <input
                type="text"
                className="form-control"
                id="fileName"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                required
                placeholder="الاسم التوضيحي"
              />
            </div>

            <div className="mb-3 p-3">
              <label htmlFor="fileUpload" className="upload-label-custom">
                <Upload className="upload-icon" />
                <span>أختار ملف</span>
              </label>
              <input
                type="file"
                className="d-none"
                id="fileUpload"
                onChange={handleFileChange}
                required
              />
            </div>

            {previewUrl && (
              <div className="mb-3 p-3">
                <label className="form-label">معاينة الملف</label>
                {fileContent.type.startsWith("image/") ? (
                  <img src={previewUrl} alt="Preview" className="img-fluid" />
                ) : (
                  <embed src={previewUrl} width="100%" height="400px" />
                )}
              </div>
            )}

            <div className="d-flex justify-content-between">
              <button type="submit" className="btn m-3 text-white">
                رفع الملف
              </button>
              {fileContent && (
                <button
                  type="button"
                  className="btn m-3 text-white bg-danger"
                  onClick={handleDeleteFile}
                >
                  حذف الملف
                </button>
              )}
            </div>
          </form>
          {uploadError && (
            <div className="alert alert-danger">{uploadError.message}</div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UploadForm;
