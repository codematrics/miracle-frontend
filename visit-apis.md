# Visit Management APIs

## 🏥 **Complete Visit API Documentation**

### Base URL: `/api/visits`

---

## 📋 **1. CREATE VISIT**
### `POST /api/visits`

**Request Body:**
```json
{
  "patientId": "patient_mongodb_id",
  "visitType": "OPD",
  "visitDescription": "Regular checkup",
  "referredBy": {
    "doctorId": "doctor_id_or_null",
    "doctorName": "Dr. Smith",
    "referenceType": "doctor"
  },
  "visitingDoctor": {
    "doctorId": "visiting_doctor_id", 
    "doctorName": "Dr. Johnson",
    "department": "Cardiology",
    "specialization": "MD Cardiology"
  },
  "medicoLegal": false,
  "mediclaim": {
    "type": "Ayushman",
    "policyNumber": "POL123456",
    "policyId": "ID789"
  },
  "services": [
    {
      "serviceId": "service_mongodb_id",
      "serviceName": "Consultation Fees",
      "serviceCode": "CON001",
      "rate": 500,
      "category": "consultation",
      "quantity": 1,
      "discount": 0
    }
  ],
  "priority": "normal",
  "source": "walk_in"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Visit created successfully",
  "data": {
    "_id": "visit_mongodb_id",
    "visitNo": "OPD-20250113-001",
    "visitDate": "2025-01-13T10:30:00Z",
    "patientInfo": {
      "uhid": "MH202502101",
      "name": "John Doe",
      "age": "35 Years",
      "gender": "Male"
    },
    "status": "scheduled",
    "billing": {
      "totalAmount": 500,
      "finalAmount": 500,
      "paymentStatus": "pending"
    }
  }
}
```

---

## 📖 **2. GET ALL VISITS**
### `GET /api/visits`

**Query Parameters:**
```
?page=1&limit=10&patientId=xxx&doctorId=xxx&status=scheduled&visitType=OPD&startDate=2025-01-01&endDate=2025-01-31&search=john
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "visit_id",
      "visitNo": "OPD-20250113-001",
      "visitDate": "2025-01-13T10:30:00Z",
      "status": "scheduled",
      "patientInfo": {
        "uhid": "MH202502101",
        "name": "John Doe",
        "mobileNo": "9876543210"
      },
      "visitingDoctor": {
        "doctorName": "Dr. Johnson"
      },
      "billing": {
        "finalAmount": 500,
        "paymentStatus": "pending"
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "total": 50,
    "limit": 10
  }
}
```

---

