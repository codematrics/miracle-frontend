import React, { useState, useRef, useEffect } from 'react';
import { Button, ButtonGroup, Dropdown, Modal, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Select from "react-select";


function PatientBtn() {
    return (
        <span className="badge badge-outline-primary">
            <i className="fa fa-circle text-primary me-1" />
            New Patient
        </span>
    )
}

function Recovery() {
    return (
        <span className="badge badge-info light">
            <i className="fa fa-circle text-info me-1" />
            Recovered
        </span>
    )
}

function Treatment() {
    return (
        <span className="badge badge-warning light">
            <i className="fa fa-circle text-warning me-1"></i>
            In Treatment
        </span>
    )
}
const tableData = [
    { patientid: '1', pname: 'KANWARLAL KUMAWAT', assigned: 'Dr. Kailash Garg', disease: 'Sleep Problem', status: <PatientBtn />, room: 'AB-004' },
    { patientid: '2', pname: 'Bella Simatupang', assigned: 'Dr. Manohar Menariya', disease: 'Hair Loss', status: <Recovery />, room: 'AB-005' },
    { patientid: '3', pname: 'Enjeline Sari', assigned: 'Dr. Vishal Khutwal', disease: 'Diabetes', status: <Treatment />, room: 'AB-008' },
    { patientid: '4', pname: 'David Bekam', assigned: 'Dr. Madhu Jain', disease: 'Alcoholism', status: <Treatment />, room: 'AB-002' },
    { patientid: '5', pname: 'KANWARLAL KUMAWAT', assigned: 'Dr. Kailash Garg', disease: 'Cold & Flu', status: <PatientBtn />, room: 'AB-007' },
    { patientid: '6', pname: 'Bella Simatupang', assigned: 'Dr. Manohar Menariya', disease: 'Dental Care', status: <Recovery />, room: 'AB-008' },
    { patientid: '7', pname: 'Enjeline Sari', assigned: 'Dr. Vishal Khutwal', disease: 'Allergies & Asthma', status: <Treatment />, room: 'AB-009' },
    { patientid: '8', pname: 'David Bekam', assigned: 'Dr. Madhu Jain', disease: 'Alcoholism', status: <Treatment />, room: 'AB-001' },
    { patientid: '9', pname: 'Bella Simatupang', assigned: 'Dr. Manohar Menariya', disease: 'Hair Loss', status: <Recovery />, room: 'AB-005' },
    { patientid: '10', pname: 'Enjeline Sari', assigned: 'Dr. Vishal Khutwal', disease: 'Diabetes', status: <Treatment />, room: 'AB-008' },
    { patientid: '11', pname: 'David Bekam', assigned: 'Dr. Madhu Jain', disease: 'Alcoholism', status: <Treatment />, room: 'AB-002' },
    { patientid: '12', pname: 'Cive Slauw', assigned: 'Dr. Kailash Garg', disease: 'Cold & Flu', status: <PatientBtn />, room: 'AB-007' },
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

    const patientList = [
        { id: "1", label: "Bhagwati Lal Patidar", fathername: "Bheru Lal Patidar", UHID: "MH1000202502101", mobileno: "9770014840", age: "35 Yr", gender: "M" },
        { id: "2", label: "Ram Singh", fathername: "Dev Singh Rathore", UHID: "MH1000202502102", mobileno: "9770014840", age: "46 Yr", gender: "M" },
        { id: "3", label: "Demo Test", fathername: "Testing", UHID: "MH1000202502103", mobileno: "9770014840", age: "20 Yr", gender: "M" },
    ];

    const servicesList = [
        { id: "1", code: "CON001", label: "Consultation Fees", rate: 200 },
        { id: "2", code: "CON002", label: "Revisit Fees", rate: 100 },
        { id: "3", code: "CON003", label: "Follow Fees", rate: 0 },
    ];

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

    const [prescriptionData, setPrescriptionData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [prescriptionModal, setPrescriptionModal] = useState(false);

    const prescriptionPatient = {
        id: "1", patientName: "Bhagwati Lal Patidar",
        fathername: "Bheru Lal Patidar",
        UHID: "MH1000202502101",
        mobileno: "9770014840",
        age: "35 Yr",
        gender: "M",
        visitNo: "OPD-001",
        visitDate: "10-04-2025 09:57:47",
        patientAddress: "511 A/B, RALAYTA, MANDSAUR, MADHYA PRADESH",
        doctorName: "Dr. Kailash Garg",
        licenseNumber: "MH123456",
        specialization: "MBBS, MD",
        department: "Cardiology",
        doctorSignature: "signature.png",
        notes: "Take medicines after meals.",
        medications: [
            { medType: "Cap", medName: "Aspirin", route: "Oral", dosage: "100mg", frequency: "Once a day", duration: "10 days", remark: "" },
            { medType: "Tab", medName: "Dolo", route: "Oral", dosage: "650mg", frequency: "Twice a day", duration: "SOS", remark: "TDS" },
            { medType: "Tab", medName: "Ibuprofen", route: "Oral", dosage: "200mg", frequency: "Thrice a day", duration: "7 days", remark: "" },
            { medType: "Tab", medName: "Amoxicillin", route: "Oral", dosage: "500mg", frequency: "Twice a day", duration: "5 days", remark: "after meals" },
            { medType: "Tab", medName: "Cetirizine", route: "Oral", dosage: "10mg", frequency: "Once a day", duration: "7 days", remark: "" },
            { medType: "Cap", medName: "Omeprazole", route: "Oral", dosage: "20mg", frequency: "Once a day", duration: "14 days", remark: "" },
            { medType: "Syp", medName: "Lactulose", route: "Oral", dosage: "15ml", frequency: "Once a day", duration: "As needed", remark: "" },
            { medType: "Inj", medName: "Paracetamol", route: "IV", dosage: "500mg", frequency: "Once", duration: "As needed", remark: "" },
            { medType: "Inj", medName: "Vitamin C", route: "IV", dosage: "1000mg", frequency: "Once", duration: "As needed", remark: "" },
            { medType: "Inj", medName: "Dexamethasone", route: "IV", dosage: "4mg", frequency: "Once", duration: "As needed", remark: "" }
        ],
    };

    const fetchPrescriptionData = async (patientId) => {
        try {
            setLoading(true);
            //const response = await axios.get(`/api/prescriptions/${patientId}`);
            //   setPrescriptionData(response.data);
            // setPrescriptionData(prescriptionPatient);
            const caseSheetData = prescriptionPatient;
            const prescriptionHtmlContent = `
            <html>
            <head>
                <title>Case Sheet</title>
                <style>
                    @media print {
                        body * {
                        visibility: hidden;
                        color: #000;
                        background: #fff;
                        }
                        #printable-prescription, #printable-prescription * {
                        visibility: visible;
                        }
                        #printable-prescription {
                        left: 0;
                        top: 0;
                        width: 100%;
                        padding: 10px;
                        }
                        
                    }
                    .doctor-name{
                        font-size: 18px;
                        font-weight: 900;
                        font-family: Arial, sans-serif;
                    }
                    .doctor-degree{
                        font-size: 14px;
                        font-weight: 600;
                        font-family: Arial, sans-serif;
                    }
                    .doctor-regno{
                        font-size: 14px;
                        font-weight: 400;
                        font-family: Arial, sans-serif;
                    }
                    .custom-hr {
                        width: 100%;
                        margin: 0px 10px 10px 0px;
                        padding: 0;
                        border: none;
                        border-top: 3px solid black;
                        color: #000;
                        background-color: #fff;
                    }
                    .prescription-container {
                        padding: 10px;
                        font-family: Arial, sans-serif;
                        color: #000;
                    }
                    .hospital-header {
                        text-align: center;
                        margin-bottom: 5px;
                    }
                    .patient-vital{
                        padding: 5px 0px 15px 0px;
                        font-size: 16px;
                    }
                    .doctor-info {
                        margin-bottom: 5px;
                    }
                    .patient-info {
                        margin-bottom: 5px;
                        font-size: 16px;
                    }
                    
                    .medication-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 5px;
                        font-size: 12px;
                    }
                    .medication-table th,
                    .medication-table td {
                        padding: 1px;
                        text-align: left;
                    }
                    .signature {
                        margin-top: 70px;
                        text-align: right;
                    }
                </style>
                <body>
                    <div className="prescription-container text-black" id="printable-prescription">
                        {/* Hospital Header */}
                        <div className="hospital-header">
                            <img
                                src=${headerLogo}
                                alt="Hospital Logo"
                                style={{ maxWidth: '100%', height: 'auto' }}
                            />
                        </div>
                        {/* Patient Visit Data */}
                        <div className="text-black">
                            <div className="row">
                                <div className="col-md-3">
                                    <div className='row patient-vital'>
                                        <div className='col-md-6'>Temp</div>
                                        <div className='col-md-6'>SpO2</div>
                                    </div>
                                    <div className='row patient-vital'>
                                        <div className='col-md-6'>Height</div>
                                        <div className='col-md-6'>Weight</div>
                                    </div>
                                    <div className='row patient-vital'>
                                        <div className='col-md-6'>BP</div>
                                        <div className='col-md-6'>R/R</div>
                                    </div>
                                </div>
                                <div className="col-md-9">

                                    <table className="table table-bordered text-black table-responsive-sm patient-info">
                                        <tbody>
                                            <tr>
                                                <td><strong>UHID</strong></td>
                                                <td>${caseSheetData?.UHID}</td>
                                                <td><strong>Visit No</strong></td>
                                                <td>${caseSheetData?.visitNo}</td>
                                                <td><strong>Date</strong></td>
                                                <td>${caseSheetData?.visitDate}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Patient Name</strong></td>
                                                <td colSpan={3}>${caseSheetData?.patientName}</td>
                                                <td><strong>Age / Gender</strong></td>
                                                <td>${caseSheetData?.age} / ${caseSheetData?.gender}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Address</strong></td>
                                                <td colSpan={3}>${caseSheetData?.patientAddress}</td>
                                                <td><strong>Mobile</strong></td>
                                                <td>${caseSheetData?.mobileno}</td>
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
                                        <div className='col-md-12' style={{ height: '200px' }}>
                                            <h4 className="text-black">C/O</h4>
                                        </div>
                                        <div className='col-md-12' style={{ height: '200px' }}>
                                            <h4 className="text-black">Past History</h4>
                                        </div>
                                        <div className='col-md-12' style={{ height: '200px' }}>
                                            <h4 className="text-black">Advice / Investigations</h4>
                                        </div>

                                    </div>
                                </div>

                                <div className='col-md-8'>
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
                                        ${caseSheetData?.medications?.map((med, index) =>  (`
                                                <tr key=${index}>
                                                    <td>${med.medType}</td>
                                                    <td>${med.medName} ${med.dosage}</td>
                                                    <td>${med.route}</td>
                                                    <td>${med.frequency}</td>
                                                    <td>${med.duration}</td>
                                                    <td>${med.remark}</td>
                                                </tr>`
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>

                        {/* Additional Notes */}
                        <div className="additional-notes text-black">
                            <h5>Notes</h5>
                            <p>${caseSheetData?.notes}</p>
                        </div>

                        {/* Doctor's Signature */}
                        <div className="signature text-black">
                            <span className='doctor-name'><strong>${caseSheetData?.doctorName}</strong></span><br />
                            <span className='doctor-degree'>${caseSheetData?.specialization}</span><br />
                            <span className='doctor-regno'>${caseSheetData?.licenseNumber}</span>
                        </div>
                    </div>
                     <script>
                        window.onload = function() {
                            window.print();
                        };
                    </script>
                </body>
            </html>
            `;

            const newWindow = window.open('', '_blank');
            newWindow.document.open();
            newWindow.document.write(prescriptionHtmlContent);
            newWindow.document.close();
                                            
        } catch (err) {
            setError('Failed to fetch prescription data');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };



    const PrescriptionContent = () => (
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
                    <div className="col-md-3">
                        <div className='row patient-vital'>
                            <div className='col-md-6'>Temp</div>
                            <div className='col-md-6'>SpO2</div>
                        </div>
                        <div className='row patient-vital'>
                            <div className='col-md-6'>Height</div>
                            <div className='col-md-6'>Weight</div>
                        </div>
                        <div className='row patient-vital'>
                            <div className='col-md-6'>BP</div>
                            <div className='col-md-6'>R/R</div>
                        </div>
                    </div>
                    <div className="col-md-9">

                        <table className="table table-bordered text-black table-responsive-sm patient-info">
                            <tbody>
                                <tr>
                                    <td><strong>UHID</strong></td>
                                    <td>{prescriptionData?.UHID}</td>
                                    <td><strong>Visit No</strong></td>
                                    <td>{prescriptionData?.visitNo}</td>
                                    <td><strong>Date</strong></td>
                                    <td>{prescriptionData?.visitDate}</td>
                                </tr>
                                <tr>
                                    <td><strong>Patient Name</strong></td>
                                    <td colSpan={3}>{prescriptionData?.patientName}</td>
                                    <td><strong>Age / Gender</strong></td>
                                    <td>{prescriptionData?.age} / {prescriptionData?.gender}</td>
                                </tr>
                                <tr>
                                    <td><strong>Address</strong></td>
                                    <td colSpan={3}>{prescriptionData?.patientAddress}</td>
                                    <td><strong>Mobile</strong></td>
                                    <td>{prescriptionData?.mobileno}</td>
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
                            <div className='col-md-12' style={{ height: '200px' }}>
                                <h4 className="text-black">C/O</h4>
                            </div>
                            <div className='col-md-12' style={{ height: '200px' }}>
                                <h4 className="text-black">Past History</h4>
                            </div>
                            <div className='col-md-12' style={{ height: '200px' }}>
                                <h4 className="text-black">Advice / Investigations</h4>
                            </div>

                        </div>
                    </div>

                    <div className='col-md-8'>
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
                                {prescriptionData?.medications?.map((med, index) => (
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

            {/* Additional Notes */}
            <div className="additional-notes text-black">
                <h5>Notes</h5>
                <p>{prescriptionData?.notes}</p>
            </div>

            {/* Doctor's Signature */}
            <div className="signature text-black">
                <span className='doctor-name'><strong>{prescriptionData?.doctorName}</strong></span><br />
                <span className='doctor-degree'>{prescriptionData?.specialization}</span><br />
                <span className='doctor-regno'>{prescriptionData?.licenseNumber}</span>
            </div>
        </div>
    );


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
                                            <td>{`MH000${14 + ind}`}</td>
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
                                                        <Dropdown.Item disabled={loading} onClick={() => fetchPrescriptionData(item.patientid)}> {loading ? 'Loading...' : 'Print Prescription'} </Dropdown.Item>
                                                        <Dropdown.Item>View Details</Dropdown.Item>
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
                                <input type="date" id='fromdate' name='fromdate' className="form-control text-black" />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="text-black font-w500">To Date</label>
                                <input type="date" id='todate' name='todate' className="form-control text-black" />
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
                                        <label className="text-black">Patient Name</label>
                                        <input type="text" className="form-control text-black" style={{ height: '40px' }} />
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className="form-group">
                                        <label className="text-black">Relation</label>
                                        <select className="form-control text-black" style={{ height: '40px' }}>
                                            <option value="">Select Relation</option>
                                            <option value="1">S/O</option>
                                            <option value="2">W/O</option>
                                            <option value="3">D/O</option>
                                            <option value="4">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label className="text-black">F/H Name</label>
                                        <input type="text" className="form-control text-black" style={{ height: '40px' }} />
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label className="text-black">Age</label>
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
                                        <label className="text-black">Gender</label>
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
                                        <input type="text" name="occupation" id='occupation' className="form-control text-black" style={{ height: '40px' }} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-2">
                                    <div className="form-group">
                                        <label className="text-black">Mobile No</label>
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
                                        <label className="text-black">ID Type</label>
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
                                        <label className="text-black">ID No</label>
                                        <input type="text" name="idno" id='idno' className="form-control text-black" style={{ height: '40px' }} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-2">
                                    <div className="form-group">
                                        <label className="text-black">Mediclaim</label>
                                        <div className="form-control" style={{ height: '40px' }}>
                                            <div className="form-check custom-checkbox mb-3 check-xs">
                                                <input type="checkbox" className="form-check-input" id="mediclaim" name="mediclaim" required /> <span >Yes/No</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label className="text-black">Mediclaim No</label>
                                        <input type="text" name="mediclaimno" id='mediclaimno' className="form-control text-black" style={{ height: '40px' }} />
                                    </div>
                                </div>
                                <div className="col-md-5">
                                    <div className="form-group">
                                        <label className="text-black">Village/Colony</label>
                                        <input type="text" name="village" id='village' className="form-control text-black" style={{ height: '40px' }} />
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className="form-group">
                                        <label className="text-black">Patient Type</label>
                                        <select id="patienttype" name="patienttype" className="form-control text-black" style={{ height: '40px' }}>
                                            <option value="1">General</option>
                                            <option value="2">VIP</option>
                                            <option value="3">Staff</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label className="text-black">State</label>
                                        <select id="state" name="state" className="form-control text-black" style={{ height: '40px' }}>
                                            <option value="1">Madhya Pradesh</option>
                                            <option value="2">Rajasthan</option>
                                            <option value="3">Gujarat</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className="form-group">
                                        <label className="text-black">District</label>
                                        <select id="district" name="district" className="form-control text-black" style={{ height: '40px' }}>
                                            <option value="1">Mandsaur</option>
                                            <option value="2">Ratlam</option>
                                            <option value="3">Neemuch</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className="form-group">
                                        <label className="text-black">Tehsil</label>
                                        <select id="tehsil" name="tehsil" className="form-control text-black" style={{ height: '40px' }}>
                                            <option value="1">Mandsaur</option>
                                            <option value="2">Malhargarh</option>
                                            <option value="3">Garoth</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label className="text-black">Post</label>
                                        <select id="postoffice" name="postoffice" className="form-control text-black" style={{ height: '40px' }}>
                                            <option value="1">Mandsaur</option>
                                            <option value="2">Malhargarh</option>
                                            <option value="3">Garoth</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className="form-group">
                                        <label className="text-black">Pincode</label>
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
                                <label className="text-black font-w500">Search Patient</label>
                                <Select
                                    isClearable
                                    // components={{ NoOptionsMessage }}
                                    // styles={{ NoOptionsMessage: base => ({ ...base, ...msgStyles }) }}
                                    className="plugins-select-feild"
                                    isSearchable
                                    name="searchPatient"
                                    id="searchPatient"
                                    value={searchPatientValue}
                                    options={patientList}
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
                                <label className="text-black font-w500">Ref By</label>
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
                                <label className="text-black font-w500">Visiting Doctor</label>
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
                                <label className="text-black font-w500">Visit Type</label>
                                <select id="visittype" name="visittype" className="form-control text-black" style={{ height: '40px' }}>
                                    <option value="">Select Visit Type</option>
                                    <option value="1">OPD</option>
                                    <option value="2">IPD</option>
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
                                <label className="text-black">Medico Legal(MLC)</label>
                                <div className="form-control" style={{ height: '40px' }}>
                                    <div className="form-check custom-checkbox form-check-inline text-black">
                                        <input type="radio" className="form-check-input" id="medicolegal_y" name="medicolegal" />
                                        <label className="form-check-label" htmlFor="medicolegal_y">Yes</label>
                                    </div>
                                    <div className="form-check custom-checkbox form-check-inline text-black">
                                        <input type="radio" className="form-check-input" id="medicolegal_n" name="medicolegal" />
                                        <label className="form-check-label" htmlFor="medicolegal_n">No</label>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group">
                                <label className="text-black font-w500">Search Service</label>
                                <Select
                                    isClearable
                                    // components={{ NoOptionsMessage }}
                                    // styles={{ NoOptionsMessage: base => ({ ...base, ...msgStyles }) }}
                                    className="plugins-select-feild"
                                    isSearchable
                                    name="searchservices"
                                    options={servicesList}
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
                    {prescriptionData && <PrescriptionContent />}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={() => setPrescriptionModal(false)}
                        variant="dark btn-sm"
                    >
                        Close
                    </Button>
                    <Button variant="primary" onClick={handlePrint}>
                        Print
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Print Styles */}
            <style>
                {`
          
        `}
            </style>

        </>
    );
};

export default Patient;