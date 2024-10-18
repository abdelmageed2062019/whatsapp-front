import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useForm } from "react-hook-form";
import { login as authLogin } from "../../services/authService";
import loginImg from "../../assets/login-bg.svg";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  const [loading, setLoading] = useState(false); // New loading state

  const onSubmit = async (data) => {
    const { email, password } = data;
    setLoading(true); // Start loading
    try {
      const token = await authLogin(email, password);
      login(token);

      // Success toast notification
      toast.success("Successfully logged in!");

      setError("");
    } catch (error) {
      setError(error.message);

      // Error toast notification
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="login">
      <div className="container mt-5 text-center">
        <div className="row">
          <div className="col-md-6">
            <form onSubmit={handleSubmit(onSubmit)} className="m-auto">
              <h2 className="text-dark">تسجيل الدخول</h2>

              <div className="form-group">
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  className="form-control"
                  placeholder="أدخل بريدك الالكتروني"
                  disabled={loading} // Disable input during loading
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
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="form-control"
                  placeholder="كلمة المرور"
                  disabled={loading} // Disable input during loading
                />
                {errors.password && (
                  <p className="text-danger">{errors.password.message}</p>
                )}
              </div>

              {error && <p className="text-danger">{error}</p>}

              <button
                type="submit"
                className="btn btn-primary mt-3"
                disabled={loading} // Disable button during loading
              >
                {loading ? "جاري الدخول..." : "دخول"}
              </button>
            </form>
          </div>

          <div className="col-md-6">
            <h2 className="mb-4">أهلًا بك في أد واتس</h2>

            <div className="img-wrapper">
              <img src={loginImg} alt="Register" className="img-fluid" />
            </div>

            <div className="btns d-flex align-items-center justify-content-center flex-column mt-3">
              <p>ليس لديك حساب ؟ </p>
              <Link to={"/register"} className="btn text-white underline_link">
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