## 🔍 **3. GET SINGLE VISIT**
### `GET /api/visits/:id`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "visit_id",
    "visitNo": "OPD-20250113-001",
    "visitDate": "2025-01-13T10:30:00Z",
    "status": "scheduled",
    "patientInfo": {
      "uhid": "MH202502101",
      "name": "John Doe",
      "fatherOrHusbandName": "Father Name",
      "mobileNo": "9876543210",
      "age": "35 Years",
      "gender": "Male"
    },
    "visitingDoctor": {
      "doctorId": "doctor_id",
      "doctorName": "Dr. Johnson",
      "department": "Cardiology"
    },
    "services": [
      {
        "serviceId": "service_id",
        "serviceName": "Consultation Fees",
        "serviceCode": "CON001",
        "rate": 500,
        "finalAmount": 500
      }
    ],
    "billing": {
      "totalAmount": 500,
      "finalAmount": 500,
      "paymentStatus": "pending"
    },
    "workflow": {
      "registration": { "status": "completed" },
      "consultation": { "status": "pending" },
      "billing": { "status": "pending" }
    }
  }
}
```

---

## ✏️ **4. UPDATE VISIT**
### `PUT /api/visits/:id`

**Request Body:**
```json
{
  "status": "in_progress",
  "clinical": {
    "complaints": [
      {
        "complaint": "Chest pain",
        "duration": "2 days",
        "severity": "moderate"
      }
    ],
    "vitals": {
      "temperature": "98.6°F",
      "bloodPressure": "120/80",
      "pulse": "72",
      "weight": "70 kg"
    },
    "provisionalDiagnosis": "Hypertension"
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Visit updated successfully",
  "data": {
    "_id": "visit_id",
    "status": "in_progress",
    "clinical": {
      "complaints": [
        {
          "complaint": "Chest pain",
          "duration": "2 days",
          "severity": "moderate"
        }
      ]
    }
  }
}
```

---

## 🗑️ **5. DELETE VISIT**
### `DELETE /api/visits/:id`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Visit deleted successfully"
}
```

---

## 📊 **6. VISIT STATISTICS**
### `GET /api/visits/statistics`

**Query Parameters:**
```
?startDate=2025-01-01&endDate=2025-01-31&doctorId=xxx
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "totalVisits": 150,
    "completedVisits": 120,
    "pendingVisits": 25,
    "cancelledVisits": 5,
    "totalRevenue": 75000,
    "averageVisitValue": 500,
    "visitsByType": {
      "OPD": 140,
      "Emergency": 10
    },
    "visitsByStatus": {
      "completed": 120,
      "scheduled": 20,
      "in_progress": 5,
      "cancelled": 5
    }
  }
}
```

---

## 👤 **7. GET PATIENT VISITS**
### `GET /api/visits/patient/:patientId`

**Query Parameters:**
```
?page=1&limit=10&status=completed
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "visit_id",
      "visitNo": "OPD-20250113-001",
      "visitDate": "2025-01-13T10:30:00Z",
      "status": "completed",
      "visitingDoctor": {
        "doctorName": "Dr. Johnson"
      },
      "billing": {
        "finalAmount": 500
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "total": 25
  }
}
```

---

## 👨‍⚕️ **8. GET DOCTOR VISITS**
### `GET /api/visits/doctor/:doctorId`

**Query Parameters:**
```
?page=1&limit=10&date=2025-01-13&status=scheduled
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "visit_id",
      "visitNo": "OPD-20250113-001",
      "visitDate": "2025-01-13T10:30:00Z",
      "patientInfo": {
        "name": "John Doe",
        "uhid": "MH202502101",
        "age": "35 Years"
      },
      "status": "scheduled"
    }
  ]
}
```

---

## 🔄 **9. UPDATE WORKFLOW STATUS**
### `PATCH /api/visits/:id/workflow`

**Request Body:**
```json
{
  "stage": "consultation",
  "status": "completed"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Workflow status updated successfully",
  "data": {
    "workflow": {
      "consultation": {
        "status": "completed",
        "timestamp": "2025-01-13T11:30:00Z"
      }
    }
  }
}
```

---

## 💰 **10. UPDATE BILLING STATUS**
### `PATCH /api/visits/:id/billing`

**Request Body:**
```json
{
  "paymentStatus": "paid",
  "paymentMethod": "cash",
  "discountAmount": 50,
  "taxAmount": 25
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Billing updated successfully",
  "data": {
    "billing": {
      "totalAmount": 500,
      "discountAmount": 50,
      "taxAmount": 25,
      "finalAmount": 475,
      "paymentStatus": "paid",
      "paymentMethod": "cash"
    }
  }
}
```

---

## 📝 **11. ADD VISIT NOTE**
### `POST /api/visits/:id/notes`

**Request Body:**
```json
{
  "note": "Patient responded well to treatment"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Note added successfully",
  "data": {
    "note": "Patient responded well to treatment",
    "addedBy": {
      "userName": "Dr. Smith",
      "role": "doctor"
    },
    "timestamp": "2025-01-13T12:00:00Z"
  }
}
```

---

## 🔍 **12. SEARCH VISITS**
### `GET /api/visits/search`

**Query Parameters:**
```
?q=john&type=patient_name&limit=10
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "visit_id",
      "visitNo": "OPD-20250113-001",
      "patientInfo": {
        "name": "John Doe",
        "uhid": "MH202502101"
      },
      "visitDate": "2025-01-13T10:30:00Z"
    }
  ]
}
```

---

## 🚨 **Error Responses**

### Validation Error (400):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "patientId",
      "message": "Patient ID is required"
    }
  ]
}
```

### Not Found (404):
```json
{
  "success": false,
  "message": "Visit not found"
}
```

### Server Error (500):
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 🔐 **Authentication & Authorization**

All endpoints require authentication. Include JWT token in header:
```
Authorization: Bearer <jwt_token>
```

**Role-based Access:**
- **Reception**: Create, Read, Update visits
- **Doctor**: Read, Update clinical data
- **Admin**: Full access
- **Nurse**: Read, Update workflow status

---

## 📊 **Database Indexes Required**

```javascript
// Performance indexes
db.visits.createIndex({ "visitDate": -1, "patientId": 1 })
db.visits.createIndex({ "patientInfo.uhid": 1 })
db.visits.createIndex({ "visitNo": 1 }, { unique: true })
db.visits.createIndex({ "status": 1, "visitDate": -1 })
db.visits.createIndex({ "visitingDoctor.doctorId": 1, "visitDate": -1 })

// Text search index
db.visits.createIndex({
  "patientInfo.name": "text",
  "patientInfo.uhid": "text",
  "visitNo": "text"
})
```