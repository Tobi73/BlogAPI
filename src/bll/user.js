import jwt from 'jsonwebtoken';
import config from 'config3';
import { User } from './../model/index';
import { LogicException, Roles } from './../constants';

export const signUp = async (username, password, role = Roles.user) => {
  if (!username || !password) throw new LogicException('Invalid username or password');
  const user = await User.findOne({ username });
  if (user) throw new LogicException('User already exists');
  const newUser = new User({ username, password, role });
  await newUser.save();
};

export const login = async (username, password) => {
  if (!username || !password) throw new LogicException('Invalid username or password');
  const user = await User.findOne({ username });
  if (!user) throw new LogicException('User does not exists');
  const passMatches = await user.comparePassword(password);
  if (!passMatches) throw new LogicException('Wrong password', 403);
  const token = jwt.sign(user.toObject(), config.secret);
  return token;
};

// Create admin user (not for production)
signUp(config.adminCreds.username, config.adminCreds.password, Roles.admin);
