'use strict';

// within user-model.js

const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET || 'ThisIsMySecret';

const userSchema = (sequelize, DataTypes) => {
    const user = sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        token: {
            type: DataTypes.VIRTUAL,
            get() {// a method that 'gets' called on 'read'
                return jwt.sign({ username: this.username }, SECRET, { expiresIn: 1000 * 60 * 60 * 24 & 7 });
            },
            set() {// a method that runs when set with '='
                return jwt.sign({ username: this.username }, SECRET, { expiresIn: 1000 * 60 * 60 * 24 & 7 });
            }
        },
    });

    user.authenticateBearer = async (token) => {
        try {
            let payload = jwt.verify(token, SECRET);
            const user = await this.findOne({ where: { username: payload.username } })
            if (user) {
                return user;
            } else {
                return 'No User Found'
            }
        } catch (e) {
            console.error(e);
            return e;
        }
    };

    return user;

};

module.exports = userSchema;

//----------------------------------------------------------------------------

//within server.js

//at the top
const bearerAuth = require('./auth/middleware/bearer');

//around line 22
app.get('/users', bearerAuth, async (req, res, next) => {
    console.log('from the user get route', req.user);
    let users = await UserModel.findAll();
    let payload = {
        results: users,
    }
    res.status(200).send(payload);
});