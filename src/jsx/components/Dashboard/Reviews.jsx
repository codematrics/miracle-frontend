import React from 'react';
import {Link} from 'react-router-dom';
import {Dropdown, Nav, Tab} from 'react-bootstrap'

import { IMAGES } from '../../constant/theme';
import CardReview from './Element/CardReview';

const cardBlog = [
    { image: IMAGES.Avatar, name:'Glee Smiley', subtitle:'Diabetes', para:"When I came with my mother, I was very nervous. But after entering here I felt warmed with smiling"},
    { image: IMAGES.Avatar2, name:'Alexa Keev', subtitle:'Dental Care', para:"Thanks for all the services, no doubt it is the best hospital. My kidney, BP, diabetes problem"},
    { image: IMAGES.Avatar3, name:'Ivankov', subtitle:'Cold & Flu', para:"I am very much glad to note my feedback and grateful. Thanks to Dr. Chibber and assistants. I got very good guidelines for my patient."},
    { image: IMAGES.Avatar4, name:'Axestoria Jr.', subtitle:'Diabetes', para:"When I came with my mother, I was very nervous. But after entering here I felt warmed with smiling"},
    { image: IMAGES.Avatar5, name:'Kevin Heirn', subtitle:'Dental Care', para:"It was never a feeling as if I was in a hospital. I got the best care. The response of each staff, right from security (screening), housekeeping, admission staff, nurses, trainee doctor, Doctor was excellent. "},
];

const Reviews = () => {
    return (
        <>
            <Tab.Container defaultActiveKey={"All"}>
                <div className="form-head page-titles d-flex mb-md-4">
                    <div className="me-auto">
                        <h2 className="text-black font-w600">Reviews</h2>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item active"><Link to={"#"}>Doctor</Link></li>
                            <li className="breadcrumb-item"><Link to={"#"}>#P-0616</Link></li>
                        </ol>
                    </div>
                    <div className="d-sm-flex d-block mb-0 align-items-end">
                        <Nav as="ul" className="nav nav-pills review-tab me-3 mb-2">
                            <Nav.Item as="li" className="nav-item">
                                <Nav.Link eventKey="All">ALL REVIEW</Nav.Link>
                            </Nav.Item>
                            <Nav.Item as="li">
                                <Nav.Link eventKey="Published">PUBLISHED</Nav.Link>
                            </Nav.Item>
                            <Nav.Item as="li">
                                <Nav.Link eventKey="Deleted">DELETED</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <Dropdown  className="dropdown d-inline-block mb-2">
                            <Dropdown.Toggle className="btn btn-outline-primary " as="div">
                                Newest
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="dropdown-menu-left" align="end">
                                <Dropdown.Item eventKey="All">Newest</Dropdown.Item>
                                <Dropdown.Item eventKey="Published">Published</Dropdown.Item>
                                <Dropdown.Item eventKey="Deleted">Deleted</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xl-12">
                        <Tab.Content className="tab-content">
                            <Tab.Pane eventKey="All">
                                {cardBlog.map((item, ind)=>(
                                    <CardReview image={item.image} name={item.name} subtitle={item.subtitle} para={item.para} key={ind} />
                                ))}
                            </Tab.Pane>   
                            <Tab.Pane eventKey="Published">
                                {cardBlog.slice(1,3).map((item, ind)=>(
                                    <CardReview image={item.image} name={item.name} subtitle={item.subtitle} para={item.para} key={ind} />
                                ))}
                            </Tab.Pane>   
                            <Tab.Pane eventKey="Deleted">
                                {cardBlog.slice(2,5).map((item, ind)=>(
                                    <CardReview image={item.image} name={item.name} subtitle={item.subtitle} para={item.para} key={ind} />
                                ))}
                            </Tab.Pane>   
                        </Tab.Content>   
                    </div>
                    <div className="col-xl-12">
                        <div className="d-md-flex d-block align-items-center mt-4">
                            <p className="mb-2 mb-sm-0">Showing 10 from 46 data</p>
                            <nav className="ms-auto">
                                <ul className="pagination">
                                    <li className="page-item page-indicator">
                                        <Link to={"#"} className="page-link">
                                            <i className="la la-angle-left" />
                                        </Link>
                                    </li>
                                    <li className="page-item active"><Link to={"#"} className="page-link">1</Link></li>
                                    <li className="page-item"><Link to={"#"} className="page-link">2</Link></li>
                                    <li className="page-item"><Link to={"#"} className="page-link">3</Link></li>
                                    <li className="page-item"><Link to={"#"} className="page-link">4</Link></li>
                                    <li className="page-item page-indicator">
                                        <Link to={"#"} className="page-link">
                                            <i className="la la-angle-right" />
                                        </Link>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </Tab.Container>
        </>
    );
};

export default Reviews;