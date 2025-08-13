import * as Yup from "yup";

export const visitSchema = Yup.object().shape({
  refby: Yup.string().required("Ref By is required"),

  visitingdoctor: Yup.string().required("Visiting Doctor is required"),

  visittype: Yup.string().required("Visit Type is required"),

  visitdetail: Yup.string()
    .max(200, "Visit Description must be under 200 characters")
    .nullable(),

  medicolegal: Yup.string()
    .oneOf(["Yes", "No"], "Invalid Medico Legal option")
    .required("Please select Medico Legal status"),

  mediclaim_type: Yup.string().required("Please select Mediclaim type"),

  mediclaim_id: Yup.string().when("mediclaim_type", {
    is: (val) => val && val !== "1", // if not "Not Applicable"
    then: (schema) => schema.required("Mediclaim ID is required"),
    otherwise: (schema) => schema.nullable(),
  }),
});

export const initialVisitValues = {
  refby: "", // dropdown value
  visitingdoctor: "", // dropdown value
  visittype: "", // dropdown value
  visitdetail: "", // optional text
  medicolegal: "No", // default radio selection
  mediclaim_type: "1", // default "Not Applicable"
  mediclaim_id: "", // required if mediclaim_type != "1"
};
