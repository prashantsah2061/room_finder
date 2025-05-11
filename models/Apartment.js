const { apartments } = require('../config/database');

class Apartment {
    static async create(apartmentData) {
        const apartment = {
            ...apartmentData,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        return new Promise((resolve, reject) => {
            apartments.insert(apartment, (err, newApartment) => {
                if (err) reject(err);
                resolve(newApartment);
            });
        });
    }

    static async findAll(query = {}) {
        return new Promise((resolve, reject) => {
            apartments.find(query, (err, apartments) => {
                if (err) reject(err);
                resolve(apartments);
            });
        });
    }

    static async findById(id) {
        return new Promise((resolve, reject) => {
            apartments.findOne({ _id: id }, (err, apartment) => {
                if (err) reject(err);
                resolve(apartment);
            });
        });
    }

    static async update(id, updateData) {
        const update = {
            ...updateData,
            updatedAt: new Date()
        };

        return new Promise((resolve, reject) => {
            apartments.update(
                { _id: id },
                { $set: update },
                { returnUpdatedDocs: true },
                (err, numAffected, affectedDocuments) => {
                    if (err) reject(err);
                    resolve(affectedDocuments);
                }
            );
        });
    }

    static async delete(id) {
        return new Promise((resolve, reject) => {
            apartments.remove({ _id: id }, (err, n) => {
                if (err) reject(err);
                resolve(n);
            });
        });
    }
}

module.exports = Apartment; 