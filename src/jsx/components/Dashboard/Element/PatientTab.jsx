import React from 'react';
import loadable from "@loadable/component";
import pMinDelay from "p-min-delay";

// import RadialChart from './RadialChart';
import { IMAGES } from '../../../constant/theme';

const RadialChart = loadable(() =>
  pMinDelay(import("./RadialChart"), 1000)
);


const PatientTab = (props) => {
    return (
        <>
            <div className="d-flex flex-wrap align-items-center px-4 bg-light">
                <div className="me-auto d-flex align-items-center py-3">
                    <span className="heart-ai bg-primary me-3">
                        <i className="fa-regular fa-heart" aria-hidden="true"></i>
                    </span>
                    <div>
                        <p className="fs-18 mb-2">Total Patient</p>
                        <span className="fs-26 text-primary font-w600">{props.totalpatient}</span>
                    </div>
                </div>
                <ul className="users ps-3 py-2">
                    <li><img src={IMAGES.User1} alt="" /></li>
                    <li><img src={IMAGES.User2} alt="" /></li>
                    <li><img src={IMAGES.User3} alt="" /></li>
                    <li><img src={IMAGES.User4} alt="" /></li>
                    <li><img src={IMAGES.User5} alt="" /></li>
                </ul>
            </div>
            <div className="row align-items-center">
                <div className="col-xl-6 col-xxl-12 col-md-6">
                    <div id="radialBar">
                        <RadialChart />
                    </div>
                </div>
                <div className="col-xl-6 col-xxl-12 col-md-6">
                    <div className="d-flex mb-4 align-items-center">
                        <span className="me-auto ps-3 font-w500 fs-30 text-black">
                            <svg className="me-3" width="8" height="30" viewBox="0 0 8 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="7.65957" height="30" fill="#BDA25C"/>
                            </svg>
                            {props.patient}
                        </span>
                        <span>New Patient</span>
                    </div>
                    <div className="d-flex  mb-4 align-items-center">
                        <span className="me-auto ps-3 font-w500 fs-30 text-black">
                            <svg className="me-3" width="8" height="30" viewBox="0 0 8 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="7.65957" height="30" fill="#209F84"/>
                            </svg>
                            {props.recovered}
                        </span>
                        <span>Recovered</span>
                    </div>
                    <div className="d-flex align-items-center">
                        <span className="me-auto ps-3 font-w500 fs-30 text-black">
                            <svg className="me-3" width="8" height="30" viewBox="0 0 8 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="7.65957" height="30" fill="#323232"/>
                            </svg>
                            {props.treatment}
                        </span>
                        <span>In Treatment</span>
                    </div>
                </div>
            </div>  
        </>
    );
};

export default PatientTab;