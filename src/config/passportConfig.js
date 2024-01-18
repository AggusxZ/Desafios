const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user.model');

const configurePassport = () => {
    passport.use(new LocalStrategy(
        { usernameField: 'email' },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ email });

                if (!user) {
                    return done(null, false, { message: 'Usuario no encontrado' });
                }

                const passwordMatch = await bcrypt.compare(password, user.password);

                if (!passwordMatch) {
                    return done(null, false, { message: 'Contraseña incorrecta' });
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.use(new GitHubStrategy({
        clientID: 'Iv1.9938af0a2b205cfc',
        clientSecret: '73f7e36d0d9f3642afe4fddff2034438625c5942',
        callbackURL: 'http://localhost:8080/auth/github/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
                return done(null, user);
            } else {
                const newUser = new User({
                    email: profile.emails[0].value,
                    name: profile.displayName,
                });

                await newUser.save();

                return done(null, newUser);
            }
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    });
};

module.exports = configurePassport;





