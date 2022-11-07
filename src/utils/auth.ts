import crypto from 'crypto';

export const hashPassword = (password: string, salt: string) => {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');
};

export const generateSalt = () => {
  return crypto.randomBytes(64).toString('base64');
};
