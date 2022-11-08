import bcrypt from 'bcrypt';

export const hashPassword = (password: string) => {
  const rounds = 12;

  return bcrypt.hash(password, rounds);
};
