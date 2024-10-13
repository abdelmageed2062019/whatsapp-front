import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useForm } from "react-hook-form";
import { login as authLogin } from "../../services/authService";
import loginImg from "../../assets/login-bg.svg";
import { Link } from "react-router-dom";

import "./login.scss";
import Footer from "../../components/Footer/Footer";
const Login = () => {
  const { login } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    const { email, password } = data;
    try {
      const token = await authLogin(email, password);
      console.log(token);

      login(token);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login">
      <div className="container mt-5 text-center">
        <div className="row">
          <div className="col-md-6">
            <form onSubmit={handleSubmit(onSubmit)} className="m-auto">
              <h2 className="text-dark">Login</h2>

              <div className="form-group">
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  className="form-control"
                  placeholder="أدخل بريدك الالكتروني"
                />
                {errors.email && (
                  <p className="text-danger">{errors.email.message}</p>
                )}
              </div>

              <div className="form-group">
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: 6,
                  })}
                  className="form-control"
                  placeholder=" كلمة المرور"
                />
                {errors.password && (
                  <p className="text-danger">{errors.password.message}</p>
                )}
              </div>

              {error && <p className="text-danger">{error}</p>}
              <button type="submit" className="btn btn-primary mt-3">
                Submit
              </button>
            </form>
          </div>

          <div className="col-md-6">
            <h2 className="mb-4">أهلًا بك في أد واتس</h2>

            <div className="img-wrapper">
              <img src={loginImg} alt="Register" />
            </div>

            <div className="btns d-flex align-items-center justify-content-center flex-column mt-3">
              <p>ليس لديك حساب ؟ </p>
              <Link to={"/register"} className="btn text-white">
                انشاء حساب
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
