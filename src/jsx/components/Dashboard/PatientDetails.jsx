import React from 'react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom'
import { Dropdown } from 'react-bootstrap';

import DummyData from './DummyData';

const PatientDetails = () => {
    const { patientId } = useParams();
    const [patientPreviousVisit, setPatientPreviousVisit] = useState(null);
    const [patientDetails, setPatientDetails] = useState(null);
    const [lastVisit, setLastVisit] = useState(null);

    const fetchPatientDetails = async () => {
        try {
            // const response = await axios.get(`https://api.example.com/patients/${patientId}`); // Replace with your API endpoint
            // setPatientDetails(response.data.patientDetail);
            // setPatientPreviousVisit(response.data.previousVisit);
            // setLastVisit(response.data.lastVisit);

        } catch (error) {
            console.error("Error fetching patient details:", error);
        }
    };

    const showVisitDetail = async (patientId, visitId) => {
        try {
            // const response = await axios.get(`https://api.example.com/patients/${patientId}`); // Replace with your API endpoint
            // setPatientPreviousVisit(response.data);
            console.log("Pt ID:", patientId);
            console.log("Visit ID:", visitId);
            DummyData.previousVisitData.map((row) => {
                if (row.patientId === patientId && row.visitId === visitId) {
                    console.log("Row:", row);
                    setLastVisit(row);
                }
            });

        } catch (error) {
            console.error("Error fetching patient details:", error);
        }
    };

    useEffect(() => {
        setPatientDetails(DummyData.patientDetails.patientDetail);
        setPatientPreviousVisit(DummyData.patientDetails.previousVisit);
        setLastVisit(DummyData.previousVisitData[0]);
    }, [patientId]);



    return (
        <>
            <div className="form-head page-titles d-flex align-items-center mb-sm-4 mb-3">
                <div className="me-auto">
                    <h2 className="text-black font-w600">Patient Details</h2>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item active"><Link to={"#"}>Patient</Link></li>
                        <li className="breadcrumb-item"><Link to={"#"}>{patientDetails?.UHID}</Link></li>
                    </ol>
                </div>
                <div className="d-flex">
                    <Dropdown className="dropdown me-3">
                        <Dropdown.Toggle className="btn btn-primary i-false">
                            In Treatment
                            <i className="las la-angle-down ms-2 scale5"></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="dropdown-menu-end" align="end">
                            <Dropdown.Item>Edit</Dropdown.Item>
                            <Dropdown.Item>Detail</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    {/* <Link to={"#"} className="btn btn-outline-primary">Update Profile</Link> */}
                </div>
            </div>

            <div className="row">
                <div className="col-lg-12 mt-1">
                    <div className="card card-profile">
                        <div className="admin-user">
                            <div className="user-details m-1">
                                <div className="title text-black">
                                    <div className='row'>
                                        <div className="col-md-3 col-sm-6">
                                            <label>UHID</label>
                                            <h5>{patientDetails?.UHID}</h5>
                                        </div>
                                        <div className="col-md-5 col-sm-12">
                                            <label>Patient Name</label>
                                            <h5>{patientDetails?.patientName} {patientDetails?.relation} {patientDetails?.fathername}</h5>
                                        </div>
                                        <div className="col-md-2 col-sm-6">
                                            <label>Mobile No</label>
                                            <h5>{patientDetails?.mobileno}</h5>
                                        </div>
                                        <div className="col-md-2 col-sm-6">
                                            <label>Age/Sex</label>
                                            <h5>{patientDetails?.age} / {patientDetails?.gender}</h5>
                                        </div>
                                    </div>
                                    <div className='row mt-3'>
                                        <div className="col-md-12 col-sm-12">
                                            <label>Address</label>
                                            <h5>{patientDetails?.patientAddress}</h5>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mt-3">
                <div className="col-xl-5">
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="card text-black p-2">
                                <h4 className="card-title">Recent Visit Details</h4>
                                <div className='row'>
                                    <div className="col-md-4 col-sm-12">
                                        <label>Visit No</label>
                                    </div>
                                    <div className="col-md-8 col-sm-12">
                                        <h5>{lastVisit?.visitNo}</h5>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="col-md-4 col-sm-12">
                                        <label>Visit Date</label>
                                    </div>
                                    <div className="col-md-8 col-sm-12">
                                        <h5>{lastVisit?.visitDate}</h5>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="col-md-4 col-sm-12">
                                        <label>Doctor Name</label>
                                    </div>
                                    <div className="col-md-8 col-sm-12">
                                        <h5>{lastVisit?.doctorName}</h5>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="col-md-4 col-sm-12">
                                        <label>License No</label>
                                    </div>
                                    <div className="col-md-8 col-sm-12">
                                        <h5>{lastVisit?.licenseNumber}</h5>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="col-md-4 col-sm-12">
                                        <label>Specialization</label>
                                    </div>
                                    <div className="col-md-8 col-sm-12">
                                        <h5>{lastVisit?.specialization}</h5>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="col-md-4 col-sm-12">
                                        <label>Department</label>
                                    </div>
                                    <div className="col-md-8 col-sm-12">
                                        <h5>{lastVisit?.department}</h5>
                                    </div>
                                </div>
                                <hr />
                                <div className='row'>
                                    <div className="col-md-4 col-sm-12">
                                        <label>C/O</label>
                                    </div>
                                    <div className="col-md-8 col-sm-12">
                                        {lastVisit?.complaints.map((row, index) => (
                                            <h6 key={index}>{row.complaint}</h6>
                                        ))}
                                    </div>
                                </div>
                                <hr />
                                <div className='row'>
                                    <div className="col-md-4 col-sm-12">
                                        <label>Vitals</label>
                                    </div>
                                    <div className="col-md-8 col-sm-12">
                                        <div className='row'>
                                            <div className="col-md-6 col-sm-12">
                                                <h6>Temp: {lastVisit?.vitals.temp}</h6>
                                            </div>
                                            <div className="col-md-6 col-sm-12">
                                                <h6>Spo2: {lastVisit?.vitals.spo2}</h6>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className="col-md-6 col-sm-12">
                                                <h6>Height: {lastVisit?.vitals.height}</h6>
                                            </div>
                                            <div className="col-md-6 col-sm-12">
                                                <h6>Weight: {lastVisit?.vitals.weight}</h6>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className="col-md-6 col-sm-12">
                                                <h6>BP: {lastVisit?.vitals.bp}</h6>
                                            </div>
                                            <div className="col-md-6 col-sm-12">
                                                <h6>R/R: {lastVisit?.vitals.respiratoryrate}</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                

                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-7">
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="card text-black p-2">
                                <h4 className="card-title">Recent Visit Details</h4>
                                
                                <div className='row'>
                                    <div className="col-md-4 col-sm-12">
                                        <label>Diagnosis</label>
                                    </div>
                                    <div className="col-md-8 col-sm-12">
                                        <h6>Provisional: {lastVisit?.diagnosis.priovional}</h6>
                                        <h6>Final: {lastVisit?.diagnosis.final}</h6>
                                        <h6>Additional: {lastVisit?.diagnosis.additional}</h6>
                                    </div>
                                </div>
                                <hr />
                                <div className='row'>
                                    <div className="col-md-4 col-sm-12">
                                        <label>Past History</label>
                                    </div>
                                    <div className="col-md-8 col-sm-12">
                                        <h6>{lastVisit?.pastHistory}</h6>
                                    </div>
                                </div>
                                <hr />
                                <div className='row'>
                                    <div className="col-md-4 col-sm-12">
                                        <label>Investigation</label>
                                    </div>
                                    <div className="col-md-8 col-sm-12">
                                        <h6>{lastVisit?.investigations}</h6>
                                    </div>
                                </div>
                                <hr />
                                <div className='row'>
                                    <div className="col-md-4 col-sm-12">
                                        <label>Advice</label>
                                    </div>
                                    <div className="col-md-8 col-sm-12">
                                        <h6>{lastVisit?.advice}</h6>
                                    </div>
                                </div>
                                <hr />
                                <div className='row'>
                                    <div className="col-md-4 col-sm-12">
                                        <label>Medications</label>
                                    </div>
                                    <div className="col-md-8 col-sm-12">
                                        {lastVisit?.medications.map((row, index) => (
                                            <span className='text-black fs-6' style={{color:'#3d4465'}} key={index}>{row.medType} {row.medName} {row.route} {row.dosage} {row.frequency} {row.duration} {row.remark}<br></br></span>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div className="row mt-3">
                <div className="row">
                    <div className="col-xl-12">
                        <div className="card text-black p-2">
                            <h4>Previous Visit Details</h4>
                            <table className="table table-bordered no-footer display text-black" >
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Visit No</th>
                                        <th>Visit Date</th>
                                        <th>Doctor Name</th>
                                        <th>Advice</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {patientPreviousVisit?.map((visit, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <span
                                                    onClick={() => showVisitDetail(visit.patientId, visit.visitId)}
                                                    style={{
                                                        cursor: 'pointer',
                                                        color: '#007bff',
                                                    }}
                                                    role="button"
                                                    tabIndex={0}
                                                >
                                                    {visit.visitNo}
                                                </span>
                                            </td>
                                            <td>{visit.visitDate}</td>
                                            <td>{visit.doctorName}</td>
                                            <td>{visit.advice}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PatientDetails;