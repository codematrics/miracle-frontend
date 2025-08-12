import React, { useState, useRef, useEffect } from 'react';
import { Button, ButtonGroup, Dropdown, Modal, Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Select from "react-select";
import headerLogo from './../../../../assets/images/header_prescription_small.jpg';
import "./workflow.css";
import DummyData from '../DummyData.jsx';



const tableData = [
    { id: '1', patientid: '1', orderdate: '01-05-2025 09:11 AM', accessionno: '0250502044', invoiceno: 'OB2025050012', UHID: "MH202502101", pname: 'Bhagwati Lal', relation: "S/O", fathername: "Bheru Lal Patidar", age: "35 Yr", gender: "M", consultant: 'Dr. Kailash Garg', referred: 'Dr Bhagwati Lal', visitId: 11, visitNo: "OPD-121", reportname: "BIOCHEMISTRY", servicenames: "BLOOD SUGAR RANDOM, SGOT, SGPT, CRP QUANTITATIVE", status: 5 },
    { id: '2', patientid: '1', orderdate: '01-05-2025 09:11 AM', accessionno: '0250502044', invoiceno: 'OB2025050012', UHID: "MH202502101", pname: 'Bhagwati Lal', relation: "S/O", fathername: "Bheru Lal Patidar", age: "35 Yr", gender: "M", consultant: 'Dr. Kailash Garg', referred: 'Dr Bhagwati Lal', visitId: 11, visitNo: "OPD-121", reportname: "CLINICAL PATHOLOGY", servicenames: "URINE ROUTINE", status: 3 },
    { id: '3', patientid: '1', orderdate: '01-05-2025 09:11 AM', accessionno: '0250502044', invoiceno: 'OB2025050012', UHID: "MH202502101", pname: 'Bhagwati Lal', relation: "S/O", fathername: "Bheru Lal Patidar", age: "35 Yr", gender: "M", consultant: 'Dr. Kailash Garg', referred: 'Dr Bhagwati Lal', visitId: 11, visitNo: "OPD-121", reportname: "HAEMATOLOGY REPORT", servicenames: "ESR, CBC (COMPLETE BLOOD COUNT)", status: 1 },
    { id: '4', patientid: '2', orderdate: '01-05-2025 10:18 AM', accessionno: '0250502045', invoiceno: 'OB2025050013', UHID: "MH202502221", pname: 'AKASH', relation: "S/O", fathername: "NARENDRA KUMAR", age: "45 Yr", gender: "M", consultant: 'Dr. Kailash Garg', referred: 'Dr SELF', visitId: 1251, visitNo: "OPD-125", reportname: "SEROLOGY", servicenames: "HBsAg Card Test(Austrial Antigen, HCV, HIV - 1 & 2", status: 2 },
    { id: '5', patientid: '2', orderdate: '01-05-2025 10:18 AM', accessionno: '0250502045', invoiceno: 'OB2025050013', UHID: "MH202502221", pname: 'AKASH', relation: "S/O", fathername: "NARENDRA KUMAR", age: "45 Yr", gender: "M", consultant: 'Dr. Kailash Garg', referred: 'Dr SELF', visitId: 1251, visitNo: "OPD-125", reportname: "HAEMATOLOGY REPORT", servicenames: "ESR, CBC (COMPLETE BLOOD COUNT)", status: 4 },
    { id: '6', patientid: '2', orderdate: '01-05-2025 10:18 AM', accessionno: '0250502045', invoiceno: 'OB2025050013', UHID: "MH202502221", pname: 'AKASH', relation: "S/O", fathername: "NARENDRA KUMAR", age: "45 Yr", gender: "M", consultant: 'Dr. Kailash Garg', referred: 'Dr SELF', visitId: 1251, visitNo: "OPD-125", reportname: "BIOCHEMISTRY", servicenames: "LIVER FUNCTION TEST (LFT), RFT/KFT", status: 1 },

];


const WorkFlow = () => {
    const [openAddPatientModel, setOpenAddPatientModal] = useState();
    const [visitModal, setVisitModal] = useState(false);
    const [dateFilterModal, setDateFilterModal] = useState(false);

    const [data, setData] = useState(
        document.querySelectorAll("#workflow_list tbody tr")
    );
    const sort = 10;
    const activePag = useRef(0);
    const [test, settest] = useState(0);

    // Active data
    const chageData = (frist, sec) => {
        for (var i = 0; i < data.length; ++i) {
            if (i >= frist && i < sec) {
                data[i].classList.remove("d-none");
            } else {
                data[i].classList.add("d-none");
            }
        }
    };
    
    const getStatusClass = (status) => {
        switch (status) {
            case 1: return "table-background-pending";
            case 2: return "table-background-collected";
            case 3: return "table-background-accepted";
            case 4: return "bg-primary";
            case 5: return "table-background-verified";
            case 6: return "table-background-rejected";
            default: return "";
        }
    };

    // use effect
    useEffect(() => {
        setData(document.querySelectorAll("#workflow_list tbody tr"));
        if (visitModal) {
            setSelectedServices([]); // Clear selected services when modal loads
        }
    }, [test, visitModal]);


    activePag.current === 0 && chageData(0, sort);

    let paggination = Array(Math.ceil(data.length / sort))
        .fill()
        .map((_, i) => i + 1);

    const onClick = (i) => {
        activePag.current = i;
        chageData(activePag.current * sort, (activePag.current + 1) * sort);
        settest(i);
    };

    const [selectedPatient, setSelectedPatient] = useState([]);
    const [searchPatientValue, setSearchPatientValue] = useState(null);

    const handleSearchPatient = (cSelectedOption) => {
        if (cSelectedOption) {
            if (selectedPatient) {
                setSelectedPatient([]);
            }
            setSelectedPatient(cSelectedOption); // Store the selected patient object
            setSearchPatientValue(null); //

        }
    };

    const navigate = useNavigate();
    const showPatientDetail = (patientId) => {
        console.log('patient ID:', patientId);
        // navigate(`/patient-details/${patientId}`);
    };

    return (
        <>
            <div className="form-head align-items-center d-flex mb-sm-4 mb-3">
                <div className="me-auto">
                    <h2 className="text-black font-w600">Visits</h2>
                </div>
                <div>

                    <Button className="me-2" variant="primary btn-sm" onClick={() => setDateFilterModal(true)}>
                        <i className="las la-calendar-plus scale5 me-2" /> Filter Date
                    </Button>
                </div>
            </div>

            <div className="row">
                <div className="col-xl-12">
                    <div className="table-responsive card-table">
                        <div
                            id="workflow_list"
                            className="dataTables_wrapper no-footer"
                        >
                            <table id="example5" className="dataTable text-black" style={{ tableLayout: 'auto', width: '100%' }}>
                            <thead>
                                <tr>
                                    <th style={{ wordWrap: 'break-word', paddingRight: '15px' }}>Sr No</th>
                                    <th style={{ wordWrap: 'break-word' }}>Accession</th>
                                    <th style={{ wordWrap: 'break-word' }}>Order Date</th>
                                    <th style={{ wordWrap: 'break-word' }}>Report Name</th>
                                    <th style={{ wordWrap: 'break-word' }}>Service Name</th>
                                    <th style={{ wordWrap: 'break-word' }}>Cons.Dr / Ref.Dr.</th>
                                    <th style={{ wordWrap: 'break-word' }}>UHID</th>
                                    <th style={{ wordWrap: 'break-word' }}>Patient Name</th>
                                    <th style={{ wordWrap: 'break-word' }}>Age/Sex</th>
                                    <th style={{ wordWrap: 'break-word' }}>Visit No</th>
                                    <th style={{ wordWrap: 'break-word' }} className="text-end">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((item, ind) => (
                                    <tr
                                        key={ind}
                                        className={getStatusClass(item.status)}
                                    >
                                        <td>{ind + 1}</td>
                                        <td>
                                            <span
                                                onClick={() => showPatientDetail(item.patientid)}
                                                style={{ cursor: 'pointer', color: '#007bff' }}
                                                role="button"
                                                tabIndex={0}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        showPatientDetail(item.patientid);
                                                    }
                                                }}
                                            >
                                                {item.accessionno}
                                            </span>
                                        </td>
                                        <td>{item.orderdate}</td>
                                        <td>{item.reportname}</td>
                                        <td style={{ width: '20%', wordWrap: 'break-word' }}>{item.servicenames}</td>
                                        <td>{item.consultant} / {item.referred}</td>
                                        <td>{item.UHID}</td>
                                        <td>{item.pname} {item.relation} {item.fathername}</td>
                                        <td>{item.age} / {item.gender}</td>
                                        <td>{item.visitNo}</td>
                                        <td>
                                            <Dropdown className="ms-auto c-pointer text-end">
                                                {/* Add dropdown menu items here */}
                                            </Dropdown>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                            <div className="d-sm-flex text-center justify-content-between align-items-center">
                                <div
                                    className="dataTables_info"
                                    id="example5_info"
                                    role="status"
                                    aria-live="polite"
                                >
                                    Showing {activePag.current * sort + 1} to{" "}
                                    {data.length > (activePag.current + 1) * sort
                                        ? (activePag.current + 1) * sort
                                        : data.length}{" "}
                                    of {data.length} entries
                                </div>
                                <div className="dataTables_paginate paging_simple_numbers d-flex  justify-content-center align-items-center pb-3">
                                    <Link
                                        to="#"
                                        className="paginate_button previous disabled"
                                        aria-controls="example5"
                                        data-dt-idx={0}
                                        tabIndex={0}
                                        id="example5_previous"
                                        onClick={() =>
                                            activePag.current > 0 &&
                                            onClick(activePag.current - 1)
                                        }
                                    >
                                        Previous
                                    </Link>
                                    <span className="d-flex">
                                        {paggination.map((number, i) => (
                                            <Link
                                                key={i}
                                                to="#"
                                                className={`paginate_button d-flex align-items-center justify-content-center ${activePag.current === i ? "current" : ""
                                                    } ${i > 0 ? "ms-1" : ""}`}
                                                aria-controls="example5"
                                                data-dt-idx={1}
                                                                                                  tabIndex={0}
                                                onClick={() => onClick(i)}
                                            >
                                                {number}
                                            </Link>
                                        ))}
                                    </span>

                                    <Link
                                        to="#"
                                        className="paginate_button next disabled"
                                        aria-controls="example5"
                                        data-dt-idx={2}
                                        tabIndex={0}
                                        id="example5_next"
                                        onClick={() =>
                                            activePag.current + 1 < paggination.length &&
                                            onClick(activePag.current + 1)
                                        }
                                    >
                                        Next
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <!-- Date Filter Modal --> */}
            <Modal className="fade" show={dateFilterModal} onHide={setDateFilterModal} centered>
                <Modal.Header>
                    <Modal.Title>Date Filter</Modal.Title>
                    <Button
                        variant=""
                        className="btn-close"
                        onClick={() => setDateFilterModal(false)}
                    >

                    </Button>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="text-black font-w500">From Date</label>
                                <input type="date" id='fromdate' name='fromdate' className="form-control text-black" style={{ height: '35px' }} />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="text-black font-w500">To Date</label>
                                <input type="date" id='todate' name='todate' className="form-control text-black" style={{ height: '35px' }} />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="text-black font-w500">Mobile No</label>
                                <input type="number" id='mobileno' name='mobileno' className="form-control text-black" style={{ height: '35px' }} />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="text-black font-w500">Patient ID</label>
                                <input type="text" id='patientid' name='patientid' className="form-control text-black" style={{ height: '35px' }} />

                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group">
                                <label className="text-black font-w500">Patient Name</label>
                                <input type="text" id='patientname' name='patientname' className="form-control text-black" style={{ height: '35px' }} />
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={() => setDateFilterModal(false)}
                        variant="dark btn-sm"
                    >
                        Close
                    </Button>
                    <Button variant="primary btn-sm">Submit</Button>
                </Modal.Footer>
            </Modal>

            {/* <!-- Add New Patient Modal --> */}
            <Modal className="modal fade" id="addNewPatientModal" show={openAddPatientModel} onHide={setOpenAddPatientModal} centered={true} size={'xl'} backdropClassName={'role'} backdrop={'static'}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">New Patient </h5>
                        <button type="button" className="btn-close" onClick={() => setOpenAddPatientModal(false)}>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="text-black">Patient Name <span className="text-danger">*</span></label>
                                        <input type="text" className="form-control text-black" style={{ height: '40px' }} />
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className="form-group">
                                        <label className="text-black">Relation <span className="text-danger">*</span></label>
                                        <select className="form-control text-black" style={{ height: '40px' }}>
                                            <option value="1">S/O</option>
                                            <option value="2">W/O</option>
                                            <option value="3">D/O</option>
                                            <option value="4">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="text-black">F/H Name <span className="text-danger">*</span></label>
                                        <input type="text" className="form-control text-black" style={{ height: '40px' }} />
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className="form-group">
                                        <label className="text-black">Age <span className="text-danger">*</span></label>
                                        <div className="d-flex">
                                            <input type="number" className="form-control text-black" style={{ height: '40px', width: '40%' }} />
                                            <select className="form-control text-black" style={{ height: '40px', width: '60%' }}>
                                                <option value="1">Year</option>
                                                <option value="2">Month</option>
                                                <option value="3">Day</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="text-black">Gender <span className="text-danger">*</span></label>
                                        <div className="form-control" style={{ height: '40px' }}>
                                            <div className="form-check custom-checkbox form-check-inline text-black">
                                                <input type="radio" className="form-check-input" id="gendermale" name="gender" />
                                                <label className="form-check-label" htmlFor="gendermale">Male</label>
                                            </div>
                                            <div className="form-check custom-checkbox form-check-inline text-black">
                                                <input type="radio" className="form-check-input" id="genderfemale" name="gender" />
                                                <label className="form-check-label" htmlFor="genderfemale">Female</label>
                                            </div>
                                            <div className="form-check custom-checkbox form-check-inline text-black" >
                                                <input type="radio" className="form-check-input" id="genderother" name="gender" />
                                                <label className="form-check-label" htmlFor="genderother">Other</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className="form-group">
                                        <label className="text-black">Marital Status</label>
                                        <select name="marital_status" className="form-control text-black" style={{ height: '40px' }}>
                                            <option value="">Select Marital</option>
                                            <option value="Divorced">Divorced</option>
                                            <option value="Married">Married</option>
                                            <option value="Separated">Separated</option>
                                            <option value="Unmarried">Unmarried</option>
                                            <option value="Widowed">Widowed</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className="form-group">
                                        <label className="text-black">Religion</label>
                                        <select name="religion" className="form-control text-black" style={{ height: '40px' }}>
                                            <option value="Hindu">Hindu</option>
                                            <option value="Buddhist">Buddhist</option>
                                            <option value="Christian">Christian</option>
                                            <option value="Jain">Jain</option>
                                            <option value="Muslim">Muslim</option>
                                            <option value="Parsi">Parsi</option>
                                            <option value="Sikh">Sikh</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="text-black">Occupation</label>
                                        <select name="occupation" id='occupation' className="form-control text-black" style={{ height: '40px' }}>
                                            <option value="1">SELF EMPLOYED</option>
                                            <option value="2">GOVT. SERVICE</option>
                                            <option value="3">PVT. SERVICE</option>
                                            <option value="4">BUSINESS</option>
                                            <option value="5">HOUSE WORK</option>
                                            <option value="6">STUDY</option>
                                            <option value="7">UN-EMPLOYED</option>
                                            <option value="8">OTHER</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-2">
                                    <div className="form-group">
                                        <label className="text-black">Mobile No <span className="text-danger">*</span></label>
                                        <input type="text" name="mobileno" id='mobileno' className="form-control text-black" style={{ height: '40px' }} />
                                    </div>
                                </div>
                                <div className="col-md-5">
                                    <div className="form-group">
                                        <label className="text-black">Email Id</label>
                                        <input type="text" name="emailid" id='emailid' className="form-control text-black" style={{ height: '40px' }} />
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className="form-group">
                                        <label className="text-black">ID Type <span className="text-danger">*</span></label>
                                        <select id="idtype" name="idtype" className="form-control text-black" style={{ height: '40px' }}>
                                            <option value="1">Aadhar Card</option>
                                            <option value="2">Pancard</option>
                                            <option value="3">Driving license</option>
                                            <option value="4">Voter ID</option>
                                            <option value="5">Passport</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label className="text-black">ID No <span className="text-danger">*</span></label>
                                        <input type="text" name="idno" id='idno' className="form-control text-black" style={{ height: '40px' }} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label className="text-black">Patient Type</label>
                                        <select id="patienttype" name="patienttype" className="form-control text-black" style={{ height: '40px' }}>
                                            <option value="1">General</option>
                                            <option value="2">VIP</option>
                                            <option value="3">Staff</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="text-black">Village/Colony <span className="text-danger">*</span></label>
                                        <input type="text" name="village" id='village' className="form-control text-black" style={{ height: '40px' }} />
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label className="text-black">State <span className="text-danger">*</span></label>
                                        <select id="state" name="state" className="form-control text-black" style={{ height: '40px' }}>
                                            <option value="1">Madhya Pradesh</option>
                                            <option value="2">Rajasthan</option>
                                            <option value="3">Gujarat</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label className="text-black">District <span className="text-danger">*</span></label>
                                        <select id="district" name="district" className="form-control text-black" style={{ height: '40px' }}>
                                            <option value="1">Mandsaur</option>
                                            <option value="2">Ratlam</option>
                                            <option value="3">Neemuch</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label className="text-black">Tehsil <span className="text-danger">*</span></label>
                                        <input type="text" name="tehsil" id='tehsil' className="form-control text-black" style={{ height: '40px' }} />
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label className="text-black">Post <span className="text-danger">*</span></label>
                                        <input type="text" name="postoffice" id='postoffice' className="form-control text-black" style={{ height: '40px' }} />
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className="form-group">
                                        <label className="text-black">Pincode <span className="text-danger">*</span></label>
                                        <input type="text" name="pincode" id='pincode' className="form-control text-black" style={{ height: '40px' }} />
                                    </div>
                                </div>
                            </div>

                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger btn-sm light" onClick={() => setOpenAddPatientModal(false)}>Close</button>
                        <button type="button" className="btn btn-sm btn-primary">Save changes</button>
                    </div>
                </div>
            </Modal>

        </>
    );
};

export default WorkFlow;