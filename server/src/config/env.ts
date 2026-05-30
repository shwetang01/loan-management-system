const REQUIRED_ENV_VARS = [
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
] as const;

export const validateEnv = (): void => {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
        'Copy server/.env.example to server/.env and fill in the values.'
    );
  }
};

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI as string,
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  maxFileSizeMb: Number(process.env.MAX_FILE_SIZE_MB) || 5,
  clientOrigin: process.env.CLIENT_URL || 'http://localhost:3000',
} as const;
