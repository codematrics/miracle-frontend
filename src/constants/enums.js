export const PATIENT_TYPES = {
  GENERAL: 'General',
  VIP: 'VIP',
  STAFF: 'Staff',
};

export const SERVICE_CATEGORIES = {
  CONSULTATION: 'consultation',
  DIAGNOSTIC: 'diagnostic',
  LABORATORY: 'laboratory',
  PATHOLOGY: 'pathology',
  RADIOLOGY: 'radiology',
  PROCEDURE: 'procedure',
  SURGERY: 'surgery',
  PHARMACY: 'pharmacy',
  EMERGENCY: 'emergency',
  OTHER: 'other',
};

export const DOCTOR_TYPES = ['REFERRING', 'CONSULTING'];

export const PAYMENT_MODES = {
  CASH: 'cash',
  CARD: 'card',
  UPI: 'upi',
  INSURANCE: 'insurance',
};

export const PRIORITY = {
  NORMAL: 'normal',
  URGENT: 'urgent',
  STAT: 'stat',
};

export const ROLES = {
  ADMIN: 'Admin',
  RECEPTIONIST: 'Receptionist',
  DOCTOR: 'Doctor',
  TECHNICIAN: 'Technician',
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  COLLECTED: 'collected',
  SAVED: 'saved',
  AUTHORIZED: 'authorized',
};

export const PARAMETER_DATATYPE_ENUM = {
  numeric: 'numeric',
  text: 'text',
  boolean: 'boolean',
  select: 'select',
};

export const GENDER = {
  MALE: 'Male',
  FEMALE: 'Female',
  OTHER: 'Other',
};

export const RELATION_TYPES = {
  SON_OF: 'S/O',
  WIFE_OF: 'W/O',
  DAUGHTER_OF: 'D/O',
  OTHER: 'Other',
};

export const MARITAL_STATUS = {
  DIVORCED: 'Divorced',
  MARRIED: 'Married',
  SEPARATED: 'Separated',
  UNMARRIED: 'Unmarried',
  WIDOWED: 'Widowed',
};

export const ID_TYPES = {
  AADHAR_CARD: 'Aadhar Card',
  PAN_CARD: 'Pancard',
  DRIVING_LICENSE: 'Driving license',
  VOTER_ID: 'Voter ID',
  PASSPORT: 'Passport',
};

export const OCCUPATIONS = {
  SELF_EMPLOYED: 'SELF EMPLOYED',
  GOVT_SERVICE: 'GOVT. SERVICE',
  PVT_SERVICE: 'PVT. SERVICE',
  BUSINESS: 'BUSINESS',
  HOUSE_WORK: 'HOUSE WORK',
  STUDY: 'STUDY',
  UNEMPLOYED: 'UN-EMPLOYED',
  OTHER: 'OTHER',
};

export const RELIGIONS = {
  HINDU: 'Hindu',
  BUDDHIST: 'Buddhist',
  CHRISTIAN: 'Christian',
  JAIN: 'Jain',
  MUSLIM: 'Muslim',
  PARSI: 'Parsi',
  SIKH: 'Sikh',
  OTHER: 'Other',
};

export const DOCTOR_DEPARTMENTS = [
  'Medicine',
  'Surgery',
  'Pediatrics',
  'Gynecology',
  'Orthopedics',
  'Cardiology',
  'Neurology',
  'Radiology',
  'Pathology',
  'Emergency',
];

export const DOCTOR_SPECIALIZATION = [
  'General Medicine',
  'General Surgery',
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Gynecology',
  'Pediatrics',
  'Radiology',
  'Pathology',
  'Emergency Medicine',
  'Anesthesiology',
  'Dermatology',
];

export const SERVICE_CATEGORY = {
  CONSULTATION: 'Consultation',
  PATHOLOGY: 'Pathology',
  RADIOLOGY: 'Radiology',
  OTHER: 'Other',
};

export const SERVICE_APPLICABLE = {
  OPD: 'OPD',
  IPD: 'IPD',
  BOTH: 'Both',
};

export const HEAD_TYPE = {
  PROCEDURE: 'Procedure',
  PATHOLOGY: 'Pathology',
  CONSULTATION: 'Consultation',
  SURGERY: 'Surgery',
  RADIOLOGY: 'Radiology',
  OTHER: 'Other',
};

