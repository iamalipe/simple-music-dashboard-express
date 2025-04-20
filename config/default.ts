import 'dotenv/config';

export const BASIC_AUTH_USERNAME = process.env.BASIC_AUTH_USERNAME || 'admin';

export const BASIC_AUTH_PASSWORD =
  process.env.BASIC_AUTH_PASSWORD || 'password';

export const JWT_SECRET = process.env.JWT_SECRET || '';

export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || '';

export const JWT_EXPIRY = process.env.JWT_EXPIRY || '30min';

export const REFRESH_TOKEN_EXPIRY =
  process.env.REFRESH_TOKEN_EXPIRY || '30days';

export const METRICS_SERVER_PORT = process.env.METRICS_SERVER_PORT || 9100;

export const PORT = process.env.PORT || 3000;

export const WHITELISTED_DOMAINS = process.env.WHITELISTED_DOMAINS || '';

export const WHITELISTED_DOMAINS_ARRAY = WHITELISTED_DOMAINS.split(',') || [];
