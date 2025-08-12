import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import {Tab, Nav, Dropdown} from 'react-bootstrap';
import DatePicker from "react-datepicker";

//element
import { IMAGES, SVGICON } from '../../../constant/theme';
import PatientTab from '../Element/PatientTab';
import RecoveredChart from '../Element/RecoveredChart';
import VisitorsChart from '../Element/VisitorsChart';
import RevenuChart from '../Element/RevenuChart';
import CardWidget from '../Element/CardWidget';


//Import Components
const cardBlog = [
	{svg: SVGICON.calander, number:'76', subtitle:'Appointment', progress:'50%' },
	{svg: SVGICON.heart, number:'124,551', subtitle:'Total Patient', progress:'80%' },
	{svg: SVGICON.stetho, number:'442', subtitle:'Total Doctor', progress:'38%' },
	{svg: SVGICON.money, number:'₹5,034', subtitle:'Hospital Earning', progress:'70%' },
];

const doctorList = [
	{ image: IMAGES.User11, title:'Dr. Samantha Queque',  review:'315', subtitle:'Cardiologists'},
	{ image: IMAGES.User12, title:'Dr. Samuel Jr.',  review:'221', subtitle:'Audiologists'},
	{ image: IMAGES.User13, title:'Dr. Jennifer Ruby',  review:'181', subtitle:'Dentists'},
	{ image: IMAGES.User14, title:'Dr. Abdul Aziz Lazis',  review:'315', subtitle:'Gynecologists'},
	{ image: IMAGES.User15, title:'Dr. Alex Siauw',  review:'176', subtitle:'Pediatricians'},
	// { image: IMAGES.User11, title:'Dr. Abdul Aziz Lazis',  review:'315', subtitle:'Psychiatrists'},
];

const activityTable = [
	{ image: IMAGES.User16, title:'Roby Romeo' , year:'41' ,subtitle:'Allergies & Asthma', status:'Recovered'},
	{ image: IMAGES.User17, title:'Angela Nurhayati' , year:'38' ,subtitle:'Sleep Problem', status:'New Patient'},
	{ image: IMAGES.User18, title:'James Robinson' , year:'35' ,subtitle:'Dental Care', status:'In Treatment'},
	{ image: IMAGES.User19, title:'Thomas Jaja' , year:'40' ,subtitle:'Diabetes', status:'New Patient'},
	{ image: IMAGES.User20, title:'Cindy Brownle' , year:'39' ,subtitle:'Covid-19 Suspect', status:'In Treatment'},
	{ image: IMAGES.User21, title:'Oconner Jr.' , year:'33' ,subtitle:'Dental Care', status:'Recovered'},
	{ image:IMAGES.User15, title:'Angela Nurhayati' , year:'37' ,subtitle:'Sleep Problem', status:'New Patient'},
	{ image:IMAGES.User16, title:'James Robinson' , year:'39' ,subtitle:'Dental Care', status:'In Treatment'},
	{ image:IMAGES.User17, title:'Thomas Jaja' , year:'45' ,subtitle:'Diabetes', status:'New Patient'},
];



