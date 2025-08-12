import { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import Select from "react-select";

const OpdBills = () => {
    useEffect(() => {
        setSelectedServices([]);
    }, []);

    const patientList = [
        { id: "1", label: "Bhagwati Lal Patidar", fathername: "Bheru Lal Patidar", UHID: "MH1000202502101", mobileno: "9770014840", age: "35 Yr", gender: "M" },
        { id: "2", label: "Ram Singh", fathername: "Dev Singh Rathore", UHID: "MH1000202502102", mobileno: "9770014840", age: "46 Yr", gender: "M" },
        { id: "3", label: "Demo Test", fathername: "Testing", UHID: "MH1000202502103", mobileno: "9770014840", age: "20 Yr", gender: "M" },
    ];

    const servicesList = [
        { id: "1", code: "USG001", label: "USG Whole ABD", qty:1, rate: 1000, isEditable: true },
        { id: "2", code: "LAB001", label: "CBC", qty:1, rate: 250, isEditable: false },
        { id: "3", code: "LAB002", label: "RBS(Random Blood Sugar)", qty:1, rate: 100, isEditable:false },
    ];

    const [selectedPatient, setSelectedPatient] = useState([]);
    const [searchPatientValue, setSearchPatientValue] = useState(null);
    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);

    const handleSearchPatient = (cSelectedOption) => {
        if (cSelectedOption) {
            setSelectedPatient(cSelectedOption);
            setSearchPatientValue(null);
        }
    };

    const handleAddService = (aSelectedOption) => {
        if (aSelectedOption && !selectedServices.some(service => service.id === aSelectedOption.id)) {
            setSelectedServices([...selectedServices, aSelectedOption]);
        }
        setSelectedOption(null);
    };

    const handleRemoveService = (serviceToRemove) => {
        setSelectedServices(selectedServices.filter(service => service.id !== serviceToRemove.id));
    };

    const handleQtyChange = (service, newQty) => {
        const updatedServices = selectedServices.map(s => {
            if (s.id === service.id) {
                return { ...s, qty: newQty };
            }
            return s;
        });
        setSelectedServices(updatedServices);
    };

    const handleRateChange = (service, newRate) => {
        const updatedServices = selectedServices.map(s => {
            if (s.id === service.id) {
                return { ...s, rate: newRate };
            }
            return s;
        });
        setSelectedServices(updatedServices);
    };

    return (
        <>
            <div className="form-head align-items-center d-flex mb-sm-4">
                <div className="me-auto">
                    <h2 className="text-black font-w600">Bill Receipt</h2>
                </div>
            </div>

            <div className="row">
                <div className="col-md-8">
                    <div className="form-group">
                        <label className="text-black font-w500">Search Patient</label>
                        <Select
                            isClearable
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
                <div className="col-md-2"></div>
                <div className="col-md-2">
                    <div className="form-group">
                        <label className="text-black font-w500">Patient Category</label>
                        <select id="visittype" name="visittype" className="form-control text-black" style={{ height: '40px' }}>
                            <option value="1">General</option>
                            <option value="2">Ayushman</option>
                            <option value="3">TPA</option>
                        </select>
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
                        value={selectedPatient ? `${selectedPatient.gender?selectedPatient.gender:''}/${selectedPatient.age?selectedPatient.age:''}` : ""}
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
                        <label className="text-black font-w500">Consultant Doctor</label>
                        <select id="visitingdoctor" name="visitingdoctor" className="form-control text-black" style={{ height: '40px' }}>
                            <option value="">Select Doctor</option>
                            <option value="1">Dr. Kailash Garg</option>
                            <option value="2">Dr. Manohar Menariya</option>
                            <option value="3">Dr. Vishal Khutwal</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-10">
                    <div className="form-group">
                        <label className="text-black font-w500">Search Service</label>
                        <Select
                            isClearable
                            className="plugins-select-feild"
                            isSearchable
                            name="searchservices"
                            options={servicesList}
                            value={selectedOption}
                            onChange={handleAddService}
                        />
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="form-group">
                        <label className="text-black">Priority</label>
                        <select id="prioritytype" name="prioritytype" className="form-control text-black" style={{ height: '40px' }}>
                            <option value="1">Normal</option>
                            <option value="2">Urgent</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="selected-services">
                <Table className='text-black'>
                    <thead>
                        <tr>
                            <th>Service Code</th>
                            <th>Service Name</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Amt</th>
                            <th>Service Tax</th>
                            <th>Adjusted Amount</th>
                            <th>Discountable Amount</th>
                            <th>Charity Discount</th>
                            <th>Paid Amount</th>
                            <th>Remarks</th>
                            <th>RoundOff</th>
                            <th>Balance Amount</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedServices.map((service, index) => (
                            <tr key={index}>
                                <td>{service.code}</td>
                                <td>{service.label}</td>
                                <td>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        style={{ width: '80px', color: 'black' }}
                                        value={service.qty}
                                        onChange={(e) => handleQtyChange(service, e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        style={{ width: '100px', color: 'black' }}
                                        readOnly={!service.isEditable}
                                        value={service.rate}
                                        onChange={(e) => handleRateChange(service, e.target.value)}
                                    />
                                </td>
                                <td>{service.qty * service.rate}</td>
                                <td>{/* Service Tax Calculation */}</td>
                                <td>{/* Adjusted Amount Calculation */}</td>
                                <td>{/* Discountable Amount Calculation */}</td>
                                <td>{/* Charity Discount Calculation */}</td>
                                <td>{/* Paid Amount Calculation */}</td>
                                <td>{/* Remarks Field */}</td>
                                <td>{/* RoundOff Calculation */}</td>
                                <td>{/* Balance Amount Calculation */}</td>
                                <td>
                                    <button onClick={() => handleRemoveService(service)} className="btn-danger btn-sm">
                                        <i className="fa fa-trash" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            <div className="row">
                <div className="col-md-4">
                    <div className="form-group">
                        <Button variant="primary btn-sm">Save changes</Button>
                    </div>
                </div>
            </div>

            <div className="row form-group">
                <div className="col-md-2">
                    <label className="text-black font-w500">Total Amount</label>
                    <input
                        type="text"
                        style={{ width: '100px', color: 'black' }}
                        readOnly
                        className="form-control form-control-sm text-black"
                        value={selectedServices.reduce((acc, curr) => acc + curr.qty * curr.rate, 0)}
                    />
                </div>
                <div className="col-md-2">
                    <label className="text-black font-w500">Discount</label>
                    <input type="text" className="form-control form-control-sm text-black" style={{ width: '100px', color: 'black' }} />
                </div>
                <div className="col-md-2">
                    <label className="text-black font-w500">Net Amount</label>
                    <input type="text" className="form-control form-control-sm text-black" style={{ width: '100px', color: 'black' }} />
                </div>
                <div className="col-md-2">
                    <label className="text-black font-w500">Service Tax</label>
                    <input type="text" className="form-control form-control-sm text-black" style={{ width: '100px', color: 'black' }} />
                </div>
                <div className="col-md-2">
                    <label className="text-black font-w500">Adjusted Amount</label>
                    <input type="text" className="form-control form-control-sm text-black" style={{ width: '100px', color: 'black' }} />
                </div>
                <div className="col-md-2">
                    <label className="text-black font-w500">Discountable Amount</label>
                    <input type="text" className="form-control form-control-sm text-black" style={{ width: '100px', color: 'black' }} />
                </div>
                <div className="col-md-2">
                    <label className="text-black font-w500">Charity Discount</label>
                    <input type="text" className="form-control form-control-sm text-black" style={{ width: '100px', color: 'black' }} />
                </div>
                <div className="col-md-2">
                    <label className="text-black font-w500">Paid Amount</label>
                    <input type="text" className="form-control form-control-sm text-black" style={{ width: '100px', color: 'black' }} />
                </div>
                <div className="col-md-2">
                    <label className="text-black font-w500">Remarks</label>
                    <input type="text" className="form-control form-control-sm text-black" style={{ width: '100px', color: 'black' }} />
                </div>
                <div className="col-md-2">
                    <label className="text-black font-w500">RoundOff</label>
                    <input type="text" className="form-control form-control-sm text-black" style={{ width: '100px', color: 'black' }} />
                </div>
                <div className="col-md-2">
                    <label className="text-black font-w500">Balance Amount</label>
                    <input type="text" className="form-control form-control-sm text-black" style={{ width: '100px', color: 'black' }} />
                </div>
            </div>
        </>
    );
};

export default OpdBills;
