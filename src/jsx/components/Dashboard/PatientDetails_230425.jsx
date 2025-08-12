import React from 'react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom'
import { Dropdown } from 'react-bootstrap';

import DummyData from './DummyData';

const statisticBlog = [
    { title: 'Immunities', progress: '80%', color: '#5F74BF' },
    { title: 'Stamina', progress: '50%', color: '#FFD439' },
    { title: 'Heart Beat', progress: '90%', color: '#FF6E5A' },
    { title: 'Colestrol', progress: '70%', color: '#5FBF91' },
];

const PatientDetails = () => {
    const { patientId } = useParams();
    console.log("Patient ID:", patientId); // Use the patientId as needed
    const [patientPreviousVisit, setPatientPreviousVisit] = useState(null);

    const fetchPatientDetails = async () => {
        try {
            // const response = await axios.get(`https://api.example.com/patients/${patientId}`); // Replace with your API endpoint
            // setPatientPreviousVisit(response.data);
            
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

            
        } catch (error) {
            console.error("Error fetching patient details:", error);
        }
    };

    useEffect(() => {
        setPatientPreviousVisit(DummyData.patientDetail);
    }, [patientId]);



    return (
        <>
            <div className="form-head page-titles d-flex align-items-center mb-sm-4 mb-3">
                <div className="me-auto">
                    <h2 className="text-black font-w600">Patient Details</h2>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item active"><Link to={"#"}>Patient</Link></li>
                        <li className="breadcrumb-item"><Link to={"#"}>MH202502101</Link></li>
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
                                            <h5>{patientPreviousVisit?.UHID}</h5>
                                        </div>
                                        <div className="col-md-5 col-sm-12">
                                            <label>Patient Name</label>
                                            <h5>{patientPreviousVisit?.patientName} {patientPreviousVisit?.relation} {patientPreviousVisit?.fathername}</h5>
                                        </div>
                                        <div className="col-md-2 col-sm-6">
                                            <label>Mobile No</label>
                                            <h5>{patientPreviousVisit?.mobileno}</h5>
                                        </div>
                                        <div className="col-md-2 col-sm-6">
                                            <label>Age/Sex</label>
                                            <h5>{patientPreviousVisit?.age} / {patientPreviousVisit?.gender}</h5>
                                        </div>
                                    </div>
                                    <div className='row mt-3'>
                                        <div className="col-md-12 col-sm-12">
                                            <label>Address</label>
                                            <h5>{patientPreviousVisit?.patientAddress}</h5>
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
                                        <h5>{patientPreviousVisit?.visitNo}</h5>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="col-md-4 col-sm-12">
                                        <label>Visit Date</label>
                                    </div>
                                    <div className="col-md-8 col-sm-12">
                                        <h5>{patientPreviousVisit?.visitDate}</h5>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="col-md-4 col-sm-12">
                                        <label>Doctor Name</label>
                                    </div>
                                    <div className="col-md-8 col-sm-12">
                                        <h5>{patientPreviousVisit?.doctorName}</h5>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="col-md-4 col-sm-12">
                                        <label>License No</label>
                                    </div>
                                    <div className="col-md-8 col-sm-12">
                                        <h5>{patientPreviousVisit?.licenseNumber}</h5>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="col-md-4 col-sm-12">
                                        <label>Specialization</label>
                                    </div>
                                    <div className="col-md-8 col-sm-12">
                                        <h5>{patientPreviousVisit?.specialization}</h5>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="col-md-4 col-sm-12">
                                        <label>Department</label>
                                    </div>
                                    <div className="col-md-8 col-sm-12">
                                        <h5>{patientPreviousVisit?.department}</h5>
                                    </div>
                                </div>
                                <hr />
                                <div className='row'>
                                    <div className="col-md-4 col-sm-12">
                                        <label>C/O</label>
                                    </div>
                                    <div className="col-md-8 col-sm-12">
                                        {patientPreviousVisit?.complaints.map((row, index) => (
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
                                                <h6>Temp: {patientPreviousVisit?.vitals.temp}</h6>
                                            </div>
                                            <div className="col-md-6 col-sm-12">
                                                <h6>Spo2: {patientPreviousVisit?.vitals.spo2}</h6>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className="col-md-6 col-sm-12">
                                                <h6>Height: {patientPreviousVisit?.vitals.height}</h6>
                                            </div>
                                            <div className="col-md-6 col-sm-12">
                                                <h6>Weight: {patientPreviousVisit?.vitals.weight}</h6>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className="col-md-6 col-sm-12">
                                                <h6>BP: {patientPreviousVisit?.vitals.bp}</h6>
                                            </div>
                                            <div className="col-md-6 col-sm-12">
                                                <h6>R/R: {patientPreviousVisit?.vitals.respiratoryrate}</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div className='row'>
                                    <div className="col-md-4 col-sm-12">
                                        <label>Diagnosis</label>
                                    </div>
                                    <div className="col-md-8 col-sm-12">
                                        <h6>Provisional: {patientPreviousVisit?.diagnosis.priovional}</h6>
                                        <h6>Final: {patientPreviousVisit?.diagnosis.final}</h6>
                                        <h6>Additional: {patientPreviousVisit?.diagnosis.additional}</h6>
                                    </div>
                                </div>
                                <hr />
                                <div className='row'>
                                    <div className="col-md-4 col-sm-12">
                                        <label>Past History</label>
                                    </div>
                                    <div className="col-md-8 col-sm-12">
                                        <h6>{patientPreviousVisit?.pastHistory}</h6>
                                    </div>
                                </div>
                                <hr />
                                <div className='row'>
                                    <div className="col-md-4 col-sm-12">
                                        <label>Investigation</label>
                                    </div>
                                    <div className="col-md-8 col-sm-12">
                                        <h6>{patientPreviousVisit?.investigations}</h6>
                                    </div>
                                </div>
                                <hr />
                                <div className='row'>
                                    <div className="col-md-4 col-sm-12">
                                        <label>Advice</label>
                                    </div>
                                    <div className="col-md-8 col-sm-12">
                                        <h6>{patientPreviousVisit?.advice}</h6>
                                    </div>
                                </div>
                                <hr />
                                <div className='row'>
                                    <div className="col-md-4 col-sm-12">
                                        <label>Medications</label>
                                    </div>
                                    <div className="col-md-8 col-sm-12">
                                        {patientPreviousVisit?.medications.map((row, index) => (
                                            <span className='text-black fs-6' key={index}>{row.medType} {row.medName} {row.route} {row.dosage} {row.frequency} {row.duration} {row.remark}</span>
                                        ))}
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
                                            {patientPreviousVisit?.previousVisit?.visitData?.map((visit, index) => (
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



            </div>
            
        </>
    );
};

export default PatientDetails;