// Auth types
export const AuthStatus = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
};

export const UserRole = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  NURSE: 'nurse',
  RECEPTIONIST: 'receptionist',
  PATIENT: 'patient',
};

// Post types
export const PostStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
};

export const PostCategory = {
  NEWS: 'news',
  ANNOUNCEMENT: 'announcement',
  BLOG: 'blog',
  HEALTH_TIP: 'health_tip',
};

// Patient types
export const PatientStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DISCHARGED: 'discharged',
  ADMITTED: 'admitted',
};

export const VisitType = {
  CONSULTATION: 'consultation',
  CHECKUP: 'checkup',
  EMERGENCY: 'emergency',
  FOLLOW_UP: 'follow_up',
};

// Service types
export const ServiceStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  MAINTENANCE: 'maintenance',
};

export const ServiceCategory = {
  DIAGNOSTIC: 'diagnostic',
  TREATMENT: 'treatment',
  SURGERY: 'surgery',
  THERAPY: 'therapy',
  EMERGENCY: 'emergency',
};

// API Response types
export const createApiResponse = (data = null, message = '', success = true) => ({
  success,
  message,
  data,
  timestamp: new Date().toISOString(),
});

export const createPaginatedResponse = (data = [], page = 1, limit = 10, total = 0) => ({
  data,
  pagination: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasNext: page < Math.ceil(total / limit),
    hasPrev: page > 1,
  },
});

// Error types
export const ErrorType = {
  VALIDATION: 'validation',
  AUTHENTICATION: 'authentication',
  AUTHORIZATION: 'authorization',
  NOT_FOUND: 'not_found',
  SERVER: 'server',
  NETWORK: 'network',
};

export const createError = (type, message, details = null) => ({
  type,
  message,
  details,
  timestamp: new Date().toISOString(),
});

// Form validation schemas using Yup-like structure
export const createValidationSchema = fields => fields;

// Common field validations
export const ValidationRules = {
  required: (message = 'This field is required') => ({ required: message }),
  email: (message = 'Please enter a valid email') => ({ email: message }),
  minLength: (min, message = `Must be at least ${min} characters`) => ({
    minLength: { value: min, message },
  }),
  maxLength: (max, message = `Must be no more than ${max} characters`) => ({
    maxLength: { value: max, message },
  }),
  pattern: (regex, message = 'Invalid format') => ({
    pattern: { value: regex, message },
  }),
  phone: (message = 'Please enter a valid phone number') => ({
    pattern: {
      value: /^[\+]?[\d\s\-\(\)]{10,}$/,
      message,
    },
  }),
  strongPassword: (
    message = 'Password must contain uppercase, lowercase, number and special character'
  ) => ({
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      message,
    },
  }),
};
