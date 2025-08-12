import React from 'react';
import {Link} from 'react-router-dom';

const CardReview = (props) => {
    return (
        
        <div className="card review-table">
            <div className="media">
                <div className="form-check align-self-center custom-checkbox me-3 mb-3 mb-lg-0">
                    <input type="checkbox" className="form-check-input" id="customCheckBox2" required="" />
                    <label className="form-check-label" htmlFor="customCheckBox2"></label>
                </div>
                <img className="me-3 img-fluid" width="110" src={props.image} alt="DexignZone" />
                <div className="media-body">
                    <h3 className="fs-20 text-black font-w600 mb-3"><Link to={"/email-read"} className="text-black">{props.name}</Link>
                        <span className="star-review ms-sm-3 ms-0 d-sm-inline-block d-block">
                            <i className="fa fa-star text-orange" />{" "}
                            <i className="fa fa-star text-orange" />{" "}
                            <i className="fa fa-star text-orange" />{" "}
                            <i className="fa fa-star text-orange" />{" "}
                            <i className="fa fa-star text-gray" />
                        </span>
                    </h3>
                    <p>{props.para}</p>
                    <span className="fs-15">Sunday, 24 October 2023 04:55 PM</span>
                </div>
                <div className="media-footer d-flex align-self-center">
                    <div className="disease me-5">
                        <p className="mb-1 fs-14">Disease</p>
                        <h4 className="text-primary">{props.subtitle}</h4>
                    </div>
                    <div className="edit ms-auto">
                        <Link to={"#"} className="btn btn-outline-danger">DELETE</Link>
                        <Link to={"#"} className="btn btn-outline-primary ms-2">PUBLISH</Link>
                    </div>
                </div>
            </div>
        </div>    
        
    );
};

export default CardReview;