'use strict';

//src => auth folder => middleware folder =>

const { UsersModel } = require('../models');

module.exports = async (req, res, next) => {
    if (!req.headers.authorization) {
        next('Not Authorized!');
    } else {
        try {
            let authType = req.headers.authorization.split(' ')[0];
            if (authType === 'Bearer') {
                let token = req.headers.authorization.split(' ').pop();
                let validUser = UsersModel.authenticateBearer(token);
                if (validUser) {
                    req.user = validUser;
                    next();
                } else {
                    next('Send Bearer Auth String');
                }
            }
        } catch (e) {
            console.error(e);
            next(e);
        }
    }
};