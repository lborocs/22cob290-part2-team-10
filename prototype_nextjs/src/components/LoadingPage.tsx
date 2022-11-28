import Spinner from 'react-bootstrap/Spinner';

export default function LoadingPage() {
  return (
    <main>
      <div className="vh-100 vw-100 d-flex justify-content-center align-items-center bg-dark">
        <Spinner
          animation="border"
          variant="light"
          role="status"
          size="sm"
        >
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    </main>
  );
}
