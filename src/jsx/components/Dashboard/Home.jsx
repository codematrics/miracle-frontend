import { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row, Spinner, Table } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import collectionAPIService from '../../../services/CollectionService';

const Collections = () => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [doctors, setDoctors] = useState([]);

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const fetchCollections = async () => {
    try {
      setLoading(true);

      const summaryRes = await collectionAPIService.getAllCollectionsSummary(fromDate, toDate);

      const doctorRes = await collectionAPIService.getDoctorCollections(fromDate, toDate);

      setSummary(summaryRes.data);
      setDoctors(doctorRes.data);
    } catch (error) {
      console.error('Failed to load collections', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  return (
    <>
      {/* HEADER */}
      <div className="form-head d-flex align-items-center mb-4">
        <div className="me-auto">
          <h2 className="text-black font-w600">Collections</h2>
          <p className="mb-0">OPD, IPD & Visit revenue summary</p>
        </div>
      </div>

      {/* FILTER */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="align-items-end">
            <Col md={4}>
              <Form.Label>From Date</Form.Label>
              <DatePicker
                selected={fromDate}
                onChange={date => setFromDate(date)}
                className="form-control"
                dateFormat="yyyy-MM-dd"
              />
            </Col>
            <Col md={4}>
              <Form.Label>To Date</Form.Label>
              <DatePicker
                selected={toDate}
                onChange={date => setToDate(date)}
                className="form-control"
                dateFormat="yyyy-MM-dd"
              />
            </Col>
            <Col md={4}>
              <Button className="w-100" variant="primary" onClick={fetchCollections}>
                Apply Filter
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          {/* SUMMARY CARDS */}
          {summary && (
            <Row className="mb-4">
              <Col xl={3} sm={6}>
                <Card className="stat-card">
                  <Card.Body>
                    <h5>OPD Collection</h5>
                    <h3>₹ {summary.opd.netAmount}</h3>
                    <small>Paid: ₹ {summary.opd.paidAmount}</small>
                  </Card.Body>
                </Card>
              </Col>

              <Col xl={3} sm={6}>
                <Card className="stat-card">
                  <Card.Body>
                    <h5>IPD Collection</h5>
                    <h3>₹ {summary.ipd.netAmount}</h3>
                    <small>Due: ₹ {summary.ipd.dueAmount}</small>
                  </Card.Body>
                </Card>
              </Col>

              <Col xl={3} sm={6}>
                <Card className="stat-card">
                  <Card.Body>
                    <h5>Visit Collection</h5>
                    <h3>₹ {summary.visit.totalAmount}</h3>
                  </Card.Body>
                </Card>
              </Col>

              <Col xl={3} sm={6}>
                <Card className="stat-card">
                  <Card.Body>
                    <h5>Grand Total</h5>
                    <h3>₹ {summary.grandTotal.netAmount}</h3>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* DOCTOR WISE TABLE */}
          <Card>
            <Card.Header>
              <h4 className="mb-0">Doctor-wise Collections</h4>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead className="thead-light">
                  <tr>
                    <th>Doctor</th>
                    <th>OPD</th>
                    <th>IPD</th>
                    <th>Visit</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map(doc => {
                    const opd = doc.collections.opd?.netAmount || 0;
                    const ipd = doc.collections.ipd?.netAmount || 0;
                    const visit = doc.collections.visit?.totalAmount || 0;

                    return (
                      <tr key={doc.doctorId}>
                        <td>{doc.doctorName}</td>
                        <td>₹ {opd}</td>
                        <td>₹ {ipd}</td>
                        <td>₹ {visit}</td>
                        <td className="fw-bold">₹ {opd + ipd + visit}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </>
      )}
    </>
  );
};

export default Collections;
