import * as yup from "yup";

export const patientSchema = yup.object().shape({
  patientName: yup
    .string()
    .required("Patient name is required")
    .max(100, "Patient name too long")
    .matches(
      /^[a-zA-Z\s\.]+$/,
      "Patient name should only contain letters, spaces, and dots"
    ),

  relation: yup
    .mixed()
    .oneOf(
      ["S/O", "W/O", "D/O", "Other"],
      "Relation must be one of: S/O, W/O, D/O, Other"
    )
    .required("Relation is required"),

  fatherOrHusbandName: yup
    .string()
    .required("Father/Husband name is required")
    .max(100, "Father/Husband name too long")
    .matches(
      /^[a-zA-Z\s\.]+$/,
      "Father/Husband name should only contain letters, spaces, and dots"
    ),

  age: yup
    .number()
    .typeError("Age must be a number")
    .required("Age is required")
    .integer("Age must be an integer")
    .min(0, "Age cannot be negative")
    .max(150, "Age seems unrealistic"),

  ageUnit: yup
    .mixed()
    .oneOf(
      ["Year", "Month", "Day"],
      "Age unit must be one of: Year, Month, Day"
    )
    .required("Age unit is required"),

  gender: yup
    .mixed()
    .oneOf(
      ["Male", "Female", "Other"],
      "Gender must be one of: Male, Female, Other"
    )
    .required("Gender is required"),

  maritalStatus: yup
    .mixed()
    .oneOf(
      ["Divorced", "Married", "Separated", "Unmarried", "Widowed", ""],
      "Invalid marital status"
    )
    .nullable(),

  religion: yup
    .mixed()
    .oneOf(
      [
        "Hindu",
        "Buddhist",
        "Christian",
        "Jain",
        "Muslim",
        "Parsi",
        "Sikh",
        "Other",
        "",
      ],
      "Invalid religion"
    )
    .nullable(),

  occupation: yup
    .mixed()
    .oneOf(
      [
        "SELF EMPLOYED",
        "GOVT. SERVICE",
        "PVT. SERVICE",
        "BUSINESS",
        "HOUSE WORK",
        "STUDY",
        "UN-EMPLOYED",
        "OTHER",
        "",
      ],
      "Invalid occupation"
    )
    .nullable(),

  mobileNo: yup
    .string()
    .matches(/^\d{10}$/, "Mobile number must be exactly 10 digits")
    .required("Mobile number is required"),

  emailId: yup.string().email("Invalid email format").nullable(),

  idType: yup
    .mixed()
    .oneOf(
      ["Aadhar Card", "Pancard", "Driving license", "Voter ID", "Passport"],
      "ID type must be one of: Aadhar Card, Pancard, Driving license, Voter ID, Passport"
    )
    .required("ID type is required"),

  idNo: yup
    .string()
    .required("ID number is required")
    .min(6, "ID number must be at least 6 characters")
    .max(20, "ID number cannot exceed 20 characters")
    .matches(
      /^[a-zA-Z0-9]+$/,
      "ID number can only contain letters and numbers"
    ),

  patientType: yup
    .mixed()
    .oneOf(
      ["General", "VIP", "Staff"],
      "Patient type must be one of: General, VIP, Staff"
    )
    .required("Patient type is required"),

  address: yup.object().shape({
    village: yup
      .string()
      .required("Village/Colony is required")
      .max(100, "Village/Colony too long")
      .matches(
        /^[a-zA-Z0-9\s\.\,\-]+$/,
        "Village/Colony should only contain letters, numbers, spaces, dots, commas, and hyphens"
      ),

    state: yup
      .string()
      .required("State is required")
      .max(50, "State too long")
      .matches(
        /^[a-zA-Z\s\.]+$/,
        "State should only contain letters, spaces, and dots"
      ),

    district: yup
      .string()
      .required("District is required")
      .max(50, "District too long")
      .matches(
        /^[a-zA-Z\s\.]+$/,
        "District should only contain letters, spaces, and dots"
      ),

    tehsil: yup
      .string()
      .required("Tehsil is required")
      .max(50, "Tehsil too long")
      .matches(
        /^[a-zA-Z\s\.]+$/,
        "Tehsil should only contain letters, spaces, and dots"
      ),

    postOffice: yup
      .string()
      .required("Post office is required")
      .max(50, "Post office too long")
      .matches(
        /^[a-zA-Z\s\.]+$/,
        "Post office should only contain letters, spaces, and dots"
      ),

    pincode: yup
      .string()
      .matches(/^\d{6}$/, "Pincode must be exactly 6 digits")
      .required("Pincode is required"),
  }),
});

// Initial values for the form
export const initialPatientValues = {
  patientName: "",
  relation: "S/O",
  fatherOrHusbandName: "",
  age: "",
  ageUnit: "Year",
  gender: "Male",
  maritalStatus: "",
  religion: "",
  occupation: "",
  mobileNo: "",
  emailId: "",
  idType: "Aadhar Card",
  idNo: "",
  patientType: "General",
  address: {
    village: "",
    state: "",
    district: "",
    tehsil: "",
    postOffice: "",
    pincode: "",
  },
};
