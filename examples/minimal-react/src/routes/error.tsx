import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();
  return <main><h1>{isRouteErrorResponse(error) ? `Error ${error.status}` : 'Unexpected error'}</h1><Link to="/">Home</Link></main>;
}
