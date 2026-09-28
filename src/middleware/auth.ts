import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { adminAuth } from '../lib/firebase-admin.ts';
import { DecodedIdToken } from 'firebase-admin/auth';
import { getOrCreateProfile, isAuthorizedAdmin } from '../db/users.ts';

const INNOVEXA_SECRET = process.env.INNOVEXA_AUTH_SECRET || 'innovexa_civic_platform_secure_token_secret_key_2026';

export interface InnovexaPayload {
  uid: string;
  email: string;
  name?: string;
  role: string;
  timestamp: number;
}

export function createInnovexaToken(payload: Omit<InnovexaPayload, 'timestamp'>): string {
  const fullPayload: InnovexaPayload = {
    ...payload,
    timestamp: Date.now(),
  };
  const data = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const hmac = crypto.createHmac('sha256', INNOVEXA_SECRET).update(data).digest('base64url');
  return `innovexa_${data}.${hmac}`;
}

export function verifyInnovexaToken(token: string): InnovexaPayload | null {
  if (!token || !token.startsWith('innovexa_')) return null;
  const raw = token.slice('innovexa_'.length);
  const parts = raw.split('.');
  if (parts.length !== 2) return null;
  const [data, signature] = parts;
  try {
    const expected = crypto.createHmac('sha256', INNOVEXA_SECRET).update(data).digest('base64url');
    if (signature.length !== expected.length) return null;
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      return null;
    }
    return JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
  } catch (err) {
    return null;
  }
}

export interface AuthRequest extends Request {
  user?: DecodedIdToken;
  profile?: any;
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }

  const token = authHeader.split('Bearer ')[1]?.trim();
  if (!token) {
    return res.status(401).json({ error: 'Invalid token format.' });
  }

  // 1. Check for INNOVEXA Session Token
  if (token.startsWith('innovexa_')) {
    const verified = verifyInnovexaToken(token);
    if (!verified) {
      return res.status(401).json({ error: 'Session expired or invalid INNOVEXA token.' });
    }
    req.user = {
      uid: verified.uid,
      email: verified.email,
      name: verified.name,
    } as any;

    const profile = await getOrCreateProfile(
      verified.uid,
      verified.email || '',
      verified.name || ''
    );
    req.profile = profile;
    return next();
  }

  // 2. Firebase ID Token Verification
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;

    // Attach profile and resolve server-side verified role
    const profile = await getOrCreateProfile(
      decodedToken.uid,
      decodedToken.email || '',
      decodedToken.name || ''
    );
    req.profile = profile;

    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return res.status(401).json({ error: 'Session expired or invalid. Please sign in again.' });
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split('Bearer ')[1]?.trim();
    if (token) {
      if (token.startsWith('innovexa_')) {
        const verified = verifyInnovexaToken(token);
        if (verified) {
          req.user = {
            uid: verified.uid,
            email: verified.email,
            name: verified.name,
          } as any;
          try {
            const profile = await getOrCreateProfile(
              verified.uid,
              verified.email || '',
              verified.name || ''
            );
            req.profile = profile;
          } catch {}
        }
        return next();
      }

      try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        req.user = decodedToken;
        const profile = await getOrCreateProfile(
          decodedToken.uid,
          decodedToken.email || '',
          decodedToken.name || ''
        );
        req.profile = profile;
      } catch (e) {
        // Silently continue for optional auth
      }
    }
  }
  next();
};

export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || !req.profile) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  const email = (req.user.email || '').trim().toLowerCase();
  const isAdmin = req.profile.role === 'admin' || (await isAuthorizedAdmin(email));

  if (!isAdmin) {
    return res.status(403).json({
      error: 'Access denied. You do not have municipal administrator privileges.',
    });
  }

  next();
};

export const requireWorkerOrAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || !req.profile) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  const role = req.profile.role;
  const email = (req.user.email || '').trim().toLowerCase();
  const isAdmin = role === 'admin' || (await isAuthorizedAdmin(email));

  if (!isAdmin && role !== 'worker' && role !== 'supervisor') {
    return res.status(403).json({
      error: 'Access denied. Field worker or administrator privileges required.',
    });
  }

  next();
};
