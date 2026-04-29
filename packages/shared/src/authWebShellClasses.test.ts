import { describe, expect, it } from 'vitest';

import { authWebShellClasses } from './authWebShellClasses';
import { visualTokens } from './visualTokens';

describe('authWebShellClasses vs visualTokens', () => {
  it('uses the same screen background as tokens', () => {
    expect(authWebShellClasses.page).toContain(visualTokens.colors.screenBackground);
  });

  it('uses the same error color as tokens', () => {
    expect(authWebShellClasses.err).toContain(visualTokens.colors.error);
  });
});
