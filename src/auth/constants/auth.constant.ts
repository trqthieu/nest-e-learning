import configuration from 'src/configs/configuration';

export const jwtConstants = {
  // secret: configuration().jwtSecret,
  secret: 'jwtSecret',
};

export interface UserToken {
  id: number;
}