const Home = () => {	
	const [startDate, setStartDate] = useState(new Date());
	const [ selectYear, setSelectYear] = useState(2025);
	return(
		<>
			<div className="form-head d-flex align-items-center mb-sm-4 mb-3">
				<div className="me-auto">
					<h2 className="text-black font-w600">Dashboard</h2>
					<p className="mb-0">Miracle Hospital Admin Dashboard</p>
				</div>
				{/* <Link to={"#"} className="btn btn-outline-primary"><i className="las la-cog scale5 me-3"></i>Customize Layout</Link> */}
			</div>
			<div className="row">
				{cardBlog.map((item, index)=>(
					<div className="col-xl-3 col-sm-6" key={index}>						
						<CardWidget number={item.number} subtitle={item.subtitle} svg={item.svg} progress={item.progress} />
					</div>
				))}				
			</div>
			{/* <div className="row">
				<div className="col-xl-6">
					<div className="row">
						<div className="col-xl-12">	
							<div className="card">
								<Tab.Container defaultActiveKey="Daily">
									<div className="card-header d-sm-flex d-block pb-0 border-0">
										<div className="me-auto pe-3">
											<h4 className="text-black fs-20 mb-0">Patient Percentage</h4>
										</div>
										<div className="card-action card-tabs mt-3 mt-sm-0 mt-3 mb-sm-0 mb-3 mt-sm-0">
											<Nav as="ul" className="nav nav-tabs">
												<Nav.Item>
													<Nav.Link  eventKey="Daily">Daily</Nav.Link>
												</Nav.Item>
												<Nav.Item>
													<Nav.Link  eventKey="Weekly">Weekly</Nav.Link>
												</Nav.Item>
												<Nav.Item>
													<Nav.Link  eventKey="Monthly">Monthly</Nav.Link>
												</Nav.Item>
											</Nav>
										</div>
									</div>
									<div className="card-body">
										<Tab.Content>
											<Tab.Pane eventKey="Daily">
												<PatientTab totalpatient="356,730"  patient="45% " recovered="60%" treatment="58%"/>
											</Tab.Pane>
											<Tab.Pane eventKey="Weekly">
												<PatientTab totalpatient="562,084"  patient="64% " recovered="71%" treatment="75%" />
											</Tab.Pane>
											<Tab.Pane eventKey="Monthly">
												<PatientTab totalpatient="786,360"  patient="78% " recovered="83%" treatment="90%" />
											</Tab.Pane>
										</Tab.Content>
									</div>
								</Tab.Container>
							</div>
						</div>
						<div className="col-xl-6 col-xxl-12 col-md-6">
							<div className="card">
								<div className="card-header d-block border-0 pb-0">
									<div className="d-flex mb-3">
										<h3 className="fs-20 text-black mb-0">Patient Overview</h3>
										<Dropdown className="ms-auto c-pointer">
											<Dropdown.Toggle className="btn-link i-false" as="div">
												{SVGICON.dropsvg}
											</Dropdown.Toggle>
											<Dropdown.Menu className="dropdown-menu-end" align="end">
												<Dropdown.Item className="text-black">Info</Dropdown.Item>
												<Dropdown.Item className="text-black">Details</Dropdown.Item>
											</Dropdown.Menu>
										</Dropdown>
									</div>
									<div className="d-flex">
										<div className="d-flex me-auto align-items-center">
											<svg width="12" height="54" viewBox="0 0 12 54" fill="none" xmlns="http://www.w3.org/2000/svg">
												<rect width="12" height="54" fill="#BDA25C"/>
											</svg>
											<div className="ms-2">
												<p className="mb-1">New</p>
												<span className="text-black font-w500">451</span>
											</div>
										</div>
										<div className="d-flex align-items-center">
											<svg width="12" height="54" viewBox="0 0 12 54" fill="none" xmlns="http://www.w3.org/2000/svg">
												<rect width="12" height="54" fill="#209F84"/>
											</svg>
											<div className="ms-2">
												<p className="mb-1">Recovered</p>
												<span className="text-black font-w500">623</span>
											</div>
										</div>
									</div>
								</div>
								<div className="card-body p-0">
									<div id="chartTimeline">
										<RecoveredChart />
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-6 col-xxl-12 col-md-6">
							<div className="card">
								<div className="card-header border-0 pb-0">
									<h3 className="fs-20 text-black mb-0">Visitors</h3>
									<Dropdown className="ms-auto c-pointer">
										<Dropdown.Toggle className="btn-link i-false" as="div">
											{SVGICON.dropsvg}
										</Dropdown.Toggle>
										<Dropdown.Menu className="dropdown-menu-end" align="end">
											<Dropdown.Item className="text-black">Info</Dropdown.Item>
											<Dropdown.Item className="text-black">Details</Dropdown.Item>
										</Dropdown.Menu>
									</Dropdown>
								</div>
								<div className="card-body pb-0">
									<ul className="users-sm mb-3">
										<li><img src={IMAGES.User6} alt="" /></li>
										<li><img src={IMAGES.User7} alt="" /></li>
										<li><img src={IMAGES.User8} alt="" /></li>
										<li><img src={IMAGES.User9} alt="" /></li>
										<li><img src={IMAGES.User10} alt="" /></li>
									</ul>
									<div className="d-flex align-items-center">
										<svg className="me-3" width="30" height="19" viewBox="0 0 30 19" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path fillRule="evenodd" clipRule="evenodd" d="M28.8124 0.990788C29.6459 1.71558 29.734 2.97884 29.0092 3.81236L20.2578 13.8765C18.859 15.4851 16.4444 15.7141 14.7681 14.397L10.6176 11.1359L3.37074 17.9564C2.56639 18.7134 1.30064 18.6751 0.543606 17.8707C-0.213427 17.0664 -0.175071 15.8006 0.629276 15.0436L7.8761 8.22306C9.317 6.86692 11.5329 6.76809 13.0888 7.99059L17.2394 11.2517L25.9908 1.18764C26.7156 0.354128 27.9788 0.265993 28.8124 0.990788Z" fill="#007A64"/>
										</svg>
										<div>
											<p className="fs-12 mb-0">Customer</p>
											<span className="fs-22 text-black font-w600">765 Person</span>
										</div>
									</div>
									<div id="lineChart">
										<VisitorsChart />
									</div>
								</div>
							</div>
							
						</div>
						<div className="col-xl-12">
							<div className="card rated-doctors">
								<div className="card-header border-0 pb-0">
									<h3 className="fs-20 text-black mb-0 me-auto">Top Rated Doctors</h3>
									<Link to={"#"} className="btn-link text-primary">More {`>>`}</Link>
								</div>
								<div className="card-body">
									{doctorList.map((item, ind)=>(
										<div className="d-sm-flex pb-sm-4 pb-3 border-bottom mb-sm-4 mb-3 align-items-center" key={ind}>
											<div className="d-flex align-items-center me-auto ps-2">
												<span className="num me-sm-4 me-3">#{`${ind+1}`}</span>
												<img src={item.image} className="img-1 me-sm-4 me-3" alt="" />
												<div>
													<h4 className="mb-sm-2 mb-1"><Link to={"/doctor"} className="text-black">{item.title}</Link></h4>
													<span className="fs-14 text-primary font-w600">{item.subtitle}</span>
												</div>
											</div>
											<div className="text-sm-end mt-sm-0 mt-3 star-review">
												<ul>
													<li><i className="fa fa-star" /></li>
													<li><i className="fa fa-star" /></li>
													<li><i className="fa fa-star" /></li>
													<li><i className="fa fa-star" /></li>
													<li><i className="fa fa-star" /></li>
												</ul>
												<span className="fs-14 text-black">{item.review} reviews</span>
											</div>
										</div>
									))}
									<div className="d-sm-flex pb-0 align-items-center" >
										<div className="d-flex align-items-center me-auto ps-2">
											<span className="num me-sm-4 me-3">#6</span>
											<img src={IMAGES.User11} className="img-1 me-sm-4 me-3" alt="" />
											<div>
												<h4 className="mb-sm-2 mb-1"><Link to={"/doctor"} className="text-black">Dr. Abdul Aziz Lazis</Link></h4>
												<span className="fs-14 text-primary font-w600">Psychiatrists</span>
											</div>
										</div>
										<div className="text-sm-end mt-sm-0 mt-3 star-review">
											<ul>
												<li><i className="fa fa-star" /></li>
												<li><i className="fa fa-star" /></li>
												<li><i className="fa fa-star" /></li>
												<li><i className="fa fa-star" /></li>
												<li><i className="fa fa-star" /></li>
											</ul>
											<span className="fs-14 text-black">315 reviews</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="col-xl-6">
					<div className="row">
						<div className="col-xl-12">	
							<div className="card appointment-schedule">
								<div className="card-header pb-0 border-0">
									<h3 className="fs-20 text-black mb-0">Appointment Schedule</h3>
									<Dropdown className="ms-auto c-pointer">
										<Dropdown.Toggle className="btn-link p-2 bg-light i-false" as="div">
											<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="#2E2E2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
												<path d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z" stroke="#2E2E2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
												<path d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z" stroke="#2E2E2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
											</svg>
										</Dropdown.Toggle>
										<Dropdown.Menu className="dropdown-menu-end" align="end">
											<Dropdown.Item className="text-black">Info</Dropdown.Item>
											<Dropdown.Item className="text-black">Details</Dropdown.Item>
										</Dropdown.Menu>
									</Dropdown>									
								</div>
								<div className="card-body">
									<div className="row">
										<div className="col-xl-6 col-xxl-12 col-md-6">
											<div className="appointment-calender dz-calender style-1">												
												<DatePicker selected={startDate} className="form-control" 
													onChange={(date) => setStartDate(date)}
													dateFormat="MM-dd-yyyy"
													inline
												/>
											</div>
										</div>
										<div className="col-xl-6 col-xxl-12  col-md-6 height415 dz-scroll" id="appointment-schedule">
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
						<div className="col-xl-12">
							<div className="card">
								<div className="card-header border-0 pb-0">
									<h3 className="fs-20 text-black mb-0 me-2">Revenue Summary</h3>
									<Dropdown className="dropdown mt-sm-0 mt-3">
										<Dropdown.Toggle type="button" as="div" className="btn bg-light text-primary">
											{selectYear}
										</Dropdown.Toggle>
										<Dropdown.Menu className="dropdown-menu-end" align="end">
											<Dropdown.Item onClick={()=>setSelectYear('2021')}>2021</Dropdown.Item>
											<Dropdown.Item onClick={()=>setSelectYear('2022')}>2022</Dropdown.Item>
											<Dropdown.Item onClick={()=>setSelectYear('2023')}>2023</Dropdown.Item>
										</Dropdown.Menu>
									</Dropdown>
								</div>
								<div className="card-body pt-0">
									<div id="chartBar">
										<RevenuChart />
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-12">
							<div className="card patient-activity">
								<div className="card-header border-0 pb-0">
									<h3 className="fs-20 text-black mb-0">Recent Patient Activity</h3>
									<div className="dropdown ms-auto c-pointer">
										<Dropdown className="ms-auto c-pointer">
											<Dropdown.Toggle className="btn-link i-false" as="div">
												{SVGICON.dropsvg}
											</Dropdown.Toggle>
											<Dropdown.Menu className="dropdown-menu-end" align="end">
												<Dropdown.Item className="text-black">Info</Dropdown.Item>
												<Dropdown.Item className="text-black">Details</Dropdown.Item>
											</Dropdown.Menu>
										</Dropdown>										
									</div>
								</div>
								<div className="card-body pb-0" >
									<div className="table-responsive height720 dz-scroll" id="patient-activity">
										<table className="table table-responsive-sm">
											<tbody>
												{activityTable.map((item, ind)=>(
													<tr key={ind}>
														<td>
															<div className="d-flex">
																<img src={item.image} alt="" className="img-2 me-3" />
																<div>
																	<h6 className="fs-16 mb-1"><Link to={"/patient"} className="text-black">{item.title}</Link></h6>
																	<span className="fs-14">{item.year} Years Old</span>
																</div>
															</div>
														</td>
														<td>
															<div>
																<p className="fs-14 mb-1">Disease</p>
																<span className="text-primary font-w600 mb-auto">{item.subtitle}</span>
															</div>
														</td>
														<td>
															<div>
																<p className="fs-14 mb-1">Status</p>
																<span className={`font-w600 mb-2 d-block text-nowrap ${item.change}`}>{item.status}</span>
																<p className="mb-0 fs-12">{ind+1}/11/2023 12:34 AM</p>
															</div>
														</td>
													</tr>
												))}
											</tbody>	
										</table>
									</div>
								</div>	
								<div className="card-footer text-center border-0">
									<Link to={"/patient"} className="btn-link text-primary">See More {`>>`}</Link>
								</div>
							</div>		
						</div>
					</div>
				</div>
			</div> */}
		</>
	)
}
export default Home;