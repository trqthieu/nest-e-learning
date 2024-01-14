import * as bcrypt from 'bcrypt';
export async function hashPassword(rawPassword: string): Promise<string> {
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(rawPassword, salt);
  return hash;
}

export async function checkPassword(
  rawPassword: string,
  hashPassword: string,
): Promise<boolean> {
  const isMatch = await bcrypt.compare(rawPassword, hashPassword);
  return isMatch;
}
