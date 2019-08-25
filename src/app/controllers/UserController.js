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
}

export default new UserController();
