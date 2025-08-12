import * as Yup from "yup";

export const visitSchema = Yup.object().shape({
  searchPatient: Yup.object().nullable().required("Please select a patient"),

  uhid: Yup.string().required("UHID No is required"),

  refby: Yup.string().required("Ref By is required"),

  visitingdoctor: Yup.string().required("Visiting Doctor is required"),

  visittype: Yup.string().required("Visit Type is required"),

  visitdetail: Yup.string()
    .max(200, "Visit Description must be under 200 characters")
    .nullable(),

  medicolegal: Yup.string()
    .oneOf(["yes", "no"], "Invalid Medico Legal option")
    .required("Please select Medico Legal status"),

  mediclaim_type: Yup.string().required("Please select Mediclaim type"),

  mediclaim_id: Yup.string().when("mediclaim_type", {
    is: (val) => val && val !== "1", // if not "Not Applicable"
    then: (schema) => schema.required("Mediclaim ID is required"),
    otherwise: (schema) => schema.nullable(),
  }),

  searchservices: Yup.array().min(1, "Please select at least one service"),
});

export const initialVisitValues = {
  searchPatient: null, // react-select object { value, label } or null
  uhid: "", // string
  refby: "", // dropdown value
  visitingdoctor: "", // dropdown value
  visittype: "", // dropdown value
  visitdetail: "", // optional text
  medicolegal: "no", // default radio selection
  mediclaim_type: "1", // default "Not Applicable"
  mediclaim_id: "", // required if mediclaim_type != "1"
  searchservices: [], // array of selected services
};
