/**
 * Custom-scheme cold starts (e.g. funcup:///) parse to an empty path after Expo Router
 * strips a lone leading slash — which does not match the index route and shows Unmatched.
 * @see https://docs.expo.dev/router/advanced/native-intent/
 */
export function redirectSystemPath(event: { path: string; initial: boolean }): string {
  const { path, initial } = event;
  // #region agent log
  fetch('http://127.0.0.1:7312/ingest/93cbb72a-43f4-44b0-9ffe-9b704b108d1b', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'd329d9' },
    body: JSON.stringify({
      sessionId: 'd329d9',
      location: '+native-intent.tsx:redirectSystemPath',
      message: 'native path before rewrite',
      data: { initial, empty: !path?.trim(), len: path?.length ?? 0 },
      timestamp: Date.now(),
      hypothesisId: 'H1-empty-from-custom-scheme',
    }),
  }).catch(() => {});
  // #endregion

  try {
    const trimmed = typeof path === 'string' ? path.trim() : '';
    if (trimmed === '' || trimmed === '/') {
      // #region agent log
      fetch('http://127.0.0.1:7312/ingest/93cbb72a-43f4-44b0-9ffe-9b704b108d1b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'd329d9' },
        body: JSON.stringify({
          sessionId: 'd329d9',
          location: '+native-intent.tsx:redirectSystemPath',
          message: 'rewrote empty path to /',
          data: { initial },
          timestamp: Date.now(),
          hypothesisId: 'H1-empty-from-custom-scheme',
        }),
      }).catch(() => {});
      // #endregion
      return '/';
    }
    return path;
  } catch {
    return '/';
  }
}
