import configuration from 'src/configs/configuration';

export const jwtConstants = {
  // secret: configuration().jwtSecret,
  secret: 'jwtSecret',
};

export const BASE_URL = 'https://nest-e-learning.onrender.com';

export interface UserToken {
  id: number;
}
