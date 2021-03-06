import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/User';
import { secret, expiresIn } from '../../config/auth';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'fail validation'
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({ error: 'user not found' });
    }
    if (!(await user.checkPassword(password))) {
      res.status(401).json({ error: 'password incorrent' });
    }

    const { id, name } = user;
    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, secret, {
        expiresIn: expiresIn,
      }),
    });
  }
}

export default new SessionController();
