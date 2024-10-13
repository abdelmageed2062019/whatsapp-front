import { Twitter, Facebook, Instagram, Youtube } from "lucide-react";
import "./Footer.scss";
const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="row">
          <div className="col-md-9">
            <div className="row">
              <div className="col-md-3">
                <ul>
                  <li> إنشاء حساب جديد</li>
                  <li> الدخول إلى حسابي</li>
                </ul>
              </div>

              <div className="col-md-3">
                <ul>
                  <li>عن أد واتس</li>
                  <li>سياسة الخصوصية</li>
                  <li>اضمن حقوقك</li>
                  <li>الشروط و الأحكام</li>
                </ul>
              </div>
              <div className="col-md-3">
                <ul>
                  <li>باقات أد واتس </li>
                  <li>الأسئلة الشائعة </li>
                  <li> اتصل بنا</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-md-3 text-center d-flex flex-column align-items-center justify-content-between">
            <div className="footer-logo">Logo</div>
            <div className="social-icons">
              <Twitter />
              <Facebook />
              <Instagram />
              <Youtube />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
