import React, { useState, useContext, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

import LogoutPage from './Logout';

import profile from './../../../assets/images/profile/17.jpg';


const Header = ({ onNote }) => {
	const [headerFix, setheaderFix] = useState(false);
	useEffect(() => {
		window.addEventListener("scroll", () => {
			setheaderFix(window.scrollY > 50);
		});
	}, []);

	return (
		<div className={`header ${headerFix ? "is-fixed" : ""}`}>
			<div className="header-content">
				<nav className="navbar navbar-expand">
					<div className="collapse navbar-collapse justify-content-between">
						<div className="header-left">
							<div className="dashboard_bar">
								<div className="input-group search-area d-lg-inline-flex d-none">
									<input type="text" className="form-control" placeholder="Search here..." />
									<div className="input-group-append">
										<span className="input-group-text">
											<Link to={"#"}><i className="flaticon-381-search-2" /></Link>
										</span>
									</div>
								</div>
							</div>
							{/* <ul className="navbar-nav">
						<Dropdown as="li" className="nav-item">
							<Dropdown.Toggle as="div" className="nav-link">
								Reception
							</Dropdown.Toggle>
							<Dropdown.Menu>
								<Link to="/opd-bill" className="nav-link">
									OPD Bill
								</Link>
							</Dropdown.Menu>
						</Dropdown>

						<Dropdown as="li" className="nav-item">
							<Dropdown.Toggle as="li" className="nav-link">
								Lab
							</Dropdown.Toggle>
							<Dropdown.Menu>
								<Link to="/opd-bill" className="nav-link">
									OPD Bill
								</Link>
							</Dropdown.Menu>
						</Dropdown>
					</ul> */}

						</div>

						<ul className="header-right navbar-nav ">

							<Dropdown as="li" className="nav-item header-profile">
								<Dropdown.Toggle className="nav-link i-false p-0" as="div">
									<img src={profile} alt="" width="20" />
								</Dropdown.Toggle>
								<Dropdown.Menu align="end">
									<Link to={"/app-profile"} className="dropdown-item ai-icon ">
										<svg id="icon-user1" xmlns="http://www.w3.org/2000/svg" className="text-primary" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
										</svg>
										<span className="ms-2">Profile </span>
									</Link>
									{/* <Link to={"/email-inbox"} className="dropdown-item ai-icon ">
										<svg id="icon-inbox" xmlns="http://www.w3.org/2000/svg" className="text-success" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>
										</svg>
										<span className="ms-2">Inbox </span>
									</Link>																 */}
									<LogoutPage />
								</Dropdown.Menu>
							</Dropdown>

						</ul>

					</div>
				</nav>
			</div>
		</div>
	);
};

export default Header;
