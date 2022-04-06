import config from 'config';
import { decode, JwtPayload, sign } from 'jsonwebtoken';
import { User } from '@user/types';

const createAccessToken = (
  user: User,
  expiresIn: string | number = '60m',
): string => {
  return sign(
    { userId: user.id },
    config.get('jwtConfig.ACCESS_TOKEN_SECRET'),
    { expiresIn },
  );
};

const createRefreshToken = (user: User): string => {
  return sign(
    { userId: user.id },
    config.get('jwtConfig.REFRESH_TOKEN_SECRET'),
    { expiresIn: '1d' },
  );
};

const authChecker = ({ context }: JwtPayload): boolean => {
  const authorization = context.req.headers['authorization'];
  const token = authorization?.split(' ')[1];

  if (!authorization) {
    return false;
  }

  const { exp } = decode(token) as JwtPayload;

  return Date.now() < Number(exp) * 1000;
};

export { createAccessToken, createRefreshToken, authChecker };
