import React, { useContext, useState } from "react";
/// React router dom
import { Link } from "react-router-dom";
import { ThemeContext } from "../../../context/ThemeContext";

//images
import logo from './../../../assets/images/logo.png';
import logotext from './../../../assets/images/logo-text.png';

export function NavMenuToggle() {
  setTimeout(() => {
    let mainwrapper = document.querySelector("#main-wrapper");
    if (mainwrapper.classList.contains('menu-toggle')) {
      mainwrapper.classList.remove("menu-toggle");
    } else {
      mainwrapper.classList.add("menu-toggle");
    }
  }, 200);
}


const NavHader = () => {
  const [toggle, setToggle] = useState(false);
  const { navigationHader, openMenuToggle, background } = useContext(
    ThemeContext
  );
  return (
    <div className="nav-header">
      <Link to="/dashboard" className="brand-logo">
        <img className="logo-abbr" src={logo} alt="logo" />
        <h6 className="brand-title">Miracle Hospital</h6>
        {/* <img className="logo-abbr" src={logo} alt="logo" />
          <img className="logo-compact" src={logotext} alt="text" />
          <img className="brand-title" src={logotext} alt="text" /> */}
      </Link>

      <div
        className="nav-control"
        onClick={() => {
          setToggle(!toggle);
          openMenuToggle();
          NavMenuToggle();
        }}
      >
        <div className={`hamburger ${toggle ? "is-active" : ""}`}>
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </div>
      </div>
    </div>
  );
};

export default NavHader;
