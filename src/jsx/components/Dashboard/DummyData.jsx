
const DummyData = {
    // Dummy data for the Casesheet
    caseSheetData: {
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

    },

    // Dummy data for the Visit Consultation
    servicesList: [
        { id: "1", code: "CON001", label: "Consultation Fees", rate: 200 },
        { id: "2", code: "CON002", label: "Revisit Fees", rate: 100 },
        { id: "3", code: "CON003", label: "Follow Fees", rate: 0 },
    ],

    // Dummy data for the Patient List
    patientList: [
        { id: "1", label: "Bhagwati Lal Patidar", fathername: "Bheru Lal Patidar", UHID: "MH1000202502101", mobileno: "9770014840", age: "35 Yr", gender: "M" },
        { id: "2", label: "Ram Singh", fathername: "Dev Singh Rathore", UHID: "MH1000202502102", mobileno: "9770014840", age: "46 Yr", gender: "M" },
        { id: "3", label: "Demo Test", fathername: "Testing", UHID: "MH1000202502103", mobileno: "9770014840", age: "20 Yr", gender: "M" },
    ],

    // Dummy data for the Patient Details
    patientDetails: {
        patientDetail: {
            id: 1,
            patientName: "Bhagwati Lal",
            relation: "S/O",
            fathername: "Bheru Lal Patidar",
            UHID: "MH202502101",
            mobileno: "9770014840",
            age: "35 Yr",
            gender: "M",
            patientAddress: "511 A/B, RALAYTA, MANDSAUR, MADHYA PRADESH",
        },
        previousVisit: [
            {
                patientId: 1,
                age: "35 Yr",
                visitId: 11,
                visitNo: "OPD-001",
                visitDate: "15-04-2025 10:09:00",
                doctorName: "Dr. Kailash Garg",
                licenseNumber: "MH654321",
                specialization: "MBBS, MD",
                department: "General Medicine",
                doctorSignature: "signature.png",
                referredBy: "Dr. Kailash Garg",
                advice: "Follow up in 1 week.",
            },
            {
                patientId: 1,
                age: "34 Yr",
                visitId: 114,
                visitNo: "OPD-002",
                visitDate: "10-04-2024 09:57:47",
                doctorName: "Dr. Rahul Patidar",
                licenseNumber: "MH123456",
                specialization: "MBBS, MD",
                department: "Cardiology",
                doctorSignature: "signature.png",
                referredBy: "Dr. Rahul Patidar",
                advice: "Take rest and drink plenty of fluids.",
            }
        ]
    },

    // Dummy data for the previous visits
    previousVisitData: [
        {
            patientId: 1,
            age: "35 Yr",
            visitId: 11,
            visitNo: "OPD-001",
            visitDate: "15-04-2025 10:09:00",
            doctorName: "Dr. Kailash Garg",
            licenseNumber: "MH654321",
            specialization: "MBBS, MD",
            department: "General Medicine",
            doctorSignature: "signature.png",
            referredBy: "Dr. Kailash Garg",
            advice: "Follow up in 1 week.",
            pastHistory: "Diabetes, Hypertension\n Asthma \n Allergies: None",
            familyHistory: "Father Diabetes, Hypertension\n Mother Hypertension \n Brother Diabetes \n Sister Hypertension",
            investigations: "Blood Group, RBS, X-Ray Chest",
            complaints: [
                { complaint: "Chest Pain Moderate for the last  2 days" },
                { complaint: "Shortness of Breath for the last 3 days" },
            ],
            vitals: {
                temp: "98.6 °F",
                spo2: "98%",
                height: "167 cm",
                weight: "70 kg",
                bp: "120/80 mmHg",
                respiratoryrate: "16 breaths/min",
                pulse: "72 bpm",
            },
            diagnosis: {
                priovional: "Diabetes Mellitus",
                final: "Hypertension",
                additional: "Hyperlipidemia"
            },
            medications: [
                { medType: "Cap", medName: "Aspirin", route: "Oral", dosage: "100mg", frequency: "Once a day", duration: "10 days", remark: "" },
                { medType: "Tab", medName: "Dolo", route: "Oral", dosage: "650mg", frequency: "Twice a day", duration: "SOS", remark: "after meal" },
                { medType: "Tab", medName: "Ibuprofen", route: "Oral", dosage: "200mg", frequency: "Thrice a day", duration: "7 days", remark: "" },
            ]
        },
        {
            patientId: 1,
            age: "34 Yr",
            visitId: 114,
            visitNo: "OPD-002",
            visitDate: "10-04-2024 09:57:47",
            doctorName: "Dr. Rahul Patidar",
            licenseNumber: "MH123456",
            specialization: "MBBS, MD",
            department: "Cardiology",
            doctorSignature: "signature.png",
            referredBy: "Dr. Rahul Patidar",
            advice: "Take rest and drink plenty of fluids.",
            pastHistory: "Diabetes, Hypertension",
            familyHistory: "Brother Diabetes \n Sister Hypertension",
            investigations: "CBC, LFT, RFT, X-Ray Chest, ECG",
            complaints: [
                { complaint: "Chest Pain Moderate for the last  2 days" },
                { complaint: "Shortness of Breath for the last 1 days" },
            ],
            vitals: {
                temp: "98.6 °F",
                spo2: "99%",
                height: "167 cm",
                weight: "69 kg",
                bp: "119/90 mmHg",
                respiratoryrate: "18 breaths/min",
                pulse: "71 bpm",
            },
            diagnosis: {
                priovional: "Diabetes Mellitus",
                final: "",
                additional: ""
            },
            medications: [
                { medType: "Tab", medName: "Ibuprofen", route: "Oral", dosage: "200mg", frequency: "Thrice a day", duration: "7 days", remark: "" },
                { medType: "Tab", medName: "Dolo", route: "Oral", dosage: "650mg", frequency: "Twice a day", duration: "SOS", remark: "after meal" },
                { medType: "Cap", medName: "Aspirin", route: "Oral", dosage: "100mg", frequency: "Once a day", duration: "10 days", remark: "" },
            ]
        },

    ],

    // Dummy data for the Work Flow
    workFlow: [
        { id: 1, label: "Patient Registration", status: "Completed" },
        { id: 2, label: "Consultation", status: "In Progress" },
        { id: 3, label: "Investigation", status: "Pending" },
        { id: 4, label: "Treatment", status: "Pending" },
        { id: 5, label: "Follow Up", status: "Pending" },
    ],

};

export default DummyData;