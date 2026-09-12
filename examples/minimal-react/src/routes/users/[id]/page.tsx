import { useLoaderData } from 'react-router-dom';
import type { loader } from './page.data';

export default function User() {
  const { user } = useLoaderData<typeof loader>();
  return <><h1>{user.name}</h1><p>User ID: {user.id}</p></>;
}
