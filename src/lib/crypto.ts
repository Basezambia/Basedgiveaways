import crypto from 'crypto';

/**
 * Generate a cryptographically secure winner selection using blockchain hash
 */
export function selectWinnerWithBlockchainHash(
  participants: Array<{ id: string; walletAddress: string; entryCount: number }>,
  blockHash: string,
  campaignId: string
): { winnerId: string; winnerAddress: string; selectionHash: string } {
  if (participants.length === 0) {
    throw new Error('No participants available for winner selection');
  }

  // Create a deterministic seed using block hash and campaign ID
  const seed = crypto
    .createHash('sha256')
    .update(blockHash + campaignId)
    .digest('hex');

  // Create weighted array based on entry counts
  const weightedParticipants: string[] = [];
  participants.forEach(participant => {
    for (let i = 0; i < participant.entryCount; i++) {
      weightedParticipants.push(participant.id);
    }
  });

  // Use the seed to generate a deterministic random index
  const seedNumber = parseInt(seed.substring(0, 8), 16);
  const winnerIndex = seedNumber % weightedParticipants.length;
  const winnerId = weightedParticipants[winnerIndex];

  const winner = participants.find(p => p.id === winnerId);
  if (!winner) {
    throw new Error('Winner not found in participants list');
  }

  // Generate selection hash for verification
  const selectionHash = crypto
    .createHash('sha256')
    .update(`${blockHash}-${campaignId}-${winnerId}-${Date.now()}`)
    .digest('hex');

  return {
    winnerId: winner.id,
    winnerAddress: winner.walletAddress,
    selectionHash
  };
}

/**
 * Generate verification hash for entry validation
 */
export function generateVerificationHash(
  walletAddress: string,
  email: string,
  campaignId: string,
  timestamp: number
): string {
  return crypto
    .createHash('sha256')
    .update(`${walletAddress}-${email}-${campaignId}-${timestamp}`)
    .digest('hex');
}

/**
 * Verify entry hash
 */
export function verifyEntryHash(
  walletAddress: string,
  email: string,
  campaignId: string,
  timestamp: number,
  hash: string
): boolean {
  const expectedHash = generateVerificationHash(walletAddress, email, campaignId, timestamp);
  return expectedHash === hash;
}

/**
 * Generate secure random string for admin tokens
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Hash password for admin authentication
 */
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const actualSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, actualSalt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt: actualSalt };
}

/**
 * Verify password against hash
 */
export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const { hash: computedHash } = hashPassword(password, salt);
  return computedHash === hash;
}