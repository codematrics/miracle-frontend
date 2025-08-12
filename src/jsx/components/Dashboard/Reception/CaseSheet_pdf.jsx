import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import headerLogo from './../../../../assets/images/header_prescription.jpg';

const styles = StyleSheet.create({
    // ... keep your existing styles ...
    page: {
        flexDirection: 'column',
        padding: 0,
        marginBottom: 10,
        marginRight: 10,
        marginLeft: 10,
        marginTop: 10,
        fontFamily: 'Helvetica',
        pageSize: 'A4',
    },
    section: {
        margin: 5,
        padding: 5,
    },
    title: {
        fontSize: 24,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 5,
    },
    text: {
        fontSize: 12,
        marginBottom: 5,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    col3: {
        width: '25%',
        flexDirection: 'column',
    },
    col6: {
        width: '50%',
        flexDirection: 'column',
    },
    col9: {
        width: '75%',
        flexDirection: 'column',
    },
    col12: {
        width: '100%',
        flexDirection: 'column',
    },
    doctorName: {
        fontSize: 18,
        fontWeight: 900,
    },
    doctorDegree: {
        fontSize: 14,
        fontWeight: 600,
    },
    doctorLicense: {
        fontSize: 14,
        fontWeight: 400,
    },

    hospitalHeader: {
        textAlign: 'center',
        marginBottom: 5,
    },
    patientVital: {
        fontSize: 12,
    },
    doctorInfo: {
        marginBottom: 5,
    },
    patientInfo: {
        marginBottom: 5,
        fontSize: 12,
    },
    medicationTable: {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: 5,
        fontSize: 12,
    },
    medicationTableThTd: {
        padding: 1,
        textAlign: 'left',
    },
    signature: {
        marginTop: 70,
        textAlign: 'right',
    },
    // Add these new styles for the table
    table: {
        display: 'table',
        width: '100%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderCollapse: 'collapse',
    },
    tableRow: {
        flexDirection: 'row'
    },
    tableCol: {
        borderLeftWidth: 0,
        borderTopWidth: 0
    },
    tableColWide: {
        borderLeftWidth: 0,
        borderTopWidth: 0
    },
    tableCell: {
        fontSize: 10
    },
    tableCellLeft: {
        fontSize: 10,
        textAlign: 'left'
    }
});

const CaseSheet = () => {
    const caseSheetData = {
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

    return (
        <Document>
            <Page style={styles.page}>
                <View style={styles.section}>
                    {/* Header Image */}
                    <View style={styles.hospitalHeader}>
                        <Image src={headerLogo} />
                    </View>

                    {/* Vitals Section */}
                    <View style={styles.row}>
                        <View style={styles.col3}>
                            <View style={styles.row}>
                                <View style={styles.col6}>
                                    <Text style={styles.patientVital}>Temp</Text>
                                </View>
                                <View style={styles.col6}>
                                    <Text style={styles.patientVital}>SpO2</Text>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <View style={styles.col6}>
                                    <Text style={styles.patientVital}>Height</Text>
                                </View>
                                <View style={styles.col6}>
                                    <Text style={styles.patientVital}>Weight</Text>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <View style={styles.col6}>
                                    <Text style={styles.patientVital}>BP</Text>
                                </View>
                                <View style={styles.col6}>
                                    <Text style={styles.patientVital}>R/R</Text>
                                </View>
                            </View>
                        </View>

                        {/* Patient Information Table */}
                        <View style={[styles.col9, styles.table]}>
                            <View style={styles.tableRow}>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>UHID</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCellLeft}>{caseSheetData[0]?.UHID}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>Visit No</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCellLeft}>{caseSheetData?.visitNo}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>Date</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCellLeft}>{caseSheetData?.visitDate}</Text>
                                </View>
                            </View>

                            <View style={styles.tableRow}>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>Patient Name</Text>
                                </View>
                                <View style={styles.tableColWide}>
                                    <Text style={styles.tableCellLeft}>{caseSheetData?.patientName}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>Age/Gender</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCellLeft}>
                                        {caseSheetData?.age} / {caseSheetData?.gender}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.tableRow}>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>Address</Text>
                                </View>
                                <View style={styles.tableColWide}>
                                    <Text style={styles.tableCellLeft}>{caseSheetData?.patientAddress}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>Mobile</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCellLeft}>{caseSheetData?.mobileno}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Medications Section */}
                    <View style={[styles.section, styles.table]}>
                        <Text style={styles.subtitle}>Medications</Text>
                        {caseSheetData.medications?.length > 0 ? (
                            <View style={styles.tableRow}>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>Type</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>Medicine</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>Route</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>Dosage</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>Frequency</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>Duration</Text>
                                </View>
                            </View>
                        ) : (
                            <Text></Text>
                        )}
                        {caseSheetData.medications?.map((med, index) => (
                            <View style={styles.tableRow} key={index}>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{med.medType}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{med.medName}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{med.route}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{med.dosage}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{med.frequency}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{med.duration}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default CaseSheet;