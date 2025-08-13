const mongoose = require('mongoose');

// Visit Schema for MongoDB
const visitSchema = new mongoose.Schema({
  // Basic Visit Information
  visitNo: {
    type: String,
    required: true,
    unique: true,
    index: true,
    // Auto-generate format: OPD-YYYYMMDD-001
  },
  
  visitDate: {
    type: Date,
    default: Date.now,
    required: true,
    index: true
  },
  
  visitType: {
    type: String,
    required: true,
    enum: ['OPD', 'IPD', 'Emergency', 'Camp'],
    default: 'OPD',
    index: true
  },
  
  visitDescription: {
    type: String,
    maxlength: 500,
    trim: true
  },
  
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled', 'no_show'],
    default: 'scheduled',
    index: true
  },
  
  // Patient Reference
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
    index: true
  },
  
  // Patient snapshot data (for quick access without joins)
  patientInfo: {
    uhid: { type: String, required: true },
    name: { type: String, required: true },
    fatherOrHusbandName: { type: String },
    mobileNo: { type: String, required: true },
    age: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    address: {
      village: String,
      district: String,
      state: String,
      pincode: String
    }
  },
  
  // Doctor Information
  referredBy: {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor'
    },
    doctorName: String,
    referenceType: {
      type: String,
      enum: ['self', 'doctor', 'other'],
      default: 'self'
    }
  },
  
  visitingDoctor: {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true
    },
    doctorName: { type: String, required: true },
    department: String,
    specialization: String
  },
  
  // Medical Information
  medicoLegal: {
    type: Boolean,
    default: false,
    index: true
  },
  
  mediclaim: {
    type: {
      type: String,
      enum: ['Not Applicable', 'Ayushman', 'Healthcare', 'National Insurance', 'Other'],
      default: 'Not Applicable'
    },
    policyNumber: String,
    policyId: String
  },
  
  // Services Information
  services: [{
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    },
    serviceName: { type: String, required: true },
    serviceCode: { type: String, required: true },
    rate: { type: Number, required: true, min: 0 },
    category: String,
    quantity: { type: Number, default: 1, min: 1 },
    discount: { type: Number, default: 0, min: 0 },
    finalAmount: { type: Number, required: true }
  }],
  
  // Billing Information
  billing: {
    totalAmount: { type: Number, required: true, default: 0 },
    discountAmount: { type: Number, default: 0, min: 0 },
    taxAmount: { type: Number, default: 0, min: 0 },
    finalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'partial', 'paid', 'refunded'],
      default: 'pending',
      index: true
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'upi', 'net_banking', 'cheque', 'other']
    }
  },
  
  // Clinical Data (will be filled during consultation)
  clinical: {
    // Chief Complaints
    complaints: [{
      complaint: String,
      duration: String,
      severity: {
        type: String,
        enum: ['mild', 'moderate', 'severe']
      }
    }],
    
    // Vital Signs
    vitals: {
      temperature: String,
      bloodPressure: String,
      pulse: String,
      respiratoryRate: String,
      oxygenSaturation: String,
      height: String,
      weight: String,
      bmi: Number
    },
    
    // History
    presentHistory: String,
    pastHistory: String,
    familyHistory: String,
    personalHistory: String,
    allergies: String,
    
    // Examination
    generalExamination: String,
    systemicExamination: String,
    
    // Diagnosis
    provisionalDiagnosis: String,
    finalDiagnosis: String,
    additionalDiagnosis: String,
    
    // Investigations
    investigations: [{
      name: String,
      type: String,
      status: {
        type: String,
        enum: ['ordered', 'in_progress', 'completed'],
        default: 'ordered'
      },
      result: String,
      reportDate: Date
    }],
    
    // Treatment Plan
    medications: [{
      medicationType: String, // Tab, Cap, Syp, Inj, etc.
      medicineName: String,
      route: String, // Oral, IV, IM, etc.
      dosage: String,
      frequency: String,
      duration: String,
      instructions: String,
      remark: String
    }],
    
    // Advice and Follow-up
    advice: String,
    followUpDate: Date,
    followUpInstructions: String
  },
  
  // Workflow Status
  workflow: {
    registration: {
      status: { type: String, enum: ['pending', 'completed'], default: 'completed' },
      timestamp: { type: Date, default: Date.now },
      userId: mongoose.Schema.Types.ObjectId
    },
    consultation: {
      status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' },
      timestamp: Date,
      userId: mongoose.Schema.Types.ObjectId
    },
    investigation: {
      status: { type: String, enum: ['pending', 'in_progress', 'completed', 'not_required'], default: 'not_required' },
      timestamp: Date,
      userId: mongoose.Schema.Types.ObjectId
    },
    pharmacy: {
      status: { type: String, enum: ['pending', 'dispensed', 'not_required'], default: 'not_required' },
      timestamp: Date,
      userId: mongoose.Schema.Types.ObjectId
    },
    billing: {
      status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
      timestamp: Date,
      userId: mongoose.Schema.Types.ObjectId
    },
    discharge: {
      status: { type: String, enum: ['pending', 'completed', 'not_applicable'], default: 'not_applicable' },
      timestamp: Date,
      userId: mongoose.Schema.Types.ObjectId
    }
  },
  
  // Additional Information
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal',
    index: true
  },
  
  source: {
    type: String,
    enum: ['walk_in', 'appointment', 'emergency', 'referral', 'camp'],
    default: 'walk_in'
  },
  
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  
  // Notes and Comments
  notes: [{
    note: String,
    addedBy: {
      userId: mongoose.Schema.Types.ObjectId,
      userName: String,
      role: String
    },
    timestamp: { type: Date, default: Date.now }
  }],
  
  // Document References
  documents: [{
    documentType: {
      type: String,
      enum: ['prescription', 'lab_report', 'imaging', 'discharge_summary', 'consent_form', 'other']
    },
    fileName: String,
    filePath: String,
    uploadedBy: {
      userId: mongoose.Schema.Types.ObjectId,
      userName: String
    },
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  // Audit Trail
  createdBy: {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userName: { type: String, required: true },
    role: String
  },
  
  updatedBy: {
    userId: mongoose.Schema.Types.ObjectId,
    userName: String,
    role: String
  },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true, // Automatically manages createdAt and updatedAt
  versionKey: true // Keeps version key for optimistic locking
});

