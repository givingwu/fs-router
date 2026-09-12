import { useState } from 'react';
import { useNavigation } from '@feoe/fs-router';

export default function Home() {
  const navigation = useNavigation();
  const [count, setCount] = useState(0);
  return <>
    <h1>Hello fs-router</h1>
    <p>A minimal client routing example with fictional data.</p>
    <button onClick={() => setCount(count + 1)}>Count: {count}</button>{' '}
    <button onClick={() => navigation.push('/users/:id', { id: '42' })}>Open user 42</button>
  </>;
}
