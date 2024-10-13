import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getUserData } from "./../../services/profileService";
import { useDispatch } from "react-redux";
import {
  updateProfileAsync,
  changePasswordAsync,
} from "../../store/reducers/profileReducer";
import Layout from "../../components/Layout/Layout";
import { ReactComponent as Timer } from "../../assets/timer.svg";
import { ReactComponent as Checked } from "../../assets/checked.svg";
import { ReactComponent as Coupon } from "../../assets/copoun.svg";

import "./profile.scss";
const Profile = () => {
  const [user, setUser] = useState({});
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
  } = useForm();

  useEffect(() => {
    // Fetch user data and pre-fill form fields
    getUserData().then((data) => {
      setUser(data);
      setValue("name", data.name);
      setValue("company", data.company);
      setValue("tax_number", data.tax_number);
    });
  }, [dispatch, setValue]);

  const onSubmitProfile = (data) => {
    const updatedData = {
      name: data.name !== user.name ? data.name : "",
      company: data.company !== user.company ? data.company : "",
      tax_number: data.tax_number !== user.tax_number ? data.tax_number : "",
    };

    const filteredData = Object.fromEntries(
      Object.entries(updatedData).filter(([_, value]) => value !== "")
    );

    if (Object.keys(filteredData).length === 0) {
      console.log("No changes detected, skipping request.");
      return;
    }

    dispatch(updateProfileAsync(filteredData));
  };

  const onSubmitPassword = (data) => {
    if (data.currPassword && data.newPassword) {
      const passwordData = {
        current_password: data.currPassword,
        new_password: data.newPassword,
      };

      dispatch(changePasswordAsync(passwordData));
    } else {
      console.log("No password change detected, skipping request.");
    }
  };

  return (
    <Layout>
      <div className="container mt-5 profile-section">
        <div className="row">
          <div className="col-md-12">
            <h2>ملفي</h2>
            <p>هنا يمكنك التحكم في بيانات و إعدادات ملفك</p>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            {/* Profile Update Form */}
            <form
              onSubmit={handleSubmit(onSubmitProfile)}
              autoComplete="off"
              className="mt-5"
            >
              <div className="row">
                <div className="col-md-12">
                  <h3>بياناتي</h3>
                </div>
              </div>
              <div className=" p-5">
                <div className="form-group">
                  <input
                    type="text"
                    id="name"
                    className="form-control"
                    placeholder="الاسم بالكامل"
                    {...register("name")}
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    id="company"
                    placeholder="اسم الشركة"
                    className="form-control"
                    {...register("company")}
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    id="tax"
                    placeholder="الرقم الضريبي"
                    className="form-control"
                    {...register("tax_number")}
                  />
                </div>
              </div>

              <button type="submit" className="btn text-white mx-5 mb-3">
                تحديث
              </button>
            </form>
          </div>
          <div className="col-md-6">
            {/* Password Update Form */}

            <form
              onSubmit={handlePasswordSubmit(onSubmitPassword)}
              className="mt-5"
              autoComplete="off"
            >
              <div className="row">
                <div className="col-md-12">
                  <h3>تغيير كلمة السر</h3>
                </div>
              </div>
              <div className=" p-5">
                <div className="form-group">
                  <input
                    type="password"
                    id="currPassword"
                    className="form-control"
                    placeholder="كلمة المرور الحالية"
                    {...registerPassword("currPassword", {
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                  {passwordErrors.currPassword && (
                    <p className="text-danger">
                      {passwordErrors.currPassword.message}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <input
                    type="password"
                    id="newPassword"
                    className="form-control"
                    placeholder="كلمة المرور الجديدة"
                    {...registerPassword("newPassword", {
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-danger">
                      {passwordErrors.newPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <button type="submit" className="btn text-white mx-5 mb-3">
                تحديث
              </button>
            </form>
          </div>
        </div>

        <div className="reminder">
          <div className="row">
            <div className="col-md-12">
              <h5 className="reminder__title">
                التسويق بالعمولة ، سوق عبر نشر الكوبون الخاص بك ، واحصل على
                عمولة لكل اشتراك جديد
              </h5>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="reminder__item">
                <div className="reminder__icon">
                  <Timer />
                </div>
                <h4> الكوبون الخاص بك</h4>
                <p className="fw-bold">YHDHYKUP</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="reminder__item">
                <div className="reminder__icon">
                  <Checked />
                </div>
                <h4> العمولات المكتملة</h4>
                <p className="fw-bold"> 0 ر.س</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="reminder__item">
                <div className="reminder__icon">
                  <Coupon />
                </div>
                <h4> العمولات المعلقة</h4>
                <p className="fw-bold"> 0 ر.س</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
