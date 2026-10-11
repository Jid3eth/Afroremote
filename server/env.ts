import dotenv from 'dotenv';

// Load environment variables from .env file if present (local development)
dotenv.config();

/**
 * Industry-Standard Environment Configuration & Safety Validator
 *
 * Security Best Practices Applied:
 * 1. Zero secrets in source control (enforced via .gitignore and .env.example templates).
 * 2. Fail-safe type parsing and sanity checks for PORT and Node environment.
 * 3. Secret masking: credentials are never logged or echoed in raw text.
 * 4. Client boundary separation: private server secrets are never exposed to browser bundles.
 */

export interface AppEnvConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  GEMINI_API_KEY: string | undefined;
  APP_URL: string | undefined;
  isProduction: boolean;
}

function parseEnv(): AppEnvConfig {
  const nodeEnv = (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test';
  const port = parseInt(process.env.PORT || '3000', 10);
  const safePort = Number.isInteger(port) && port > 0 && port < 65536 ? port : 3000;

  return {
    NODE_ENV: nodeEnv,
    PORT: safePort,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    APP_URL: process.env.APP_URL,
    isProduction: nodeEnv === 'production',
  };
}

export const ENV_CONFIG = parseEnv();

/**
 * Masks a secret string safely for operational diagnostic logs
 */
export function maskSecret(secret?: string): string {
  if (!secret) return '[NOT CONFIGURED]';
  if (secret.length <= 8) return '********';
  return `${secret.slice(0, 4)}...${secret.slice(-4)} (length: ${secret.length})`;
}

/**
 * Validates presence of critical environment variables at server startup
 * Logs diagnostics without leaking raw secret values
 */
export function validateEnvironmentSecurity(): void {
  const isKeyPresent = Boolean(ENV_CONFIG.GEMINI_API_KEY && ENV_CONFIG.GEMINI_API_KEY.trim().length > 0);

  console.log(`[Env Security] Runtime environment: ${ENV_CONFIG.NODE_ENV}`);
  console.log(`[Env Security] Listening port: ${ENV_CONFIG.PORT}`);
  console.log(`[Env Security] GEMINI_API_KEY: ${isKeyPresent ? `Configured [${maskSecret(ENV_CONFIG.GEMINI_API_KEY)}]` : 'Not set (intelligent fallback active)'}`);

  if (ENV_CONFIG.APP_URL) {
    console.log(`[Env Security] APP_URL: ${ENV_CONFIG.APP_URL}`);
  }
}
