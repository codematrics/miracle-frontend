import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


import { IMAGES } from '../../constant/theme';
import PatientPieChart from './Element/PatientPieChart';
import AbilityPieChart from './Element/AbilityPieChart';

const statisticBlog = [
    { title:'Immunities' , progress:'80%', color:'#5F74BF'},
    { title:'Stamina' , progress:'50%', color:'#FFD439'},
    { title:'Heart Beat' , progress:'90%', color:'#FF6E5A'},
    { title:'Colestrol' , progress:'70%', color:'#5FBF91'},
];

const reviewBlog = [
    { image: IMAGES.User11, title:'Glee Smiley', rating:'4.5'},
    { image: IMAGES.User12, title:'Emilian Brownlee', rating:'4.2'},
    { image: IMAGES.User13, title:'Stevani Anderson', rating:'4.7'},
];

const listBlog = [
    { image: IMAGES.User17, title:'Samuel Hawkins', subtitle:'Cold & Flue'},
    { image: IMAGES.User18, title:'Debora Saragih', subtitle:'Dental Care'},
    { image: IMAGES.User19, title:'Richard Kean', subtitle:'Physical Problem'},
    { image: IMAGES.User20, title:'Kevin Ash', subtitle:'Dental Care'},
];

const appointmentBlog = [
	{day:'Wednesday', date:'October 18'},
	{day:'Tuesday', date:'October 24'},
	{day:'Saturday', date:'October 28'},
	{day:'Monday', date:'October 30'},
];

