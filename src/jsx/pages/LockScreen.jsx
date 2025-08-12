import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
// image
import logo from "../../assets/images/logo-full.png";

import { ThemeContext } from "../../context/ThemeContext";


const LockScreen = () => {
    const { background } = useContext(ThemeContext);	
    const nav = useNavigate();
    const submitHandler = (e) => {
        e.preventDefault();
        nav("/dashboard");
    };      
  return (

    <>
        <div className="authincation">
            <div className="container">
                <div className="row justify-content-center h-100 align-items-center">
                    <div className="col-md-8 col-lg-6">
                        <div className="authincation-content style-bg">
                            <div className="row no-gutters">
                                <div className="col-xl-12">
                                    <div className="auth-form">
                                      <div className="text-center mb-3">
                                        <Link to="/dashboard">
                                            {background.value==="light" ?
                                                <img src={logo} alt="" />
                                                :   
                                                <img src={logo} alt="" />                                                
                                            }
                                        </Link>
                                      </div>
                                        <h4 className="text-center mb-4 text-white">Account Locked</h4>
                                        <form onSubmit={(e) => submitHandler(e)}>
                                            <div className="mb-3">
                                                <label className="text-white"><strong>Password</strong></label><span className="required"> *</span>
                                                <input type="password" className="form-control" defaultValue="Password" />
                                            </div>
                                            <div className="text-center">
                                                <button type="submit" className="btn bg-white text-primary btn-block">Submit</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>  
  );
};

export default LockScreen;
