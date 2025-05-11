const bcrypt = require('bcryptjs');
const { users } = require('../config/database');

const ROLES = {
    ADMIN: 'ADMIN',
    USER: 'USER'
};

class User {
    static async create(userData) {
        try {
            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userData.password, salt);

            const user = {
                email: userData.email,
                password: hashedPassword,
                name: userData.name,
                role: userData.role || ROLES.USER, // Default to USER if role not specified
                createdAt: new Date()
            };

            return new Promise((resolve, reject) => {
                users.insert(user, (err, newUser) => {
                    if (err) reject(err);
                    resolve(newUser);
                });
            });
        } catch (error) {
            throw error;
        }
    }

    static async findByEmail(email) {
        return new Promise((resolve, reject) => {
            users.findOne({ email }, (err, user) => {
                if (err) reject(err);
                resolve(user);
            });
        });
    }

    static async validatePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    static get ROLES() {
        return ROLES;
    }
}

module.exports = User; 