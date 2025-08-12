import React, { useState, useRef, useEffect }  from 'react';
import { Dropdown, Modal } from 'react-bootstrap';
import {Link} from 'react-router-dom';


function PatientBtn(){
    return(
        <span className="badge badge-outline-primary">
            <i className="fa fa-circle text-primary me-1" />
            New Patient
        </span>
    )
} 

function Recovery(){
    return(
        <span className="badge badge-info light">
            <i className="fa fa-circle text-info me-1" />
            Recovered
        </span>
    )
}

function Treatment(){
    return(
        <span className="badge badge-warning light">
            <i className="fa fa-circle text-warning me-1"></i>
            In Treatment
        </span>
    )
}
const tableData = [
    { pname:'Cive Slauw', assigned:'Dr. Samantha', disease:'Sleep Problem', status:<PatientBtn />, room:'AB-004'},
    { pname:'Bella Simatupang', assigned:'Dr. Olivia Jean', disease:'Hair Loss', status:<Recovery />, room:'AB-005'},
    { pname:'Enjeline Sari', assigned:'Dr. Gustauv Loi', disease:'Diabetes', status:<Treatment />, room:'AB-008'},
    { pname:'David Bekam', assigned:'Dr. Kevin Zidan', disease:'Alcoholism', status:<Treatment />, room:'AB-002'},
    { pname:'Cive Slauw', assigned:'Dr. Samantha', disease:'Cold & Flu', status:<PatientBtn />, room:'AB-007'},
    { pname:'Bella Simatupang', assigned:'Dr. Olivia Jean', disease:'Dental Care', status:<Recovery />, room:'AB-008'},
    { pname:'Enjeline Sari', assigned:'Dr. Gustauv Loi', disease:'Allergies & Asthma', status:<Treatment />, room:'AB-009'},
    { pname:'David Bekam', assigned:'Dr. Kevin Zidan', disease:'Alcoholism', status:<Treatment />, room:'AB-001'},
    { pname:'Bella Simatupang', assigned:'Dr. Olivia Jean', disease:'Hair Loss', status:<Recovery />, room:'AB-005'},
    { pname:'Enjeline Sari', assigned:'Dr. Gustauv Loi', disease:'Diabetes', status:<Treatment />, room:'AB-008'},
    { pname:'David Bekam', assigned:'Dr. Kevin Zidan', disease:'Alcoholism', status:<Treatment />, room:'AB-002'},
    { pname:'Cive Slauw', assigned:'Dr. Samantha', disease:'Cold & Flu', status:<PatientBtn />, room:'AB-007'},
];


const Patient = () => {
    const [openModel, setOpenModal] = useState();    
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
     }, [test]);
  
     
     activePag.current === 0 && chageData(0, sort);
     
     let paggination = Array(Math.ceil(data.length / sort))
        .fill()
        .map((_, i) => i + 1);
  
     
     const onClick = (i) => {
        activePag.current = i;
        chageData(activePag.current * sort, (activePag.current + 1) * sort);
        settest(i);
     };
  
     
     const chackboxFun = (type) => {
        setTimeout(() => {
            const chackbox = document.querySelectorAll(".patient_checkbox input");
            const motherChackBox = document.querySelector(".patient_strg input");
            for (let i = 0; i < chackbox.length; i++) {
               const element = chackbox[i];
               if (type === "all") {
                  if (motherChackBox.checked) {
                     element.checked = true;
                  } else {
                     element.checked = false;
                  }
               } else {
                  if (!element.checked) {
                     motherChackBox.checked = false;
                     break;
                  } else {
                     motherChackBox.checked = true;
                  }
               }
            }
        }, 100);
     };
    return (
        <>
            <div className="form-head align-items-center d-flex mb-sm-4 mb-3">
                <div className="me-auto">
                    <h2 className="text-black font-w600">Patient</h2>
                    <p className="mb-0">Hospital Admin Dashboard</p>
                </div>
                <div>
                    <Link to={"#"} className="btn btn-primary me-3" onClick={()=>setOpenModal(true)}>+ New Patient</Link>
                    <Link to={"/"} className="btn btn-outline-primary"><i className="las la-calendar-plus scale5 me-3" />Filter Date</Link>
                </div>
            </div>
           
            <div className="row">
                <div className="col-xl-12">
                    <div className="table-responsive card-table">
                        <div
                            id="patient_list"
                            className="dataTables_wrapper no-footer"
                        >
                            <table id="example5" className="table dataTable no-footer display dataTablesCard white-border table-responsive-xl">
                                <thead>
                                    <tr>
                                        <th className="patient_strg">
                                            <div className="form-check custom-checkbox">
                                                <input type="checkbox" className="form-check-input" id="checkAll" required=""
                                                    onClick={() => chackboxFun("all")}
                                                />
                                                <label className="form-check-label" htmlFor="checkAll"></label>
                                            </div>
                                        </th>
                                        <th>Patient ID</th>
                                        <th>Date Check In</th>
                                        <th>Patient Name</th>
                                        <th>Doctor Assgined</th>
                                        <th>Disease</th>
                                        <th>Status</th>
                                        <th>Room No</th>
                                        <th className="text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData.map((item, ind)=>(
                                        <tr key={ind}>
                                            <td className='patient_checkbox'>
                                                <div className="form-check  custom-checkbox">
                                                    <input type="checkbox" className="form-check-input" id={`customCheckBox${ind+5}`} 
                                                        onClick={() => chackboxFun()}
                                                    />
                                                    <label className="form-check-label" htmlFor={`customCheckBox${ind+5}`}></label>
                                                </div>
                                            </td>
                                            <td>{`#P-000${14 + ind}`}</td>
                                            <td>0{ind+1}/11/2023, 12:42 AM</td>
                                            <td>{item.pname}</td>
                                            <td>{item.assigned}</td>
                                            <td>{item.disease}</td>
                                            <td>
                                                {item.status}
                                            </td>
                                            <td>AB-004</td>
                                            <td>
                                                <Dropdown className="ms-auto c-pointer text-end">
                                                    <Dropdown.Toggle className="btn-link i-false" as="div">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11Z" stroke="#2E2E2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                            <path d="M12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18Z" stroke="#2E2E2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                            <path d="M12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4Z" stroke="#2E2E2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu className="dropdown-menu-end" align="end">
                                                        <Dropdown.Item>Accept Patient</Dropdown.Item>
                                                        <Dropdown.Item>Reject Order</Dropdown.Item>
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
                                            className={`paginate_button d-flex align-items-center justify-content-center ${
                                                activePag.current === i ? "current" : ""
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
            <Modal className="modal fade" id="addOrderModal" show={openModel} onHide={setOpenModal} centered>                
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add Contact</h5>
                        <button type="button" className="btn-close" onClick={()=>setOpenModal(false)}>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="form-group">
                                <label className="text-black font-w500">Patient Name</label>
                                <input type="text" className="form-control" />
                            </div>
                            <div className="form-group">
                                <label className="text-black font-w500">Patient ID</label>
                                <input type="text" className="form-control" />
                            </div>
                            <div className="form-group">
                                <label className="text-black font-w500">Disease</label>
                                <input type="text" className="form-control" />
                            </div>
                            <div className="form-group">
                                <label className="text-black font-w500">Date Check In</label>
                                <input type="date" className="form-control" />
                            </div>
                        </form>
                    </div>
                        <div className="modal-footer">
                        <button type="button" className="btn btn-danger light" onClick={()=>setOpenModal(false)}>Close</button>
                        <button type="button" className="btn btn-primary">Save changes</button>
                    </div>
                </div>                
            </Modal>
        </>
    );
};

export default Patient;