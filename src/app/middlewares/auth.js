import jwt from 'jsonwebtoken';
import { secret } from '../../config/auth';
import { promisify } from 'util';

export default async(req, res, next) => {
  const { authorization} = req.headers;

  if(!authorization) {
    return res.status(401).json({ error: 'Token not provide' })
  }

  try {
    const [,token] = authorization.split(' ');
    const decoded = await promisify(jwt.verify)(token, secret);
    req.userId = decoded.id;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' })
  }

}
