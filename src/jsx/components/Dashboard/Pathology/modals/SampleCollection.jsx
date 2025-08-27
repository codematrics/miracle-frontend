import { useEffect, useState } from 'react';
import { Button, Form, Modal, Table } from 'react-bootstrap';

import { ORDER_STATUS } from '../../../../../constants/enums';
import usePathologyAPI from '../../../../../hooks/usePathologyAPI';

const SampleCollection = ({
  show,
  onHide,
  selectedTestOrder,
  setSelectedTests,
  onCollectTests,
  selectedTests,
}) => {
  const [samples, setSamples] = useState([]);
  const { fetchSampleCollection } = usePathologyAPI();

  const loadSamples = async () => {
    if (!selectedTestOrder?.labOrderId) return;
    const sampleData = await fetchSampleCollection(selectedTestOrder.labOrderId);
    setSamples(sampleData);
  };

  useEffect(() => {
    loadSamples();
  }, [selectedTestOrder]);

  if (!selectedTestOrder) {
    return;
  }

  console.log(selectedTests);

  return (
    <Modal show={show} onHide={onHide} size="xl" centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Lab - {selectedTestOrder?.labOrder?.accessionNo}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedTestOrder && (
          <div className="mb-3">
            <strong>Patient:</strong> {selectedTestOrder.patient?.name} |<strong> UHID:</strong>{' '}
            {selectedTestOrder.patient?.uhid} |<strong> Visit:</strong>{' '}
            {selectedTestOrder.visit?.code || 'N/A'} |<strong> Order Date:</strong>{' '}
            {new Date(selectedTestOrder?.labOrder?.orderDate).toLocaleDateString()}
          </div>
        )}
      </Modal.Body>
      <Modal.Body>
        <Table striped bordered responsive>
          <thead>
            <tr>
              <th width="50">Select</th>
              <th>Report Name</th>
              <th>Test Name</th>
              <th>Sample Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(samples || {})?.map(sample => (
              <tr key={sample}>
                <td>
                  <Form.Check
                    type="checkbox"
                    checked={selectedTestOrder?.collectedSamples?.includes(sample)}
                    disabled={!(selectedTestOrder.status === ORDER_STATUS.PENDING)}
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedTests([...selectedTests, sample]);
                      } else {
                        setSelectedTests(selectedTests.filter(name => name !== sample));
                      }
                    }}
                  />
                </td>
                <td>{[...samples[sample].map(report => report.reportType)].join('/')}</td>
                <td>{samples[sample].map(report => report.parameterName).join('/')}</td>
                <td>{sample}</td>
                <td>
                  {selectedTestOrder?.collectedSamples?.includes(sample) ? 'Collected' : 'Pending'}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={onCollectTests} disabled={selectedTests.length === 0}>
          Collect Selected
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SampleCollection;
