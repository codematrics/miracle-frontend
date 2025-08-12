import React, { useState, useRef, useEffect } from 'react';
import { Button, ButtonGroup, Dropdown, Modal, Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Select from "react-select";
import headerLogo from './../../../../assets/images/header_prescription_small.jpg';
import "../../../casesheet.css";
import DummyData from '../DummyData.jsx';


function StatusCompleted() {
    return (
        <span className="badge badge-outline-primary">
            <i className="fa fa-circle text-primary me-1" />
            Completed
        </span>
    )
}

function StatusHold() {
    return (
        <span className="badge badge-outline-danger">
            <i className="fa fa-circle text-danger me-1" />
            Hold
        </span>
    )
}

function StatusProgress() {
    return (
        <span className="badge badge-info light">
            <i className="fa fa-circle text-info me-1" />
            Consulting
        </span>
    )
}

function StatusPending() {
    return (
        <span className="badge badge-warning light">
            <i className="fa fa-circle text-warning me-1"></i>
            Pending
        </span>
    )
}

const tableData = [
    { patientid: '1', pname: 'KANWARLAL KUMAWAT', assigned: 'Dr. Kailash Garg', disease: 'Sleep Problem', status: <StatusCompleted />, room: 'AB-004' },
    { patientid: '2', pname: 'Bella Simatupang', assigned: 'Dr. Manohar Menariya', disease: 'Hair Loss', status: <StatusProgress />, room: 'AB-005' },
    { patientid: '3', pname: 'Enjeline Sari', assigned: 'Dr. Vishal Khutwal', disease: 'Diabetes', status: <StatusPending />, room: 'AB-008' },
    { patientid: '4', pname: 'David Bekam', assigned: 'Dr. Madhu Jain', disease: 'Alcoholism', status: <StatusPending />, room: 'AB-002' },
    { patientid: '5', pname: 'KANWARLAL KUMAWAT', assigned: 'Dr. Kailash Garg', disease: 'Cold & Flu', status: <StatusCompleted />, room: 'AB-007' },
    { patientid: '6', pname: 'Bella Simatupang', assigned: 'Dr. Manohar Menariya', disease: 'Dental Care', status: <StatusProgress />, room: 'AB-008' },
    { patientid: '7', pname: 'Enjeline Sari', assigned: 'Dr. Vishal Khutwal', disease: 'Allergies & Asthma', status: <StatusPending />, room: 'AB-009' },
    { patientid: '8', pname: 'David Bekam', assigned: 'Dr. Madhu Jain', disease: 'Alcoholism', status: <StatusHold />, room: 'AB-001' },
    { patientid: '9', pname: 'Bella Simatupang', assigned: 'Dr. Manohar Menariya', disease: 'Hair Loss', status: <StatusProgress />, room: 'AB-005' },
    { patientid: '10', pname: 'Enjeline Sari', assigned: 'Dr. Vishal Khutwal', disease: 'Diabetes', status: <StatusPending />, room: 'AB-008' },
    { patientid: '11', pname: 'David Bekam', assigned: 'Dr. Madhu Jain', disease: 'Alcoholism', status: <StatusPending />, room: 'AB-002' },
    { patientid: '12', pname: 'Cive Slauw', assigned: 'Dr. Kailash Garg', disease: 'Cold & Flu', status: <StatusCompleted />, room: 'AB-007' },
];


const Patient = () => {
    const [openAddPatientModel, setOpenAddPatientModal] = useState();
    const [visitModal, setVisitModal] = useState(false);
    const [dateFilterModal, setDateFilterModal] = useState(false);

    const [data, setData] = useState(
        document.querySelectorAll("#patient_list tbody tr")
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
    // use effect
    useEffect(() => {
        setData(document.querySelectorAll("#patient_list tbody tr"));
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

    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);

    const handleAddService = (aSelectedOption) => {
        if (aSelectedOption && !selectedServices.some(service => service.id === aSelectedOption.id)) {
            setSelectedServices([...selectedServices, aSelectedOption]);
        }
        setSelectedOption(null); // Clear the selected option
    };

    const handleRemoveService = (serviceToRemove) => {
        setSelectedServices(selectedServices.filter(service => service.id !== serviceToRemove.id));
    };

    const [caseSheetData, setCaseSheetData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [prescriptionModal, setPrescriptionModal] = useState(false);

    const fetchPrescriptionData = async (patientId) => {
        try {
            setLoading(true);
            //const response = await axios.get(`/api/prescriptions/${patientId}`);
            //   setPrescriptionData(response.data);
            console.log('patient ID:', patientId);
            setCaseSheetData(DummyData.caseSheetData);
            setPrescriptionModal(true);

        } catch (err) {
            setError('Failed to fetch prescription data');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const openCaseSheet = (patientId) => {
        const url = `/casesheet/${patientId}`;
        window.open(url, '_blank');
    };

    const navigate = useNavigate();
    const showPatientDetail = (patientId) => {
        console.log('patient ID:', patientId);
        navigate(`/patient-details/${patientId}`);
    };

    return (
        <>
            <div className="form-head align-items-center d-flex mb-sm-4 mb-3">
                <div className="me-auto">
                    <h2 className="text-black font-w600">Visits</h2>
                </div>
                <div>
                    <ButtonGroup>
                        <Dropdown>
                            <Dropdown.Toggle className="me-2" variant="primary" size='sm'>
                                <i className="fa fa-plus color-info" /> Add
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item to="#" onClick={() => setOpenAddPatientModal(true)}> New Patient</Dropdown.Item>
                                <Dropdown.Item to="#" onClick={() => setVisitModal(true)}>Add Visit</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </ButtonGroup>

                    <Button className="me-2" variant="primary btn-sm" onClick={() => setDateFilterModal(true)}>
                        <i className="las la-calendar-plus scale5 me-2" /> Filter Date
                    </Button>
                </div>
            </div>

            <div className="row">
                <div className="col-xl-12">
                    <div className="table-responsive card-table">
                        <div
                            id="patient_list"
                            className="dataTables_wrapper no-footer"
                        >
                            <table id="example5" className="table table-striped no-footer display table-responsive-xl dataTable text-black" >
                                <thead>
                                    <tr>
                                        <th>Sr No</th>
                                        <th>Patient ID</th>
                                        <th>Date Check In</th>
                                        <th>Patient Name</th>
                                        <th>Doctor Assgined</th>
                                        <th>Cabin No</th>
                                        <th>Status</th>
                                        <th className="text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData.map((item, ind) => (
                                        <tr key={ind}>
                                            <td>{ind + 1}</td>
                                            <td>
                                                <span
                                                    onClick={() => showPatientDetail(item.patientid)}
                                                    style={{
                                                        cursor: 'pointer',
                                                        color: '#007bff',
                                                    }}
                                                    role="button"
                                                    tabIndex={0}
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter') {
                                                            showPatientDetail(item.patientid)
                                                        }
                                                    }}
                                                >
                                                    {`MH000${14 + ind}`}
                                                </span>
                                            </td>
                                            <td>0{ind + 1}/12/2024, 12:42 AM</td>
                                            <td>{item.pname}</td>
                                            <td>{item.assigned}</td>
                                            <td>{item.room}</td>
                                            <td>
                                                {item.status}
                                            </td>
                                            <td>
                                                <Dropdown className="ms-auto c-pointer text-end">
                                                    <Dropdown.Toggle className="btn-link i-false" as="div">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11Z" stroke="#2E2E2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18Z" stroke="#2E2E2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4Z" stroke="#2E2E2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu className="dropdown-menu-end" align="end">
                                                        <Dropdown.Item>Accept Patient</Dropdown.Item>
                                                        <Dropdown.Item disabled={loading} onClick={() => fetchPrescriptionData(item.patientid)}>
                                                            {loading ? 'Loading...' : 'Priscription'}
                                                        </Dropdown.Item>
                                                        <Dropdown.Item disabled={loading} onClick={() => openCaseSheet(item.patientid)}>
                                                            {loading ? 'Loading...' : 'Casesheet'}
                                                        </Dropdown.Item>
                                                        <Dropdown.Item disabled={loading} onClick={() => showPatientDetail(item.patientid)}> View Details</Dropdown.Item>
                                                    </Dropdown.Menu>
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

                            {/* <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="text-black font-w500">Date Check In</label>
                                        <input type="date" className="form-control" />
                                    </div>
                                </div>
                            </div> */}
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger btn-sm light" onClick={() => setOpenAddPatientModal(false)}>Close</button>
                        <button type="button" className="btn btn-sm btn-primary">Save changes</button>
                    </div>
                </div>
            </Modal>

            {/* <!-- Visit Modal --> */}
            <Modal className="fade" show={visitModal} onHide={setVisitModal} centered={true} size={'xl'} backdropClassName={'role'} backdrop={'static'}>
                <Modal.Header>
                    <Modal.Title>Add New Visit</Modal.Title>
                    <Button
                        variant=""
                        className="btn-close"
                        onClick={() => setVisitModal(false)}
                    >

                    </Button>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group">
                                <label className="text-black font-w500">Search Patient <span className="text-danger">*</span></label>
                                <Select
                                    isClearable
                                    // components={{ NoOptionsMessage }}
                                    // styles={{ NoOptionsMessage: base => ({ ...base, ...msgStyles }) }}
                                    className="plugins-select-feild"
                                    isSearchable
                                    name="searchPatient"
                                    id="searchPatient"
                                    value={searchPatientValue}
                                    options={DummyData.patientList}
                                    onChange={handleSearchPatient}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-2 form-group">
                            <label className="text-black">UHID No </label>
                            <input
                                type="text"
                                readOnly
                                className="form-control form-control-sm text-black"
                                value={selectedPatient ? selectedPatient.UHID : ""}
                            />
                        </div>
                        <div className="col-md-3 form-group">
                            <label className="text-black">Patient Name </label>
                            <input
                                type="text"
                                readOnly
                                className="form-control form-control-sm text-black"
                                value={selectedPatient ? selectedPatient.label : ""}
                            />
                        </div>
                        <div className="col-md-3 form-group">
                            <label className="text-black">Father/Husband</label>
                            <input
                                type="text"
                                readOnly
                                className="form-control form-control-sm text-black"
                                value={selectedPatient ? selectedPatient.fathername : ""}
                            />
                        </div>
                        <div className="col-md-2 form-group">
                            <label className="text-black">Mobile No </label>
                            <input
                                type="text"
                                readOnly
                                className="form-control form-control-sm text-black"
                                value={selectedPatient ? selectedPatient.mobileno : ""}
                            />
                        </div>
                        <div className="col-md-2 form-group">
                            <label className="text-black">Sex/Age</label>
                            <input
                                type="text"
                                readOnly
                                className="form-control form-control-sm text-black"
                                value={selectedPatient ? `${selectedPatient.gender}/${selectedPatient.age}` : ""}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-3">
                            <div className="form-group">
                                <label className="text-black font-w500">Ref By <span className="text-danger">*</span></label>
                                <select id="refby" name="refby" className="form-control text-black" style={{ height: '40px' }}>
                                    <option value="">Select Ref By</option>
                                    <option value="1">Self</option>
                                    <option value="2">Dr. Kailash Garg</option>
                                    <option value="3">Dr. Manohar Menariya</option>
                                    <option value="4">Dr. Vishal Khutwal</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label className="text-black font-w500">Visiting Doctor <span className="text-danger">*</span></label>
                                <select id="visitingdoctor" name="visitingdoctor" className="form-control text-black" style={{ height: '40px' }}>
                                    <option value="">Select Doctor</option>
                                    <option value="1">Dr. Kailash Garg</option>
                                    <option value="2">Dr. Manohar Menariya</option>
                                    <option value="3">Dr. Vishal Khutwal</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="form-group">
                                <label className="text-black font-w500">Visit Type <span className="text-danger">*</span></label>
                                <select id="visittype" name="visittype" className="form-control text-black" style={{ height: '40px' }}>
                                    <option value="">Select Visit Type</option>
                                    <option value="1">OPD</option>
                                    <option value="2">IPD</option>
                                    <option value="3">Camp</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label className="text-black">Visit Description</label>
                                <input type="text" name="visitdetail" id='visitdetail' className="form-control text-black" style={{ height: '40px' }} />
                            </div>
                        </div>

                    </div>
                    <div className="row">
                        <div className="col-md-3">
                            <div className="form-group">
                                <label className="text-black">Medico Legal(MLC) <span className="text-danger">*</span></label>
                                <div className="form-control" style={{ height: '40px' }}>
                                    <div className="form-check custom-checkbox form-check-inline text-black">
                                        <input type="radio" className="form-check-input" id="medicolegal_y" name="medicolegal" />
                                        <label className="form-check-label" htmlFor="medicolegal_y">Yes</label>
                                    </div>
                                    <div className="form-check custom-checkbox form-check-inline text-black">
                                        <input type="radio" className="form-check-input" id="medicolegal_n" name="medicolegal" checked={true} />
                                        <label className="form-check-label" htmlFor="medicolegal_n">No</label>
                                    </div>
                                </div>
                            </div>


                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label className="text-black font-w500">Mediclaim <span className="text-danger">*</span></label>
                                <select id="mediclaim_type" name="mediclaim_type" className="form-control text-black" style={{ height: '40px' }}>
                                    <option value="1">Not Applicable</option>
                                    <option value="2">Ayushman</option>
                                    <option value="3">Healthcare</option>
                                    <option value="4">National Insurance</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label className="text-black font-w500">Mediclaim ID / Policy No <span className="text-danger">*</span></label>
                                <input type="text" name="mediclaim_id" id='mediclaim_id' className="form-control text-black" style={{ height: '40px' }} />
                            </div>
                        </div>


                    </div>

                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group">
                                <label className="text-black font-w500">Search Service <span className="text-danger">*</span></label>
                                <Select
                                    isClearable
                                    // components={{ NoOptionsMessage }}
                                    // styles={{ NoOptionsMessage: base => ({ ...base, ...msgStyles }) }}
                                    className="plugins-select-feild"
                                    isSearchable
                                    name="searchservices"
                                    options={DummyData.servicesList}
                                    value={selectedOption}
                                    onChange={handleAddService}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="selected-services">
                        <Table>
                            <thead>
                                <tr>
                                    <th>Service Code</th>
                                    <th>Service Name</th>
                                    <th>Price</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedServices.map((service, index) => (
                                    <tr key={index}>
                                        <td>{service.code}</td>
                                        <td>{service.label}</td>
                                        <td>{service.rate}</td>
                                        <td>{<button onClick={() => handleRemoveService(service)} className="delete-icon">
                                            <i className="fa fa-trash" />
                                        </button>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                    </div>
                    {/* <div className="row">
                        <div className="col-md-4">
                            <div className="form-group">
                                <label className="text-black font-w500">Date Check In</label>
                                <input type="date" className="form-control" />
                            </div>
                        </div>
                    </div> */}

                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={() => setVisitModal(false)}
                        variant="dark btn-sm"
                    >
                        Close
                    </Button>
                    <Button variant="primary btn-sm">Save changes</Button>
                </Modal.Footer>
            </Modal>

            {/* <!-- Prescription  Modal --> */}
            <Modal className="fade" show={prescriptionModal} onHide={setPrescriptionModal} centered={true} size={'xl'} backdropClassName={'role'} backdrop={'static'} >
                <Modal.Header>
                    <Modal.Title>Prescription</Modal.Title>
                    <Button
                        variant=""
                        className="btn-close"
                        onClick={() => setPrescriptionModal(false)}
                    >

                    </Button>
                </Modal.Header>
                <Modal.Body>
                    {error && <div className="alert alert-danger">{error}</div>}

                    <div className="prescription-container text-black" id="printable-prescription">
                        {/* Hospital Header */}
                        <div className="hospital-header">
                            <img
                                src={headerLogo}
                                alt="Hospital Logo"
                                style={{ maxWidth: '100%', height: 'auto' }}
                            />
                        </div>
                        {/* Patient Visit Data */}
                        <div className="text-black">
                            <div className="row">
                                <div className="col-md-12">
                                    <table className="table table-bordered text-black table-responsive-sm patient-info" style={{ lineHeight: '0.4' }}>
                                        <tbody>
                                            <tr>
                                                <td><strong>UHID</strong></td>
                                                <td colSpan={2}>{caseSheetData?.UHID}</td>
                                                <td><strong>Visit No</strong></td>
                                                <td>{caseSheetData?.visitNo}</td>
                                                <td><strong>Date</strong></td>
                                                <td>{caseSheetData?.visitDate}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Patient Name</strong></td>
                                                <td colSpan={2}>{caseSheetData?.patientName} {caseSheetData?.relation} {caseSheetData?.fathername}</td>
                                                <td><strong>Age / Gender</strong></td>
                                                <td>{caseSheetData?.age} / {caseSheetData?.gender}</td>
                                                <td><strong>Mobile</strong></td>
                                                <td>{caseSheetData?.mobileno}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Doctor Name</strong></td>
                                                <td colSpan={2}><strong>{caseSheetData?.doctorName} ({caseSheetData?.specialization})</strong></td>
                                                <td><strong>Reg No.</strong></td>
                                                <td>{caseSheetData?.licenseNumber}</td>
                                                <td><strong>Referred</strong></td>
                                                <td colSpan={2}>{caseSheetData?.referredBy}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Address</strong></td>
                                                <td colSpan={6}>{caseSheetData?.patientAddress}</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                </div>
                            </div>
                            <hr className='custom-hr' />
                        </div>

                        {/* Prescription Details */}
                        <div className="prescription-details text-black">
                            <div className='row'>
                                <div className='col-md-4'>
                                    <div className='row'>
                                        <div className='col-md-12' style={{ height: '100px' }}>
                                            <h4 className="text-black">C/O</h4>
                                        </div>
                                        <div className='col-md-12' style={{ height: '250px' }}>
                                            <h4 className="text-black">Vitals</h4>
                                            <span style={{ paddingBottom: '8px' }}>Temp</span><br></br>
                                            <span style={{ paddingBottom: '8px' }}>SpO2</span><br></br>
                                            <span style={{ paddingBottom: '8px' }}>Height</span><br></br>
                                            <span style={{ paddingBottom: '8px' }}>Weight</span><br></br>
                                            <span style={{ paddingBottom: '8px' }}>BP</span><br></br>
                                            <span style={{ paddingBottom: '8px' }}>R/R</span><br></br>

                                        </div>

                                        <div className='col-md-12' style={{ height: '100px' }}>
                                            <h4 className="text-black">Past History</h4>
                                        </div>
                                        <div className='col-md-12' style={{ height: '100px' }}>
                                            <h4 className="text-black">Advice / Investigations</h4>
                                        </div>

                                    </div>
                                </div>

                                <div className='col-md-8'>
                                    <div className='row'>
                                        <div className='col-md-12'>
                                            <h4 className="text-black">Diagnosis</h4>
                                            <h6 className="text-black m-2">Provisional -</h6>
                                            <h6 className="text-black m-2">Final -</h6>
                                            <h6 className="text-black m-2">Additional -</h6>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-md-12'>
                                            <h1 className="text-black">Rx,</h1>
                                            <table className="medication-table text-black">
                                                <thead>
                                                    <tr>
                                                        <th>Type</th>
                                                        <th>Medicine</th>
                                                        <th>Route</th>
                                                        <th>Frequency</th>
                                                        <th>Duration</th>
                                                        <th>Remark</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {caseSheetData?.medications?.map((med, index) => (
                                                        <tr key={index}>
                                                            <td>{med.medType}</td>
                                                            <td>{med.medName} {med.dosage}</td>
                                                            <td>{med.route}</td>
                                                            <td>{med.frequency}</td>
                                                            <td>{med.duration}</td>
                                                            <td>{med.remark}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>

                        {/* Additional Notes */}
                        <div className="additional-notes text-black">
                            <h5>Notes</h5>
                            <p>{caseSheetData?.notes}</p>
                        </div>

                        {/* Doctor's Signature */}
                        {/* <div className="signature text-black">
                            <span className='doctor-name'><strong>{caseSheetData?.doctorName}</strong></span><br />
                            <span className='doctor-degree'>{caseSheetData?.specialization}</span><br />
                            <span className='doctor-regno'>{caseSheetData?.licenseNumber}</span>
                        </div> */}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={() => setPrescriptionModal(false)}
                        variant="dark btn-sm"
                    >
                        Close
                    </Button>
                    <Button variant="primary btn-sm" >
                        Print
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    );
};

export default Patient;