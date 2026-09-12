import type { LoaderFunctionArgs } from 'react-router-dom';

export function loader({ params }: LoaderFunctionArgs) {
  if (params.id === 'missing') throw new Response('User not found', { status: 404 });
  return { user: { id: params.id ?? 'unknown', name: 'Demo User' } };
}
