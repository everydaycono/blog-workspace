// bcryptjs

import * as bcrypt from 'bcrypt';

export const passwordHash = (password: string) => {
  return bcrypt.hashSync(password, 11);
};
