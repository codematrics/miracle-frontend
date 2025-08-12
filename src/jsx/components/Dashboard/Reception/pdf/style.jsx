import { StyleSheet } from "@react-pdf/renderer";

// Register the font
// Font.register({
//     family: 'DancingScript',
//     src: './../../../../../assets/fonts/DancingScriptBold.ttf', 
// });

export const styles = StyleSheet.create({
    page: {
        backgroundColor: "#fff",
        color: "#000",
        fontFamily: "Helvetica",
        fontSize: "12px",
        padding: "10px 10px",
    },
    section: {
        margin: 5,
        padding: 5,
    },
    hospitalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    title: {
        fontSize: 24,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 5,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    col3: {
        width: '25%',
        flexDirection: 'column',
    },
    col5: {
        width: '41.66%',
        flexDirection: 'column',
    },
    col6: {
        width: '50%',
        flexDirection: 'column',
    },
    col7: {
        width: '58.33%',
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
    patientSubTitle: {
        fontSize: 12,
        fontFamily: "Helvetica-Bold",
    },
    patientVital: {
        fontSize: 12,
        marginBottom: 5,
        fontFamily: "Helvetica",
    },
    patientInfo: {
        marginBottom: 5,
        fontSize: 12,
    },
    textBold: {
        fontFamily: "Helvetica-Bold",
    },
    spaceY: {
        display: "flex",
        flexDirection: "column",
        gap: "2px",
    },
    table: {
        display: "table",
        width: "100%",
        borderStyle: "solid",
        borderColor: "#000",
        borderWidth: 0.5,
        borderBottomWidth: 0,
        borderRightWidth: 0,
        content: "space-between",
    },
    tableRow: {
        flexDirection: "row",
        width: "100%", // Added width
    },
    tableCol0: {
        flex: 0.5, // Added flex to ensure columns distribute space evenly
        paddingLeft: 5,
        paddingRight: 5,
        paddingBottom: 5,
        borderStyle: "solid",
        borderColor: "#000",
        borderWidth: 0.5,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        minWidth: 0, // Ensures columns can shrink if needed
        lineHeight: 0.4,
    },
    tableCol1: {
        flex: 1, // Added flex to ensure columns distribute space evenly
        paddingLeft: 5,
        paddingRight: 5,
        borderStyle: "solid",
        borderColor: "#000",
        borderWidth: 0.5,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        minWidth: 0, // Ensures columns can shrink if needed
        lineHeight: 0.4,
    },
    tableCol15: {
        flex: 1.5, // Added flex to ensure columns distribute space evenly
        paddingLeft: 5,
        paddingRight: 5,
        borderStyle: "solid",
        borderColor: "#000",
        borderWidth: 0.5,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        minWidth: 0, // Ensures columns can shrink if needed
        lineHeight: 0.4,
    },
    tableCol2: {
        flex: 2,
        paddingLeft: 5,
        paddingRight: 5,
        borderStyle: "solid",
        borderColor: "#000",
        borderWidth: 0.5,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        minWidth: 0, // Added minWidth
        lineHeight: 0.4,
    },
    tableCol25: {
        flex: 2.5,
        paddingLeft: 5,
        paddingRight: 5,
        borderStyle: "solid",
        borderColor: "#000",
        borderWidth: 0.5,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        minWidth: 0, // Added minWidth
        lineHeight: 0.4,
    },
    tableCol3: {
        flex: 3,
        paddingLeft: 5,
        paddingRight: 5,
        borderStyle: "solid",
        borderColor: "#000",
        borderWidth: 0.5,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        minWidth: 0, // Added minWidth
        lineHeight: 0.4,
    },
    tableCell: {
        marginTop: 5,
        marginBottom: 5,
        fontSize: 10,
        textAlign: "left",
    },
    // HR Line Styles
    hr: {
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        borderBottomStyle: 'solid',
        width: '100%',
    },
    h150: {
        height: '150px',
        minHeight: '150px',
    },
    h100: {
        height: '100px',
        minHeight: '100px',
    },
    h50: {
        height: '50px',
        minHeight: '50px',
    },
    doctorRx: {
        fontSize: 26,
        fontFamily: "Helvetica-Bold",
        marginBottom: 1,
        color: "#000000",
        textAlign: "left",
    },
    doctorName: {
        fontSize: 16,
        fontFamily: "Helvetica-Bold", // PDF doesn't support font-weight directly, using Helvetica-Bold instead of Arial
        marginBottom: 2,
    },

    doctorDegree: {
        fontSize: 11,
        fontFamily: "Helvetica-Bold", // For medium weight
    },

    doctorRegNo: {
        fontSize: 10,
        fontFamily: "Helvetica", // Regular weight
        marginBottom: 2,
    },

    // Container for doctor info
    doctorInfoContainer: {
        position: 'absolute',
        bottom: 5,
        right: 10,
        flexDirection: 'column',
        alignItems: 'flex-end',
        marginRight: 10,
    },
    diagnosis: {
        fontSize: 12,
        marginBottom: 3,
        marginLeft: 10,
        alignSelf: "flex-start",
        fontFamily: "Helvetica",
    },

});