import React from "react";
import Home from "../../assets/hero.png";
import "./Hero.scss";
const Hero = () => {
  return (
    <section className="hero-section">
      <div className="container-fluid margin-big">
        <div className="row ">
          <div className="col-md-7">
            <div className="hero-text h-100 d-flex align-items-start flex-column">
              <p className="first">
                العالم الآن بين يديك، ليس هناك المزيد من الوقت
              </p>
              <h2 className="my-5">أد واتس المنصة الأذكى على الإطلاق</h2>
              <p className="second">
                دردشات خاصة و حملات إعلانية و روبوتات ذكية صممت خصيصًا من أجلك
              </p>

              <div className="mt-3">
                <button className="btn primary-btn">سجل الآن</button>

                <button className="btn border-1 secondary-btn">
                  تصفح المزيد
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-5 hero-img">
            <img src={Home} className="img-fluid" alt="person" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
