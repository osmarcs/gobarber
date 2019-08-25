import User from '../models/User';

class UserController {
  async store(req, res) {
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
