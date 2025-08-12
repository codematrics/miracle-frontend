import { useState, useEffect } from 'react';

import { Button, Table } from 'react-bootstrap';
import Select from "react-select";

const OpdBills = () => {

    const [selectedPatient, setSelectedPatient] = useState("");
    const [searchPatientValue, setSearchPatientValue] = useState(null);
    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [discountPercent, setDiscountPercent] = useState(0.00);
    const [discountValue, setDiscountValue] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    const [paidAmount, setPaidAmount] = useState(0);
    const [balanceAmount, setBalanceAmount] = useState(0);

    const patientList = [
        { id: "1", label: "Bhagwati Lal Patidar", fathername: "Bheru Lal Patidar", UHID: "MH1000202502101", mobileno: "9770014840", age: "35 Yr", gender: "M" },
        { id: "2", label: "Ram Singh", fathername: "Dev Singh Rathore", UHID: "MH1000202502102", mobileno: "9770014840", age: "46 Yr", gender: "M" },
        { id: "3", label: "Demo Test", fathername: "Testing", UHID: "MH1000202502103", mobileno: "9770014840", age: "20 Yr", gender: "M" },
    ];

    const servicesList = [
        { id: "1", code: "USG001", label: "USG Whole ABD", qty: 1, rate: 1000, isEditable: true },
        { id: "2", code: "LAB001", label: "CBC", qty: 1, rate: 250, isEditable: false },
        { id: "3", code: "LAB002", label: "RBS(Random Blood Sugar)", qty: 1, rate: 100, isEditable: false },
    ];


    const handleSearchPatient = (cSelectedOption) => {
        if (cSelectedOption) {
            if (selectedPatient) {
                setSelectedPatient([]);
            }
            setSelectedPatient(cSelectedOption); // Store the selected patient object
            setSearchPatientValue(null); //
        }
    };

    const handleAddService = (aSelectedOption) => {
        if (aSelectedOption && !selectedServices.some(service => service.id === aSelectedOption.id)) {
            setSelectedServices(prev => [...prev, aSelectedOption]);
            handleGrandTotal();
        }
        setSelectedOption(null); // Clear the selected option
        
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

    const handleGrandTotal = () => {
        var gTotal = selectedServices.reduce((acc, curr) => acc + curr.qty * curr.rate, 0);

        setGrandTotal(parseFloat(gTotal));
        setDiscountPercent(0);
        setDiscountValue(0);

        setPaidAmount(parseFloat(gTotal));
        setBalanceAmount(0);
        // console.log(gTotal);
        
    };

    const handleDiscount = (value, type) => {
        if (type === 1) {            
            const discountAmount = (grandTotal * value) / 100;
            setDiscountPercent(value);
            setPaidAmount((grandTotal - discountAmount));
            setDiscountValue(discountAmount);
            setBalanceAmount(0);
            console.log(discountAmount);
            
        } else if (type === 2) {
            const discountPercent = ((value * 100) / grandTotal).toFixed(2);
            setDiscountPercent(discountPercent);
            setDiscountValue(value);
            setPaidAmount(grandTotal - value);
            setBalanceAmount(0);
        }else {
            setDiscountPercent(0);
            setDiscountValue(0);
            setPaidAmount(grandTotal);
            setBalanceAmount(0);
        }
        
    };

    const handlePaidAmount = (value) => {

        const numericValue = parseFloat(value) || 0;
        const totalAfterDiscount = parseFloat(grandTotal) - parseFloat(discountValue || 0);

        if (value === "" || numericValue === 0) {
            setPaidAmount(0);
            return;
        }
    
        if (numericValue > totalAfterDiscount) {
            alert(`Paid amount cannot exceed total after discount (${totalAfterDiscount})`);
            return;
        }

        setPaidAmount(numericValue);
        setBalanceAmount(totalAfterDiscount - numericValue); // Calculate balance amount
        
    };

    // use effect
    useEffect(() => {
        if (selectedServices.length > 0) {
            handleGrandTotal();
        }
    }, [selectedServices]);

    return (
        <>
        
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
                        value={selectedPatient ? `${selectedPatient.gender ? selectedPatient.gender : ''}/${selectedPatient.age ? selectedPatient.age : ''}` : ""}
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
                <div className="col-md-10 col-sm-10">
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

            <div className="row">
                <div className="col-md-11 selected-services">
                    <Table responsive={true} className='text-black' >
                        <thead>
                            <tr>
                                <th>Service Code</th>
                                <th>Service Name</th>
                                <th>Qty</th>
                                <th>Price</th>
                                <th>Amt</th>
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
                                            onChange={(e) => handleQtyChange(service, e.target.value, 'qty')}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            className="form-control form-control-sm"
                                            style={{ width: '100px', color: 'black' }}
                                            readOnly={!service.isEditable}
                                            value={service.rate}
                                            onChange={(e) => handleRateChange(service, e.target.value, 'rate')}
                                        />
                                    </td>
                                    <td>{service.qty * service.rate}</td>
                                    <td>
                                        {<button onClick={() => handleRemoveService(service)} className="btn btn-sm">
                                            <i className="fa fa-trash" />
                                        </button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>

            <div className="row">
                <div className="col-md-2">
                    <div className="form-group">
                        <label className="text-black font-w500">Grand Total</label>
                        <input
                            type="text"
                            style={{ width: '100px' }}
                            readOnly
                            className="form-control form-control-sm text-black"
                            value={selectedServices.reduce((acc, curr) => acc + curr.qty * curr.rate, 0)}
                        />
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="form-group">
                        <label className="text-black font-w500">Discount</label>
                        <div className="input-group">
                            <input type="number"
                                className="form-control form-control-sm text-black"
                                style={{ width: '40px' }}
                                value={discountPercent}
                                onChange={(e) => handleDiscount(e.target.value, 1)}
                            />
                            <div className="input-group-append">
                                <span className="input-group-text text-black">%</span>
                            </div>
                            <input type="number"
                                className="form-control form-control-sm text-black"
                                style={{ width: '40px' }}
                                value={discountValue}
                                onChange={(e) => handleDiscount(e.target.value, 2)}
                            />
                        </div>
                    </div>
                </div>

                <div className="col-md-2">
                    <div className="form-group">
                        <label className="text-black font-w500">Paid<span className='danger'>*</span></label>
                        <input type="number"
                            className="form-control form-control-sm text-black"
                            style={{ width: '90px' }}
                            value={paidAmount}
                            onChange={(e) => handlePaidAmount(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="form-group">
                        <label className="text-black font-w500">Balance</label>
                        <input type="number"
                            className="form-control form-control-sm text-black"
                            style={{ width: '80px' }}
                            readOnly
                            value={balanceAmount}
                        />
                    </div>
                </div>
                <div className="col-md-2">
                    <label className="text-black font-w500">Payment Mode</label>
                    <div className="form-group">
                        <select id="paymentmode" name="paymentmode" className="form-control text-black" style={{ height: '40px' }}>
                            <option value="1">Cash</option>
                            <option value="2">Card</option>
                            <option value="3">UPI</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-8">
                </div>
                <div className="col-md-4">
                    <div className="form-group">
                        <Button variant="primary btn-sm">Save</Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OpdBills;
