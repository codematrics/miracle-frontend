import { useEffect, useRef, useState } from "react";
import { Button, ButtonGroup, Dropdown, Modal, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import Select from "react-select";

function General() {
  return (
    <span className="badge badge-outline-primary">
      <i className="fa fa-circle text-primary me-1" />
      General
    </span>
  );
}

function Ayushman() {
  return (
    <span className="badge badge-info light">
      <i className="fa fa-circle text-info me-1" />
      Ayushman
    </span>
  );
}

function TPA() {
  return (
    <span className="badge badge-warning light">
      <i className="fa fa-circle text-warning me-1"></i>
      TPA
    </span>
  );
}
const tableData = [
  {
    pname: "ASHKAR GOVARDHANLAL LASHKAR",
    assigned: "Dr. Samantha",
    amount: "300",
    category: <General />,
  },
  {
    pname: "TAMANNA ANJANA",
    assigned: "Dr. Olivia Jean",
    amount: "450",
    category: <Ayushman />,
  },
  {
    pname: "VARSHA KUNWAR",
    assigned: "Dr. Gustauv Loi",
    amount: "200",
    category: <General />,
  },
  {
    pname: "ASHIYA BEE",
    assigned: "Dr. Kevin Zidan",
    amount: "1050",
    category: <TPA />,
  },
  {
    pname: "REKHA RATNAWAT",
    assigned: "Dr. Samantha",
    amount: "1100",
    category: <General />,
  },
  {
    pname: "MAMTA KARA",
    assigned: "Dr. Olivia Jean",
    amount: "450",
    category: <Ayushman />,
  },
  {
    pname: "RAMESH NATH",
    assigned: "Dr. Gustauv Loi",
    amount: "750",
    category: <General />,
  },
  {
    pname: "ANSH RATNAWAT",
    assigned: "Dr. Kevin Zidan",
    amount: "630",
    category: <TPA />,
  },
  {
    pname: "KAWARI BAI CHOUHAN",
    assigned: "Dr. Olivia Jean",
    amount: "3500",
    category: <Ayushman />,
  },
  {
    pname: "DEV KUNWAR PATIDAR",
    assigned: "Dr. Gustauv Loi",
    amount: "1250",
    category: <General />,
  },
  {
    pname: "David Bekam",
    assigned: "Dr. Kevin Zidan",
    amount: "500",
    category: <TPA />,
  },
  {
    pname: "Cive Slauw",
    assigned: "Dr. Samantha",
    amount: "950",
    category: <General />,
  },
];

const BillingDetails = () => {
  const [opdBillModal, setOPDBillModal] = useState(false);
  const [dateFilterModal, setDateFilterModal] = useState(false);

  const [data, setData] = useState(
    document.querySelectorAll("#billing_list tbody tr")
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
    setData(document.querySelectorAll("#billing_list tbody tr"));
    if (opdBillModal) {
      setSelectedServices([]); // Clear selected services when modal loads
    }
  }, [test, opdBillModal]);

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
    {
      id: "1",
      label: "Bhagwati Lal Patidar",
      fathername: "Bheru Lal Patidar",
      UHID: "MH1000202502101",
      mobileno: "9770014840",
      age: "35 Yr",
      gender: "M",
    },
    {
      id: "2",
      label: "Ram Singh",
      fathername: "Dev Singh Rathore",
      UHID: "MH1000202502102",
      mobileno: "9770014840",
      age: "46 Yr",
      gender: "M",
    },
    {
      id: "3",
      label: "Demo Test",
      fathername: "Testing",
      UHID: "MH1000202502103",
      mobileno: "9770014840",
      age: "20 Yr",
      gender: "M",
    },
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
    if (
      aSelectedOption &&
      !selectedServices.some((service) => service.id === aSelectedOption.id)
    ) {
      setSelectedServices([...selectedServices, aSelectedOption]);
    }
    setSelectedOption(null); // Clear the selected option
  };

  const handleRemoveService = (serviceToRemove) => {
    setSelectedServices(
      selectedServices.filter((service) => service.id !== serviceToRemove.id)
    );
  };

  return (
    <>
      <div className="form-head align-items-center d-flex mb-sm-4 mb-3">
        <div className="me-auto">
          <h2 className="text-black font-w600">Bill Receipt</h2>
        </div>
        <div>
          <ButtonGroup>
            <Dropdown>
              <Dropdown.Toggle className="me-2" variant="primary" size="sm">
                <i className="fa fa-plus color-info" /> Add
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item to="" onClick={() => setOPDBillModal(true)}>
                  OPD Bill
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </ButtonGroup>

          <Button
            className="me-2"
            variant="primary btn-sm"
            onClick={() => setDateFilterModal(true)}
          >
            <i className="las la-calendar-plus scale5 me-2" /> Filter Date
          </Button>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-12">
          <div className="table-responsive card-table">
            <div id="billing_list" className="dataTables_wrapper no-footer">
              <table
                id="example5"
                className="table dataTable no-footer display dataTablesCard white-border table-responsive-xl"
              >
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Bill No</th>
                    <th>UHID No</th>
                    <th>Patient Name</th>
                    <th>Doctor</th>
                    <th>Date</th>
                    <th>Bill Amount</th>
                    <th>Category</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((item, ind) => (
                    <tr key={ind}>
                      <td>{ind + 1}</td>
                      <td>{`OP250300${1 + ind}`}</td>
                      <td>{`MH1000202502${1 + ind}`}</td>
                      <td>{item.pname}</td>
                      <td>{item.assigned}</td>
                      <td>{ind + 1}/03/2025 13:11</td>
                      <td>{item.amount}</td>
                      <td>{item.category}</td>
                      <td>
                        <Dropdown className="ms-auto c-pointer text-end">
                          <Dropdown.Toggle
                            className="btn-link i-false"
                            as="div"
                          >
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11Z"
                                stroke="#2E2E2E"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18Z"
                                stroke="#2E2E2E"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4Z"
                                stroke="#2E2E2E"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </Dropdown.Toggle>
                          <Dropdown.Menu
                            className="dropdown-menu-end"
                            align="end"
                          >
                            <Dropdown.Item>Print</Dropdown.Item>
                            <Dropdown.Item>Edit</Dropdown.Item>
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
                      activePag.current > 0 && onClick(activePag.current - 1)
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

      {/* <!-- Date Filter Modal --> */}
      <Modal
        className="fade"
        show={dateFilterModal}
        onHide={setDateFilterModal}
        centered
      >
        <Modal.Header>
          <Modal.Title>Date Filter</Modal.Title>
          <Button
            variant=""
            className="btn-close"
            onClick={() => setDateFilterModal(false)}
          ></Button>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="text-black font-w500">From Date</label>
                <input
                  type="date"
                  id="fromdate"
                  name="fromdate"
                  className="form-control text-black"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="text-black font-w500">To Date</label>
                <input
                  type="date"
                  id="todate"
                  name="todate"
                  className="form-control text-black"
                />
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

      {/* <!-- OPD Bill Modal --> */}
      <Modal
        className="fade"
        show={opdBillModal}
        onHide={setOPDBillModal}
        centered={true}
        size={"xl"}
        backdropClassName={"role"}
        backdrop={"static"}
      >
        <Modal.Header>
          <Modal.Title>Add New Visit</Modal.Title>
          <Button
            variant=""
            className="btn-close"
            onClick={() => setOPDBillModal(false)}
          ></Button>
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
                value={
                  selectedPatient
                    ? `${selectedPatient.gender}/${selectedPatient.age}`
                    : ""
                }
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-3">
              <div className="form-group">
                <label className="text-black font-w500">Ref By</label>
                <select
                  id="refby"
                  name="refby"
                  className="form-control text-black"
                  style={{ height: "40px" }}
                >
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
                <label className="text-black font-w500">
                  Consultant Doctor
                </label>
                <select
                  id="visitingdoctor"
                  name="visitingdoctor"
                  className="form-control text-black"
                  style={{ height: "40px" }}
                >
                  <option value="">Select Doctor</option>
                  <option value="1">Dr. Kailash Garg</option>
                  <option value="2">Dr. Manohar Menariya</option>
                  <option value="3">Dr. Vishal Khutwal</option>
                </select>
              </div>
            </div>
            <div className="col-md-2">
              <div className="form-group">
                <label className="text-black font-w500">Patient Category</label>
                <select
                  id="visittype"
                  name="visittype"
                  className="form-control text-black"
                  style={{ height: "40px" }}
                >
                  <option value="1">General</option>
                  <option value="2">Ayushman</option>
                  <option value="3">TPA</option>
                </select>
              </div>
            </div>
            <div className="col-md-2">
              <div className="form-group">
                <label className="text-black">Priority</label>
                <select
                  id="prioritytype"
                  name="prioritytype"
                  className="form-control text-black"
                  style={{ height: "40px" }}
                >
                  <option value="1">Normal</option>
                  <option value="2">Urgent</option>
                </select>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3">
              <div className="form-group">
                <label className="text-black">Medico Legal(MLC)</label>
                <div className="form-control" style={{ height: "40px" }}>
                  <div className="form-check custom-checkbox form-check-inline text-black">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="medicolegal_y"
                      name="medicolegal"
                    />
                    <label className="form-check-label" htmlFor="medicolegal_y">
                      Yes
                    </label>
                  </div>
                  <div className="form-check custom-checkbox form-check-inline text-black">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="medicolegal_n"
                      name="medicolegal"
                    />
                    <label className="form-check-label" htmlFor="medicolegal_n">
                      No
                    </label>
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
                    <td>
                      {
                        <button
                          onClick={() => handleRemoveService(service)}
                          className="delete-icon"
                        >
                          <i className="fa fa-trash" />
                        </button>
                      }
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
          <Button onClick={() => setOPDBillModal(false)} variant="dark btn-sm">
            Close
          </Button>
          <Button variant="primary btn-sm">Save changes</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BillingDetails;
