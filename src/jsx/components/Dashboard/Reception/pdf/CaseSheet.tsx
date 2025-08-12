import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Document, PDFViewer, Page, Text, View, Image } from "@react-pdf/renderer";
import headerLogo from './../../../../../assets/images/header_prescription.jpg';
import { styles } from "./style.jsx";
import { Table, TD, TH, TR } from "@ag-media/react-pdf-table";
import DummyData from '../../DummyData.jsx';


const CaseSheet = () => {

    const { patientid } = useParams();

    const [caseSheetData, setCaseSheetData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCaseSheet = async (dummy) => {
        try {
            setLoading(true);
            // const response = await axios.get(`/api/casesheet/${patientid}`);
            // setCaseSheetData(response.data);
            // console.log(DummyData);
            setCaseSheetData(dummy); // Using dummy data for now

        } catch (err) {
            setError('Failed to load case sheet data.');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

   

    useEffect(() => {
        const dummyData = {
            id: "1", patientName: "Bhagwati Lal",
            relation: "S/O",
            fathername: "Bheru Lal Patidar",
            UHID: "MH202502101",
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
            referredBy: "Dr. Rahul Patidar",
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

        fetchCaseSheet(dummyData);

    }, [patientid]);


    


    const CaseSheetPDF = () => (
        <Document title="Case Sheet" author="Miracle Hospital" subject="Case Sheet PDF" keywords="case sheet, pdf, hospital">
            <Page size="A4" style={styles.page} orientation="portrait">
                <View style={styles.section}>
                    {/* Header Image */}

                        <View style={styles.col12}>
                            <View style={styles.hospitalHeader}>
                                <Image src={headerLogo} />
                            </View>
                        </View>

                    {/* Patient Information Table */}
                    <View style={styles.row}>
                        <View style={styles.col12}>
                            <View style={styles.body}>
                                <View style={styles.table}>
                                    <View style={styles.tableRow}>
                                        <View style={styles.tableCol0}>
                                            <Text style={styles.tableCell}>UHID</Text>
                                        </View>
                                        <View style={styles.tableCol2}>
                                            <Text style={styles.tableCell}>{caseSheetData?.UHID}</Text>
                                        </View>
                                        <View style={styles.tableCol0}>
                                            <Text style={styles.tableCell}>Visit</Text>
                                        </View>
                                        <View style={styles.tableCol1}>
                                            <Text style={styles.tableCell}>{caseSheetData?.visitNo}</Text>
                                        </View>
                                        <View style={styles.tableCol0}>
                                            <Text style={styles.tableCell}>Date</Text>
                                        </View>
                                        <View style={styles.tableCol15}>
                                            <Text style={styles.tableCell}>{caseSheetData?.visitDate}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.tableRow}>
                                        <View style={styles.tableCol0}>
                                            <Text style={styles.tableCell}>Name</Text>
                                        </View>
                                        <View style={styles.tableCol2}>
                                            <Text style={styles.tableCell}>{caseSheetData?.patientName} {caseSheetData?.relation} {caseSheetData?.fathername}</Text>
                                        </View>
                                        <View style={styles.tableCol0}>
                                            <Text style={styles.tableCell}>Age/Sex</Text>
                                        </View>
                                        <View style={styles.tableCol0}>
                                            <Text style={styles.tableCell}>{caseSheetData?.age} / {caseSheetData?.gender}</Text>
                                        </View>
                                        <View style={styles.tableCol0}>
                                            <Text style={styles.tableCell}>Mobile</Text>
                                        </View>
                                        <View style={[styles.tableCol0,styles.textBold]}>
                                            <Text style={styles.tableCell}>{caseSheetData?.mobileno}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.tableRow}>
                                        <View style={styles.tableCol0}>
                                            <Text style={styles.tableCell}>Doctor</Text>
                                        </View>
                                        <View style={styles.tableCol2}>
                                            <Text style={[styles.tableCell,styles.textBold]}>{caseSheetData?.doctorName} ({caseSheetData?.specialization})</Text>
                                        </View>
                                        <View style={styles.tableCol0}>
                                            <Text style={styles.tableCell}>Reg No.</Text>
                                        </View>
                                        <View style={styles.tableCol1}>
                                            <Text style={styles.tableCell}>{caseSheetData?.licenseNumber} </Text>
                                        </View>
                                        <View style={styles.tableCol0}>
                                            <Text style={styles.tableCell}>Referred</Text>
                                        </View>
                                        <View style={styles.tableCol15}>
                                            <Text style={styles.tableCell}>{caseSheetData?.referredBy}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.tableRow}>
                                        <View style={styles.tableCol0}>
                                            <Text style={styles.tableCell}>Address</Text>
                                        </View>
                                        <View style={styles.tableCol3}>
                                            <Text style={styles.tableCell}>{caseSheetData?.patientAddress} </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* <View style={styles.row}>
                        <View style={styles.col12}>
                            <Text style={styles.hr}></Text>
                        </View>
                    </View> */}

                    {/* Complain Section */}
                    <View style={styles.row}>
                        <View style={styles.col5}>
                            <View style={[styles.row,styles.h150]}>
                                <View style={styles.col12}>
                                    <Text style={styles.patientSubTitle}>C/O</Text>
                                </View>
                            </View>
                            {/* Vitals Section */}
                            <View style={[styles.row,styles.h150]}>
                                <View style={styles.col12}>
                                    <Text style={styles.patientSubTitle}>Vitals</Text>
                                    <Text style={styles.patientVital}>Temp</Text>
                                    <Text style={styles.patientVital}>SpO2</Text>
                                    <Text style={styles.patientVital}>Height</Text>
                                    <Text style={styles.patientVital}>Weight</Text>
                                    <Text style={styles.patientVital}>BP</Text>
                                    <Text style={styles.patientVital}>R/R</Text>
                                    
                                </View>
                            </View>
                            <View style={[styles.row,styles.h150]}>
                                <View style={styles.col12}>
                                    <Text style={styles.patientSubTitle}>Past History</Text>
                                </View>
                            </View>
                            <View style={[styles.row,styles.h150]}>
                                <View style={styles.col12}>
                                    <Text style={styles.patientSubTitle}>Advice / Investigations</Text>
                                </View>
                            </View>
                            

                        </View>
                        {/* Medications Section */}
                        <View style={styles.col7}>
                            <View style={styles.row}>
                                <View style={styles.col12}>
                                    <Text style={styles.patientSubTitle}>Diagnosis</Text>
                                    <Text style={styles.diagnosis}>Provisional -</Text>
                                    <Text style={styles.diagnosis}>Final -</Text>
                                    <Text style={styles.diagnosis}>Additional -</Text>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <View style={styles.col12}>
                                    <Text style={styles.doctorRx}>Rx,</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    
                    {/* Space holder to prevent content overlap */}
                    <View style={styles.h50} />

                    {/* Doctor Sign */}
                    <View style={styles.row}>
                        <View style={styles.col12}>
                            <View style={styles.doctorInfoContainer}>
                                <Text style={styles.doctorName}>{caseSheetData?.doctorName}</Text>
                                <Text style={styles.doctorDegree}>{caseSheetData?.specialization}</Text>
                                <Text style={styles.doctorRegNo}>{caseSheetData?.licenseNumber}</Text>
                            </View>
                        </View>
                    </View>

                </View>
            </Page>
        </Document>

    );

    return (
        <div>
            <PDFViewer style={{ width: '100%', height: '100vh', border: 'none' }} showToolbar={true}>
                <CaseSheetPDF />
            </PDFViewer>
        </div>

    );
};

export default CaseSheet;