const DoctorDetails = () => {
    const [startDate, setStartDate] = useState(new Date());
    return (
        <>
            <div className="form-head d-flex page-titles mb-sm-4 mb-3 align-items-center">
                <div className="me-auto">
                    <h2 className="text-black font-w600">Doctor Details</h2>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item active"><Link to={"#"}>Doctor</Link></li>
                        <li className="breadcrumb-item"><Link to={"#"}>#P-0616</Link></li>
                    </ol>
                </div>
                <Link to={"/app-profile"} className="btn btn-outline-primary">Update Profile</Link>
            </div>
            <div className="row">
				<div className="col-xl-9 col-xxl-12">
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="card doctor-details-card">
                                <div className="bg-img-bx">
                                    <img src={IMAGES.Bannerbg2} alt="" className="bg-img" />
                                    <Link to={"/doctor"} className="btn btn-primary"><i className="las la-stethoscope me-3 scale5"></i>Dentist Specialist</Link>
                                </div>
                                <div className="card-body">
                                    <div className="d-sm-flex d-block mb-3">
                                        <div className="img-card mb-sm-0 mb-3">	
                                            <img src={IMAGES.profile3png} alt="" /> 
                                        </div>
                                        <div className="card-info d-flex align-items-start">
                                            <div className="me-auto pe-3">
                                                <h2 className="font-w600 mb-sm-2 mb-1 text-black">Dr. David James Lee</h2>
                                                <p className="mb-sm-2 mb-1">#P-00016</p>
                                                <span className="date">
                                                <i className="las la-clock"></i>
                                                Join on 28 October 2023, 12:45 AM</span>
                                            </div>
                                            <span className="mr-ico bg-primary">
                                                <i className="fa-solid fa-mars"></i>
                                            </span>
                                        </div>
                                    </div>
                                    <h4 className="fs-20 text-black font-w600">Biography</h4>
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                                    </p>
                                    <p>
                                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-12">
                            <div className="card">
                                <div className="card-header border-0 pb-0">
                                    <div>
                                        <h4 className="fs-20 text-black mb-1">Doctor Ability</h4>
                                        <span className="fs-12">Lorem ipsum dolor sit amet, consectetur</span>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="row align-items-center">
                                        <div className="col-lg-5 mb-lg-0 mb-3">
                                            {statisticBlog.map((item, ind)=>(
                                                <div className="d-flex mb-3 align-items-center" key={ind}>                                                    
                                                    <span className="fs-12 col-6 p-0 text-black">
                                                        <svg className="me-2" width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <rect width="19" height="19" fill={item.color}/>
                                                        </svg>{" "}
                                                        {item.title}
                                                    </span>
                                                    <div className="progress rounded-0 col-6 p-0">
                                                        <div className="progress-bar rounded-0 progress-animated" 
                                                            style={{width: item.progress, height:"6px", background:item.color}} 
                                                        >
                                                            <span className="sr-only">{item.progress} Complete</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}                                            
                                        </div>
                                        <div className="col-lg-7">
                                            <div className="row align-items-center">
                                                <div className="col-lg-6 col-sm-6 mb-sm-0 mb-3">
                                                    <div id="pieChart" className='d-flex justify-content-center'>
                                                        <PatientPieChart />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 col-sm-6">
                                                    <div id="pieChart2" className='d-flex justify-content-center'>
                                                        <AbilityPieChart />
                                                    </div>
                                                    <div className="d-flex align-items-center justify-content-sm-start justify-content-center">
                                                        <svg className="me-3" width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <rect width="3.54545" height="26" rx="1.77273" transform="matrix(-1 0 0 1 24.8184 0)" fill="#757575"/>
                                                            <rect width="3.54545" height="18.9091" rx="1.77273" transform="matrix(-1 0 0 1 17.7275 7.09091)" fill="#757575"/>
                                                            <rect width="3.54545" height="8.27273" rx="1.77273" transform="matrix(-1 0 0 1 10.6367 17.7273)" fill="#757575"/>
                                                            <rect width="4" height="16" rx="2" transform="matrix(-1 0 0 1 4 10)" fill="#757575"/>
                                                        </svg>
                                                        <div>
                                                            <p className="fs-12 mb-1">Total Statistic</p>
                                                            <span className="fs-22 text-black font-w600">452,551k</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-12">
                            <div className="card recent-review">
                                <div className="card-header border-0 pb-0">
                                    <h4 className="fs-20 text-black mb-1">Recent Review</h4>
                                </div>
                                <div className="card-body">
                                    {reviewBlog.map((item, ind)=>(
                                        <div className="media p-3 border border-bottom-0" key={ind}>
                                            <img src={item.image} alt="" className="me-sm-4 me-3" />
                                            <div className="media-body row align-items-center">
                                                <div className="col-md-8 mb-md-0 mb-3">
                                                    <h4><Link to={"/reviews"} className="text-black fs-20">{item.title}</Link></h4>
                                                    { ind === 0 ?
                                                        <p className="fs-14">Hospital & staff were extremely warm & quick in getting me start with the procedures</p>
                                                        : 
                                                        ind === 1 ?
                                                            <p className="fs-14">When I came with my mother, I was very nervous. But after entering here I felt warmed with smiling</p>
                                                            :
                                                            <p className="fs-14">Thanks for all the services, no doubt it is the best hospital. My kidney, BP, diabetes problem</p>
                                                        }
                                                    <Link to={"#"} className="btn btn-xxs btn-outline-primary me-2">EXCELENT</Link>{" "}
                                                    <Link to={"#"} className="btn btn-xxs btn-outline-primary">GREAT SERVICE</Link>
                                                </div>
                                                <div className="col-md-4 text-md-center">
                                                    <h3 className="fs-24 text-primary font-w600 mb-md-2 mb-0">{item.rating}</h3>
                                                    <ul className="stars justify-content-md-center">
                                                        <li><i className="las la-star"></i></li>
                                                        <li><i className="las la-star"></i></li>
                                                        <li><i className="las la-star"></i></li>
                                                        <li><i className="las la-star"></i></li>
                                                        <li><i className="las la-star text-dark"></i></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    
                                </div>
                            </div>
                        </div>
                    </div>  
                </div>
                <div className="col-xl-3 col-xxl-12">
                    <div className="row">
                        <div className="col-xl-12 col-xxl-8">
                             <div className="card appointment-schedule">
                                <div className="card-header border-0 pb-0">
                                    <h4 className="fs-20 text-black mb-1">Appointment</h4>
                                </div>
                                <div className="card-body pt-2">
                                    <div className="row">
                                        <div className="appointment-calender  dz-calender col-xl-12 col-xxl-6 col-md-6 col-sm-7 mb-md-4 mb-0">                                            
                                            <DatePicker selected={startDate} className="form-control" 
                                                onChange={(date) => setStartDate(date)}
                                                dateFormat="MM-dd-yyyy"
                                                inline
                                            />  
                                        </div>
                                        <div className="height380 col-xl-12 col-xxl-6 col-md-6 col-sm-5 dz-scroll" id="appointmentSchedule">
                                            {appointmentBlog.map((item, index)=>(
                                                <div className="d-flex pb-3 border-bottom mb-3 align-items-end" key={index}>
                                                    <div className="me-auto">
                                                        <p className="text-black font-w600 mb-2">{item.day}, {item.date}</p>
                                                        <ul>
                                                            <li><i className="las la-clock"></i>09:00 - 10:30 AM</li>
                                                            <li><i className="las la-user"></i>Dr. Samantha</li>
                                                        </ul>
                                                    </div>
                                                    <Link to={"#"} className="text-success me-3 mb-2">
														<i className="las la-check-circle scale5" />
													</Link>
													<Link to={"#"} className="text-danger mb-2">
														<i className="las la-times-circle scale5" />
													</Link>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-12 col-xxl-4">
                            <div className="card patient-list">
                                <div className="card-header border-0 pb-0">
                                    <h4 className="fs-20 text-black mb-0">Patient List</h4>
                                    <Dropdown className="dropdown">
                                        <Dropdown.Toggle className="btn-link i-false c-pointer" as="div">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11Z" stroke="#2E2E2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                                <path d="M12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18Z" stroke="#2E2E2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                                <path d="M12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4Z" stroke="#2E2E2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                            </svg>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="dropdown-menu-end" align="end">
                                            <Dropdown.Item>Accept Patient</Dropdown.Item>
                                            <Dropdown.Item>Reject Order</Dropdown.Item>
                                            <Dropdown.Item>View Details</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                                <div className="card-body">
                                    {listBlog.map((item, ind)=>(
                                        <div className="d-flex mb-4" key={ind}>
                                            <img src={item.image} alt="" className="me-3" />
                                            <div>
                                                <h5 className="mb-1"><Link to={"/patient"} className="fs-18 text-black">{item.title}</Link></h5>
                                                <span className="fs-14 text-primary font-w600">{item.subtitle}</span>
                                            </div>
                                        </div>
                                    ))}                                    
                                </div>
                                <div className="card-footer pt-0 border-0">
                                    <Link to={"/patient"} className="btn d-block btn-outline-primary">+ Assign New Patient</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DoctorDetails;