export const SERVICE_HEADS = {
  GENERAL_MEDICINE: 'General Medicine',
  PEDIATRICS: 'Pediatrics',
  SURGERY: 'Surgery',
  ORTHOPEDICS: 'Orthopedics',
  CARDIOLOGY: 'Cardiology',
  NEUROLOGY: 'Neurology',
  NEPHROLOGY: 'Nephrology',
  GASTROENTEROLOGY: 'Gastroenterology',
  PULMONOLOGY: 'Pulmonology',
  DERMATOLOGY: 'Dermatology',
  ENDOCRINOLOGY: 'Endocrinology',
  PSYCHIATRY: 'Psychiatry',
  ENT: 'ENT',
  OPHTHALMOLOGY: 'Ophthalmology',
  UROLOGY: 'Urology',
  OB_GYN: 'Obstetrics & Gynecology',
  ANESTHESIOLOGY: 'Anesthesiology',
  PATHOLOGY: 'Pathology / Lab Services',
  RADIOLOGY: 'Radiology / Imaging',
  CT_SCAN: 'CT Scan',
  MRI: 'MRI',
  X_RAY: 'X-Ray',
  ULTRASOUND: 'Ultrasound',
  ECG_ECHO: 'ECG / Echo',
  PHYSIOTHERAPY: 'Physiotherapy / Rehabilitation',
  DIALYSIS: 'Dialysis',
  CHEMOTHERAPY: 'Chemotherapy',
  OPERATION_THEATER: 'Operation Theater',
  BLOOD_BANK: 'Blood Bank',
  NUTRITION: 'Nutrition & Dietetics',
  MEDICAL_RECORDS: 'Medical Records / HIM',
  BILLING: 'Billing / Finance',
  INSURANCE: 'Insurance / TPA',
  HOUSEKEEPING: 'Housekeeping / Sanitation',
  EMERGENCY: 'Emergency / ER',
  ICU: 'ICU',
  NICU: 'NICU',
  CCU: 'CCU',
  BURN_UNIT: 'Burn Unit',
  TELEMEDICINE: 'Telemedicine',
  COUNSELING: 'Counseling / Social Work',
};

export const REPORT_TYPE = {
  HAEMATOLOGY: 'Haematology',
  BIOCHEMISTRY: 'Biochemistry',
  SEROLOGY: 'Serology',
  CYTOLOGY: 'Cytology',
  OUTSOURCE: 'Outsource',
  HORMONES_IMMUNOLOGY: 'HormonesImmunology',
  CLINICAL: 'Clinical',
};

export const FORMAT_TYPE = {
  TABULAR: 'Tabular',
  FREESTYLE: 'FreeStyle',
  SELECTIVE: 'Selective',
};

export const SAMPLE_TYPE = {
  SERUM: 'Serum',
  URINE: 'Urine',
  BLOOD: 'Blood',
  FLUIDS: 'Fluids',
  SEMEN: 'Semen',
  TISSUE: 'Tissue',
  STOOL: 'Stool',
  SWAB: 'Swab',
};

export const GENDER_WITH_ALL = {
  MALE: 'Male',
  FEMALE: 'Female',
  ALL: 'All',
};

export const AGE_UNITS = {
  ALL: 'All',
  YEAR: 'Year',
  MONTH: 'Month',
  DAY: 'Day',
};

export const VISIT_TYPE = {
  OPD: 'OPD',
  IPD: 'IPD',
  EMERGENCY: 'Emergency',
};

export const INSURANCE_TYPE = {
  SELF: 'Self',
  AYUSHMAN: 'Ayushman',
  INSURANCE: 'Insurance',
  CORPORATE: 'Corporate',
};

export const VISIT_STATUS = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  CLOSED: 'Closed',
};

export const RADIOLOGY_ENUMS = {
  // Template Field Types
  TEMPLATE_FIELD_TYPES: {
    TEXT: 'text',
    TEXTAREA: 'textarea',
    NUMBER: 'number',
    SELECT: 'select',
    CHECKBOX: 'checkbox',
    RADIO: 'radio',
  },

  // Common Radiology Positions
  PATIENT_POSITIONS: {
    SUPINE: 'supine',
    PRONE: 'prone',
    LATERAL: 'lateral',
    DECUBITUS: 'decubitus',
    ERECT: 'erect',
    SITTING: 'sitting',
  },

  // Contrast Types
  CONTRAST_TYPES: {
    IODINATED: 'iodinated',
    GADOLINIUM: 'gadolinium',
    BARIUM: 'barium',
    NONE: 'none',
  },

  // Image Quality
  IMAGE_QUALITY: {
    EXCELLENT: 'excellent',
    GOOD: 'good',
    FAIR: 'fair',
    POOR: 'poor',
    NON_DIAGNOSTIC: 'non_diagnostic',
  },

  // Common Anatomical Regions
  ANATOMICAL_REGIONS: {
    HEAD: 'head',
    NECK: 'neck',
    CHEST: 'chest',
    ABDOMEN: 'abdomen',
    PELVIS: 'pelvis',
    SPINE: 'spine',
    EXTREMITIES: 'extremities',
  },

  // Scan Techniques
  SCAN_TECHNIQUES: {
    PLAIN: 'plain',
    WITH_CONTRAST: 'with_contrast',
    WITHOUT_CONTRAST: 'without_contrast',
    PRE_POST_CONTRAST: 'pre_post_contrast',
  },
};

export const VALIDATION_PATTERNS = {
  ALPHANUMERIC: '^[A-Za-z0-9\\s]+$',
  ALPHA_ONLY: '^[A-Za-z\\s]+$',
  NUMERIC_ONLY: '^[0-9]+$',
  DECIMAL: '^[0-9]+(\\.[0-9]+)?$',
  SNAKE_CASE: '^[a-z][a-z0-9_]*$',
};
