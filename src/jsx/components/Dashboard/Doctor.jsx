import React, { useState, useRef, useEffect }  from 'react';
import { Dropdown, Modal } from 'react-bootstrap';
import {Link} from 'react-router-dom';
import { IMAGES } from '../../constant/theme';


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
    { id: 1, image: IMAGES.Userpng11, pname:'Cive Slauw', assigned:'Dr. Samantha', disease:'Sleep Problem', status:<PatientBtn />, room:'AB-004'},
    { id: 2, image: IMAGES.Userpng12, pname:'Bella Simatupang', assigned:'Dr. Olivia Jean', disease:'Hair Loss', status:<Recovery />, room:'AB-005'},
    { id: 3, image: IMAGES.Userpng13, pname:'Enjeline Sari', assigned:'Dr. Gustauv Loi', disease:'Diabetes', status:<Treatment />, room:'AB-008'},
    { id: 4, image: IMAGES.Userpng14, pname:'David Bekam', assigned:'Dr. Kevin Zidan', disease:'Alcoholism', status:<Treatment />, room:'AB-002'},
    { id: 5, image: IMAGES.Userpng15, pname:'Cive Slauw', assigned:'Dr. Samantha', disease:'Cold & Flu', status:<PatientBtn />, room:'AB-007'},
    { id: 6, image: IMAGES.Userpng16, pname:'Bella Simatupang', assigned:'Dr. Olivia Jean', disease:'Dental Care', status:<Recovery />, room:'AB-008'},
    { id: 7, image: IMAGES.Userpng17, pname:'Enjeline Sari', assigned:'Dr. Gustauv Loi', disease:'Allergies & Asthma', status:<Treatment />, room:'AB-009'},
    { id: 8, image: IMAGES.Userpng18, pname:'David Bekam', assigned:'Dr. Kevin Zidan', disease:'Alcoholism', status:<Treatment />, room:'AB-001'},
    { id: 9, image: IMAGES.Userpng19, pname:'Bella Simatupang', assigned:'Dr. Olivia Jean', disease:'Hair Loss', status:<Recovery />, room:'AB-005'},
    { id: 10, image: IMAGES.Userpng11, pname:'Enjeline Sari', assigned:'Dr. Gustauv Loi', disease:'Diabetes', status:<Treatment />, room:'AB-008'},
    // { image: IMAGES.Userpng12, pname:'David Bekam', assigned:'Dr. Kevin Zidan', disease:'Alcoholism', status:<Treatment />, room:'AB-002'},
    // { image: IMAGES.Userpng13, pname:'Cive Slauw', assigned:'Dr. Samantha', disease:'Cold & Flu', status:<PatientBtn />, room:'AB-007'},
];

// function hanldeSort(){
    
//    return  tableData.sort(function(a,b){
//         if (b.disease > a.disease) {
//             return -1;
//         } else if (a.disease > b.disease) {
//             return console.log(tableData);
//           } else {
//             return 0;
//         }      
//     })
// }


const Doctor = () => {
    const [openModel, setOpenModal] = useState();    
    const [data, setData] = useState(
        document.querySelectorAll("#doctor_list tbody tr")
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
        setData(document.querySelectorAll("#doctor_list tbody tr"));
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
            const chackbox = document.querySelectorAll(".doctor_checkbox input");
            const motherChackBox = document.querySelector(".doctor_strg input");
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
                    <h2 className="text-black font-w600">Doctors</h2>
                    <p className="mb-0">Hospital Admin Dashboard Template</p>
                </div>
                <div>
                    <Link to={"#"} className="btn btn-primary me-3" onClick={()=>setOpenModal(true)}>+ New Doctor</Link>
                    <Link to={"/"} className="btn btn-outline-primary"><i className="las la-calendar-plus scale5 me-3" />Filter Date</Link>
                </div>
            </div>
           
            <div className="row">
                <div className="col-xl-12">
                    <div className="table-responsive card-table">
                        <div
                            id="doctor_list"
                            className="dataTables_wrapper no-footer"
                        >
                            <table id="example5" className="table dataTable no-footer display dataTablesCard white-border table-responsive-xl">
                                <thead>
                                    <tr>
                                        <th className="doctor_strg">
                                            <div className="form-check custom-checkbox">
                                                <input type="checkbox" className="form-check-input" id="checkAll" required=""
                                                    onClick={() => chackboxFun("all")}
                                                />
                                                <label className="form-check-label" htmlFor="checkAll"></label>
                                            </div>
                                        </th>
                                        <th>Profile</th>
										<th>ID</th>
										<th>Date Join</th>
										<th>Doctor Name</th>
										<th
                                            // onClick={hanldeSort}
                                        >Specialist</th>
										<th>Schedule</th>
										<th>Contact</th>
										<th>Status</th>
										<th className="text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData.map((item, ind)=>(
                                        <tr key={ind}>
                                            <td className='doctor_checkbox'>
                                                <div className="form-check custom-checkbox">
                                                    <input type="checkbox" className="form-check-input" id={`doctorinput${ind+5}`} required=""
                                                         onClick={() => chackboxFun()}
                                                    />
                                                    <label className="form-check-label" htmlFor={`doctorinput${ind+5}`}></label>
                                                </div>
                                            </td>
                                            <td>
                                                <img src={item.image} alt="" width="43" />
                                            </td>
                                            <td><span className="text-nowrap">#P-00012</span></td>
                                            <td>26/10/2023, 12:42 AM</td>
                                            <td>{item.assigned}</td>
                                            <td>{item.disease}</td>
                                            <td>
                                            {
                                                ind % 2 === 1 ? 
                                                <Link to={"#"} className="btn btn-primary text-nowrap btn-sm light">5 Appointment</Link>
                                                :
                                                <Link to={"#"} className="btn btn-outline-dark text-nowrap btn-sm">No Schedule</Link>
                                            }
                                            </td>
                                            <td><span className="text-nowrap">+12 4124 5125</span></td>
                                            {
                                                ind % 2 === 1 ? 
                                                    <td><span className="text-dark">Unavailable</span></td>
                                                :
                                                    <td><span className="text-primary">Available</span></td>
                                            }
                                            <td>
                                                <Dropdown className=" ms-auto c-pointer text-end">
                                                    <Dropdown.Toggle className="btn-link i-false" as="div">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11Z" stroke="#2E2E2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                            <path d="M12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18Z" stroke="#2E2E2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                            <path d="M12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4Z" stroke="#2E2E2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu className="dropdown-menu-end" align="end">
                                                        <Dropdown.Item >View Detail</Dropdown.Item>
                                                        <Dropdown.Item >Edit</Dropdown.Item>
                                                        <Dropdown.Item >Delete</Dropdown.Item>
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
                                <label className="text-black font-w500">Doctor Name</label>
                                <input type="text" className="form-control" />
                            </div>
                            <div className="form-group">
                                <label className="text-black font-w500">Doctor ID</label>
                                <input type="text" className="form-control" />
                            </div>
                            <div className="form-group">
                                <label className="text-black font-w500">Specialist</label>
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

export default Doctor;