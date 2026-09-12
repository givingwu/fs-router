import type { useNavigation } from '@feoe/fs-router';

// Not imported by the app. Checked by tsc after the plugin generates declarations.
export function verifyNavigation(navigation: ReturnType<typeof useNavigation>) {
  navigation.push('/');
  navigation.push('/users/:id', { id: '42' });
  // @ts-expect-error Unknown route must be rejected.
  navigation.push('/unknown-route');
  // @ts-expect-error Required id must not be omitted.
  navigation.push('/users/:id');
  // @ts-expect-error Wrong parameter name must be rejected.
  navigation.push('/users/:id', { userId: '42' });
}
