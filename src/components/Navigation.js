import React, { useEffect, useRef, useState } from "react";
import {
  Navbar,
  NavItem,
  Nav,
  ToggleButtonGroup,
  ToggleButton,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Mac from "./toggleGroup/Mac";
import Watch from "./toggleGroup/Watch";
import AirPods from "./toggleGroup/AirPods";
import { useSelector } from "react-redux";
import * as Icon from "../components/common/neighbor/Icon";

const Navigation = ({ listState, list }) => {
  const { userObj } = useSelector(({ user }) => ({
    userObj: user.currentUser,
  }));
  const [value, setValue] = useState([]);

  const handleChange = (val) => {
    setValue([...val]);
    listState([val]);
  };
  useEffect(() => {
    setValue(list);
  }, [list]);

  const onClick = (e) => {
    navigate("/items");
  };

  const buttonSize = {
    fontSize: "12px",
    margin: "8px 8px 8px 8px",
    padding: "4px",
  };
  const navigate = useNavigate();
  const pathArr = [
    "#/profile",
    "#/auth",
    "#/writeItem",
    "#/edit_profile",
    "#/gps",
    "#/sale",
    "#/buy",
    "#/like",
    "#/chatroom",
    "#/chatlist",
    "#/writeReview",
    "#/editItem",
    "#/noticeroom",
  ];
  if (pathArr.findIndex((path) => path === document.location.hash) > -1) {
    return null;
  }

  if (document.location.hash.includes("#/review")) {
    return null;
  }
  if (document.location.hash.includes("#/writeReview")) {
    return null;
  }
  if (document.location.hash.includes("#/seller_profile")) {
    return null;
  }
  return (
    <>
      <Navbar
        id="navbar"
        style={{
          position: "fixed",
          width: "100%",
          maxHeight: "60px",
          paddingLeft: "0px",
          zIndex: 3,
        }}
        className="navdbar navbar-expand-md nav-bg  navbar-dark"
      >
        <Nav style={{ alignItems: "center" }} className="center navbar-nav">
          <NavItem className="nav-item-box">
            <Link
              to="/"
              className="nav-link"
              style={{ width: "1px", display: "" }}
            >
              <img
                src="https://www.apple.com/ac/globalnav/7/en_US/images/be15095f-5a20-57d0-ad14-cf4c638e223a/globalnav_apple_image__b5er5ngrzxqq_large.svg"
                alt="logo"
              />
            </Link>
          </NavItem>
          <ToggleButtonGroup
            type="radio"
            name="buttongroup"
            value={value}
            onChange={handleChange}
            onClick={onClick}
          >
            <ToggleButton
              className=" bg-black border-0  align-self-center navbar-text"
              id="tbg-btn-1"
              name="buttongroup"
              value={"Mac"}
              style={buttonSize}
            >
              <NavItem className="nav-item-box">Mac</NavItem>
            </ToggleButton>
            <ToggleButton
              className="bg-black border-0  align-self-center navbar-text"
              id="tbg-btn-2"
              name="buttongroup"
              value={"iPad"}
              style={buttonSize}
            >
              <NavItem className="nav-item-box">iPad</NavItem>
            </ToggleButton>
            <ToggleButton
              className="bg-black border-0  align-self-center navbar-text"
              id="tbg-btn-3"
              name="buttongroup"
              value={"Watch"}
              style={buttonSize}
            >
              <NavItem className="nav-item-box">Watch</NavItem>
            </ToggleButton>
            <ToggleButton
              className="bg-black border-0  align-self-center navbar-text"
              id="tbg-btn-4"
              name="buttongroup"
              value={"iPhone"}
              style={buttonSize}
            >
              <NavItem className="nav-item-box">iPhone</NavItem>
            </ToggleButton>
            <ToggleButton
              className="bg-black border-0  align-self-center navbar-text"
              id="tbg-btn-5"
              name="buttongroup"
              value={"AirPods"}
              style={buttonSize}
            >
              <NavItem className="nav-item-box">AirPods</NavItem>
            </ToggleButton>
            <ToggleButton
              className="bg-black border-0  align-self-center navbar-text"
              id="tbg-btn-6"
              name="buttongroup"
              value={"Etc."}
              style={buttonSize}
            >
              <NavItem className="nav-item-box">Etc.</NavItem>
            </ToggleButton>
          </ToggleButtonGroup>
          <NavItem className="nav-item-box">
            <Link to="/items" className="text-white nav-icon nav-link ">
              <Icon.Search />
            </Link>
          </NavItem>
          <NavItem className="nav-item-box">
            {userObj ? (
              <Link
                to="/profile"
                style={{ textDecoration: "none" }}
                className="text-white nav-icon nav-link"
              >
                <span style={{ fontSize: "12px", color: "white" }}>MyPage</span>
              </Link>
            ) : (
              <Link
                to="/auth"
                style={{ textDecoration: "none" }}
                className="text-white nav-icon nav-link"
              >
                <span style={{ fontSize: "12px", color: "white" }}>Login</span>
              </Link>
            )}
          </NavItem>
        </Nav>
      </Navbar>
    </>
  );
};

export default Navigation;
