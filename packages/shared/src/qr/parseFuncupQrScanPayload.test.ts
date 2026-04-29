import { describe, expect, it } from 'vitest';

import { parseFuncupQrScanPayload } from './parseFuncupQrScanPayload';

const SAMPLE =
  '6f464b58-825a-4d95-9865-321a42873b81';

describe('parseFuncupQrScanPayload', () => {
  it('accepts bare public_hash (case-insensitive)', () => {
    expect(parseFuncupQrScanPayload(SAMPLE)).toBe(SAMPLE);
    expect(parseFuncupQrScanPayload(SAMPLE.toUpperCase())).toBe(SAMPLE);
  });

  it('parses http(s) URL with /q/{hash} including localhost and port', () => {
    expect(parseFuncupQrScanPayload(`http://127.0.0.1:3000/q/${SAMPLE}`)).toBe(SAMPLE);
    expect(parseFuncupQrScanPayload(`https://app.example.com/q/${SAMPLE}?x=1`)).toBe(SAMPLE);
  });

  it('parses funcup://q/{hash}', () => {
    expect(parseFuncupQrScanPayload(`funcup://q/${SAMPLE}`)).toBe(SAMPLE);
  });

  it('parses path-only /q/{hash}', () => {
    expect(parseFuncupQrScanPayload(`/q/${SAMPLE}`)).toBe(SAMPLE);
  });

  it('returns null for garbage', () => {
    expect(parseFuncupQrScanPayload('')).toBeNull();
    expect(parseFuncupQrScanPayload('https://evil.com/batch/111')).toBeNull();
    expect(parseFuncupQrScanPayload('not-a-uuid')).toBeNull();
  });
});
