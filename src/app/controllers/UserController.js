import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'fail validation'
      });
    }

    const userExists = await User.findOne({
      where: {
        email: req.body.email,
      }
    });

    if(userExists) {
      res.status(400).json({ error: 'User already exists'});
    }

    const user = await User.create(req.body);
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      provider: user.provider,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string().min(6).when('oldPassword', (oldPassword, field) =>
        oldPassword ? field.required() : field,
      ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field,
      )
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'fail validation'
      });
    }

    const { email, password, oldPassword = '' } = req.body;
    const user = await User.findByPk(req.userId);
    if (email !== user.email) {
      const userExists = await User.findOne({
        where: {
          email,
        }
      });

      if(userExists) {
        res.status(400).json({ error: 'User already exists'});
      }
    }

    if((oldPassword || password) && !(await user.checkPassword(oldPassword))) {
      res.status(400).json({ error: 'Passowrd does not match'});
    }

    const { id, name, provider } = await user.update(req.body)
    return res.json({ id, name, email, provider })
  }
}

export default new UserController();
