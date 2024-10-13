import { useForm } from "react-hook-form";
import { signup } from "../../services/authService";
import { Link, useNavigate } from "react-router-dom";
import registerImg from "../../assets/register-bg.svg";
import Footer from "../../components/Footer/Footer";

import { ReactComponent as Google } from "../../assets/bi_google.svg";

import "./register.scss";
const Register = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      country_code: "+91",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    const { name, email, phone, company, country_code, password } = data;
    const result = await signup(
      name,
      email,
      phone,
      company,
      country_code,
      password
    );
    try {
      if (result.status === true) {
        navigate("/login");
      }
    } catch (error) {
      console.log("signup error: ", error);
    }
  };
  return (
    <div className="register">
      <div className="container mt-5 text-center">
        <div className="row">
          <div className="col-md-6">
            <form onSubmit={handleSubmit(onSubmit)} className="m-auto">
              <h2 className="text-dark">Register</h2>

              <div className="form-group">
                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  className="form-control"
                  placeholder="الاسم بالكامل"
                />

                {errors.fullname && (
                  <p className="text-danger">{errors.name.message}</p>
                )}
              </div>
              <div className="form-group">
                <input
                  type="text"
                  {...register("company", {
                    required: "Company name is required",
                  })}
                  className="form-control"
                  placeholder="اسم الشركة"
                />

                {errors.companyName && (
                  <p className="text-danger">{errors.company.message}</p>
                )}
              </div>
              <div className="form-group">
                <div className="d-flex gap-4 justify-content-between">
                  <input
                    type="text"
                    {...register("country_code", {
                      required: "Country code is required",
                    })}
                    className="form-control me-2"
                    style={{ width: "80px" }}
                    placeholder="EG"
                  />
                  <input
                    type="tel"
                    {...register("phone", {
                      required: "Phone number is required",
                    })}
                    className="form-control "
                    placeholder="رقم الهاتف"
                  />
                </div>
                {errors.country_code && (
                  <p className="text-danger">{errors.country_code.message}</p>
                )}
                {errors.phone && (
                  <p className="text-danger">{errors.phone.message}</p>
                )}
              </div>
              <div className="form-group">
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  className="form-control"
                  placeholder="عنوان بريدك الإلكتروني"
                />

                {errors.email && (
                  <p className="text-danger">{errors.email.message}</p>
                )}
              </div>
              <div className="form-group">
                <input
                  type="password"
                  className="form-control"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  placeholder="كلمة السر"
                />
                {errors.password && (
                  <p className="text-danger">{errors.password.message}</p>
                )}
              </div>
              <div className="form-group">
                <input
                  type="password"
                  {...register("confirmPassword", {
                    required: "Confirm password is required",
                    validate: (value) =>
                      value === watch("password") || "Passwords do not match",
                  })}
                  className="form-control"
                  placeholder="تأكيد كلمة المرور"
                />
                {errors.confirmPassword && (
                  <p className="text-danger">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <button type="submit" className="btn text-white mt-3">
                تسجيل
              </button>

              <div className="register-google">
                <p>تسجيل باستخدام حساب جوجل</p>

                <Google />
              </div>
            </form>
          </div>

          <div className="col-md-6">
            <h2>أهلًا بك في أد واتس</h2>

            <div className="img-wrapper">
              <img src={registerImg} alt="Register" />
            </div>

            <div className="btns d-flex align-items-center justify-content-center flex-column mt-3">
              <p>هل لديك حساب؟</p>
              <Link to={"/login"} className="btn text-white">
                قم بتسجيل دخولك الآن
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;
