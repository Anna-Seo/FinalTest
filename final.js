var mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;
var finalSchema = new Schema({
    "email": {
        "type": String,
        "unique": true
    },
    "password": String
});

let FinalUser;
module.exports = {
    startDB: function () {
        return new Promise(function (resolve, reject) {
            const db = mongoose.createConnection("mongodb+srv://aseo5:Chae.6375@senecaweb.9d26w9a.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
            db.on('error', (err) => {
                console.log("Cannot connect to DB");
                reject(err);
            })
            db.once('open', () => {
                console.log("DB connection successful.");
                FinalUser = db.model("finalUsers", finalSchema);
                resolve();
            })
        });
    },
    register: function (user) {
        return new Promise(function (resolve, reject) {
            if (/^\s*$/.test(user.email) || /^\s*$/.test(user.password)) {
                reject("Error: email or password cannot be empty.");
            }
            else {
                bcrypt.hash(user.password, 10)
                    .then(hash => {
                        user.password = hash;
                        let newUser = new FinalUser(user);
                        newUser.save().then(() => {
                            resolve(user);
                        }).catch(err => {
                            if (err.code == 11000) {
                                reject("Error: " + user.email + " already exists");
                            } else {
                                reject("Error: cannot create the user");
                            }
                        })
                    }).catch(() => {
                        reject("Error: cannot create the user");
                    });
            }
        });
    },
    signIn: function (user) {
        return new Promise(function (resolve, reject) {
            FinalUser.findOne({ email: user.email })
                .exec()
                .then((foundUser) => {
                    if (!foundUser) {
                        reject("Cannot find the user: " + user.email);
                    } else {
                        bcrypt.compare(user.password, foundUser.password).then((res) => {
                            if (res === true) {
                                resolve(foundUser);
                            } else {
                                reject("Incorrect password for user " + user.email);
                            }
                        });
                    }
                }).catch(() => {
                    reject("Cannot find the user: " + user.email);
                });
        })
    }
}