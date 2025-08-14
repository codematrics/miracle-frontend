import { Spinner } from 'react-bootstrap';

import { useGlobalLoading } from '../../store/hooks';

const GlobalLoading = () => {
  const isLoading = useGlobalLoading();

  if (!isLoading) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 9999,
        backdropFilter: 'blur(2px)',
      }}
    >
      <div className="text-center">
        <Spinner animation="border" variant="primary" className="mb-3" />
        <div className="text-muted">Loading...</div>
      </div>
    </div>
  );
};

export default GlobalLoading;
