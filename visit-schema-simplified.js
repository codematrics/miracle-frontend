const mongoose = require('mongoose');

// Simplified Visit Schema that matches your frontend
const visitSchema = new mongoose.Schema({
  // Auto-generated visit number
  visitNo: {
    type: String,
    unique: true,
    index: true
  },
  
  visitDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  // Patient Information (required)
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
    index: true
  },
  
  // Patient snapshot for quick access
  patientInfo: {
    uhid: { type: String, required: true },
    name: { type: String, required: true },
    fatherOrHusbandName: String,
    mobileNo: { type: String, required: true },
    age: String,
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true }
  },
  
  // Visit Details
  refby: String, // Maps to your form field
  visitingdoctor: String, // Maps to your form field
  visittype: {
    type: String,
    enum: ['1', '2', '3'], // OPD, IPD, Camp as per your form
    required: true
  },
  visitdetail: String,
  
  // Medical Legal
  medicolegal: {
    type: String,
    enum: ['Yes', 'No'],
    required: true
  },
  
  // Mediclaim
  mediclaim_type: String,
  mediclaim_id: String,
  
  // Services
  services: [{
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    },
    serviceName: { type: String, required: true },
    serviceCode: { type: String, required: true },
    rate: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
    discount: { type: Number, default: 0 }
  }],
  
  // Status
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
    default: 'scheduled',
    index: true
  },
  
  // Billing
  totalAmount: { type: Number, default: 0 },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'partial'],
    default: 'pending'
  },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Auto-generate visit number before saving
visitSchema.pre('save', async function(next) {
  if (!this.visitNo) {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    
    // Find the last visit number for today
    const lastVisit = await this.constructor.findOne({
      visitNo: { $regex: `^OPD-${dateStr}-` }
    }).sort({ visitNo: -1 });
    
    let sequence = 1;
    if (lastVisit) {
      const lastSequence = parseInt(lastVisit.visitNo.split('-')[2]);
      sequence = lastSequence + 1;
    }
    
    this.visitNo = `OPD-${dateStr}-${sequence.toString().padStart(3, '0')}`;
  }
  
  // Calculate total amount
  if (this.isModified('services')) {
    this.totalAmount = this.services.reduce((total, service) => {
      return total + ((service.rate * service.quantity) - service.discount);
    }, 0);
  }
  
  this.updatedAt = new Date();
  next();
});

// Indexes
visitSchema.index({ visitDate: -1, patientId: 1 });
visitSchema.index({ 'patientInfo.uhid': 1 });
visitSchema.index({ visitNo: 1 }, { unique: true });
visitSchema.index({ status: 1, visitDate: -1 });

module.exports = mongoose.model('Visit', visitSchema);

/*
USAGE EXAMPLE:

const visit = new Visit({
  patientId: "689b85a9d9d0c2ad87826115", // From your patient data
  patientInfo: {
    uhid: "689b85a9d9d0c2ad87826115", // Using id as uhid if no separate uhid
    name: "John Doe",
    fatherOrHusbandName: "Robert Doe",
    mobileNo: "9876543210",
    age: "30 Year",
    gender: "Male" // Convert from 'M' to 'Male'
  },
  refby: "1", // Self
  visitingdoctor: "1", // Dr. Kailash Garg
  visittype: "1", // OPD
  visitdetail: "Regular checkup",
  medicolegal: "No",
  mediclaim_type: "1", // Not Applicable
  services: [
    {
      serviceId: service._id,
      serviceName: "Consultation Fees",
      serviceCode: "CON001",
      rate: 200,
      quantity: 1,
      discount: 0
    }
  ]
});

await visit.save();
*/