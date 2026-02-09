import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import User from '@models/User';
import dotenv from 'dotenv';

dotenv.config();

const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET as string,
};

passport.use(
    new JwtStrategy(options, async (jwt_payload, done) => {
        try {
            const user = await User.findOne({
                where: {
                    id: jwt_payload.id,
                    deletedAt: null,
                },
            });

            if (user) {
                return done(null, user);
            }
            return done(null, false);
        } catch (error) {
            return done(error, false);
        }
    })
);

export default passport;
