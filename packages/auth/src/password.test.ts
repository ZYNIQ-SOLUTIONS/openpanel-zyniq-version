import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPasswordHash } from './password';

describe('Password Utility', () => {
  it('should hash and verify passwords correctly', async () => {
    const password = 'test-password-123';
    const hash = await hashPassword(password);
    
    expect(hash).toBeDefined();
    expect(typeof hash).toBe('string');
    
    const isValid = await verifyPasswordHash(hash, password);
    expect(isValid).toBe(true);
    
    const isInvalid = await verifyPasswordHash(hash, 'wrong-password');
    expect(isInvalid).toBe(false);
  });

  it('should handle different runtimes (Node/Bun) transparently', async () => {
    const isBun = !!(globalThis as any).Bun;
    console.log(`Running test in ${isBun ? 'Bun' : 'Node.js'} runtime`);
    
    const password = 'runtime-check-password';
    const hash = await hashPassword(password);
    
    if (isBun) {
       // Bun's argon2id hashes typically start with $argon2id$
       expect(hash).toContain('$argon2id$');
    }
    
    expect(await verifyPasswordHash(hash, password)).toBe(true);
  });
});
