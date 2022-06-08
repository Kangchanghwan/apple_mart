import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
const Home = () => {
  const { userObj } = useSelector(({ user }) => ({
    userObj: user.currentUser,
  }));
  const navigate = useNavigate();
  return (
    <>
      <div className="bg-light ">
        <div className="row ">
          <div className="pt-0 col-md-12"></div>
        </div>
      </div>
      <section
        className="pt-4 banner"
        style={{
          marginTop: "58px",
          height: "100%",
          width: "100%",
        }}
      >
        <div className="row">
          <div className="pt-2 col-md-12">
            <div className="text-center text-light text">
              <h2 className="banner-header-text">AppleMart</h2>
              {!userObj ? (
                <>
                  <h3 className="banner-text">
                    {" "}
                    회원가입 후 서비스 이용이 가능합니다.
                  </h3>
                  <Link to="/auth">
                    Let's start{" "}
                    {/*<i className="banner-links-icons font-weight-normal fas fa-chevron-right"></i>*/}
                  </Link>
                </>
              ) : (
                <>
                  <h3 className="banner-text">
                    {userObj.displayName === "" || !userObj.displayName
                      ? "닉네임을 설정해 주세요"
                      : `${userObj.displayName}님 환영합니다.`}
                  </h3>
                  {userObj.displayName === "" ? (
                    <Link to="/profile">
                      My Profile{" "}
                      <i className="banner-links-icons font-weight-normal fas fa-chevron-right"></i>
                    </Link>
                  ) : (
                    ``
                  )}
                </>
              )}
              <div className="banner-image-box">
                <img
                  style={{
                    height: "394px",
                    width: "847px",
                  }}
                  id="myImg"
                  className="banner-image"
                  alt="imgA"
                  src="./images/index-banner.jpg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        className="mt-3 mb-3 banner-two"
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        <div className="row">
          <div className="pt-2 col-md-12">
            <div className="text-center text-black text">
              <div className="banner-image-box">
                <img
                  style={{
                    height: "500px",
                    width: "100%",
                    objectFit: "cover",
                  }}
                  id="myImg"
                  className="banner-image"
                  alt="imgA"
                  src="./images/hero_imac__dqh65mwjj04m_large.jpg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        className="mt-3 mb-3 banner-two"
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        <div className="row">
          <div className="pt-2 col-md-12">
            <div className="text-center text-black text">
              <div className="banner-image-box">
                <img
                  style={{
                    height: "300px",
                    width: "100%",
                    objectFit: "cover",
                  }}
                  id="myImg"
                  className="banner-image"
                  alt="imgA"
                  src="./images/iphone_12_updated__jepm2xpxncuy_large_2x.jpg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer></Footer>
    </>
  );
};

export default Home;
