import passport from 'passport';
import jwt from 'passport-jwt';
import { Types } from 'mongoose';
import config from 'config3';
import { User } from './model';

const params = {
  secretOrKey: config.secret,
  jwtFromRequest: jwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
};

passport.use(new jwt.Strategy(params, async (payload, done) => {
  const user = await User.findOne({ _id: new Types.ObjectId(payload._id) });
  if (!user) return done(null, false);
  return done(null, user);
}));

export const authenticate = (req, res, next) => {
  passport.authenticate('jwt', (err, user, info) => {
    if (err) return next(err);
    if (!user) return next();
    req.user = user;
    return next();
  })(req, res, next);
};

export const ensureAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) return res.status(403).end();
  return next();
};

export const checkRights = roles => (req, res, next) => {
  if (!(roles.indexOf(req.user.role) > -1)) return res.status(403).end();
  return next();
};

