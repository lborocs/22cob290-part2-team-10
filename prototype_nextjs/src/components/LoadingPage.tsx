import Spinner from 'react-bootstrap/Spinner';

export type LoadingPageProps = {
  dark?: boolean
};

export default function LoadingPage({ dark = true }: LoadingPageProps) {
  return (
    <div className={`flex-grow h-100 w-100 d-flex justify-content-center align-items-center ${dark ? 'bg-dark' : ''}`}>
      <Spinner
        animation="border"
        variant={dark ? 'light' : undefined}
        role="status"
        size="sm"
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}