// Indexes for Performance
visitSchema.index({ visitDate: -1, patientId: 1 });
visitSchema.index({ 'patientInfo.uhid': 1 });
visitSchema.index({ 'patientInfo.mobileNo': 1 });
visitSchema.index({ visitNo: 1 }, { unique: true });
visitSchema.index({ status: 1, visitDate: -1 });
visitSchema.index({ 'visitingDoctor.doctorId': 1, visitDate: -1 });
visitSchema.index({ 'billing.paymentStatus': 1 });
visitSchema.index({ createdAt: -1 });

// Compound indexes for common queries
visitSchema.index({ patientId: 1, visitDate: -1 });
visitSchema.index({ visitType: 1, status: 1, visitDate: -1 });

// Text search index
visitSchema.index({
  'patientInfo.name': 'text',
  'patientInfo.uhid': 'text',
  'patientInfo.mobileNo': 'text',
  visitNo: 'text'
});

// Pre-save middleware to calculate billing amounts
visitSchema.pre('save', function(next) {
  if (this.isModified('services')) {
    let totalAmount = 0;
    
    this.services.forEach(service => {
      const serviceTotal = (service.rate * service.quantity) - service.discount;
      service.finalAmount = Math.max(0, serviceTotal);
      totalAmount += service.finalAmount;
    });
    
    this.billing.totalAmount = totalAmount;
    this.billing.finalAmount = totalAmount - this.billing.discountAmount + this.billing.taxAmount;
  }
  
  this.updatedAt = new Date();
  next();
});

// Virtual for visit age (days since visit)
visitSchema.virtual('visitAge').get(function() {
  return Math.floor((Date.now() - this.visitDate) / (1000 * 60 * 60 * 24));
});

// Virtual for total services count
visitSchema.virtual('totalServices').get(function() {
  return this.services ? this.services.length : 0;
});

// Instance method to add a note
visitSchema.methods.addNote = function(noteText, userId, userName, role) {
  this.notes.push({
    note: noteText,
    addedBy: {
      userId,
      userName,
      role
    }
  });
  return this.save();
};

// Instance method to update workflow status
visitSchema.methods.updateWorkflowStatus = function(stage, status, userId) {
  if (this.workflow[stage]) {
    this.workflow[stage].status = status;
    this.workflow[stage].timestamp = new Date();
    this.workflow[stage].userId = userId;
  }
  return this.save();
};

// Static method to generate visit number
visitSchema.statics.generateVisitNumber = async function() {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
  
  // Find the last visit number for today
  const lastVisit = await this.findOne({
    visitNo: { $regex: `^OPD-${dateStr}-` }
  }).sort({ visitNo: -1 });
  
  let sequence = 1;
  if (lastVisit) {
    const lastSequence = parseInt(lastVisit.visitNo.split('-')[2]);
    sequence = lastSequence + 1;
  }
  
  return `OPD-${dateStr}-${sequence.toString().padStart(3, '0')}`;
};

// Static method to get visit statistics
visitSchema.statics.getVisitStats = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        visitDate: {
          $gte: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          $lte: endDate || new Date()
        }
      }
    },
    {
      $group: {
        _id: null,
        totalVisits: { $sum: 1 },
        completedVisits: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        totalRevenue: { $sum: '$billing.finalAmount' },
        averageAmount: { $avg: '$billing.finalAmount' }
      }
    }
  ]);
};

module.exports = mongoose.model('Visit', visitSchema);

/* 
USAGE EXAMPLE:

// Create a new visit
const visit = new Visit({
  patientId: patientObjectId,
  patientInfo: {
    uhid: 'MH202502101',
    name: 'John Doe',
    fatherOrHusbandName: 'Father Name',
    mobileNo: '9876543210',
    age: '35 Years',
    gender: 'Male'
  },
  visitingDoctor: {
    doctorId: doctorObjectId,
    doctorName: 'Dr. Smith'
  },
  services: [
    {
      serviceId: serviceObjectId,
      serviceName: 'Consultation',
      serviceCode: 'CON001',
      rate: 500,
      quantity: 1,
      discount: 0
    }
  ],
  createdBy: {
    userId: userObjectId,
    userName: 'Reception Staff',
    role: 'receptionist'
  }
});

// Generate visit number
visit.visitNo = await Visit.generateVisitNumber();
await visit.save();

*/