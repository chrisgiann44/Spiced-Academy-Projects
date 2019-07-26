// REQUIERMENTS //
// express makes https requests
const express = require("express");
const app = express();
// we need to import it to test.js file
exports.app = app;
app.use(express.static("./public"));

//  bodyParser makes sure that we can parse the incoming req bodies
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// handlebars in order to create web pages quicker
const hb = require("express-handlebars");
app.engine("handlebars", hb());
app.set("view engine", "handlebars");

//  our functions to speak to our db
const db = require("./utils/db");

//  hashing password
const bc = require("./utils/bc");

//  setting and reading cookies
const cookieSession = require("cookie-session");
app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 1
    })
);

// requests only coming from our signature (should be after body Parser and coockie Session)
const csurf = require("csurf");
app.use(csurf());
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    res.setHeader("X-FRAME-OPTION", "DENY");
    next();
});

// Handling requests and reponses

app.get("/", (req, res) => {
    res.redirect("/registration");
});

// REGISTRATION PAGE -------------------------------------------//

app.get("/registration", (req, res) => {
    if (req.session.userId == undefined) {
        res.render("registration", {
            layout: "main"
        });
    } else {
        res.redirect("/petition");
    }
});

app.post("/registration", (req, res) => {
    bc.hashPassword(req.body.password).then(hpass => {
        db.addUser(req.body.name, req.body.surname, req.body.email, hpass)
            .then(result => {
                req.session.userId = result.rows[0].id;
                req.session.name = result.rows[0].name;
                req.session.surname = result.rows[0].surname;
                req.session.email = result.rows[0].email;
                res.redirect("/profile");
            })
            .catch(err => {
                console.log(err);
                res.render("registration", {
                    layout: "main",
                    error: "error"
                });
            });
    });
});

// PROFILE PAGE -------------------------------------------//

app.get("/profile", (req, res) => {
    res.render("profile", {
        layout: "main",
        name: req.session.name,
        id: req.session.userId
    });
});

app.post("/profile", (req, res) => {
    let homepage = req.body.homepage;
    let age = req.body.age;
    let city = req.body.city;

    city = city != "" ? city : null;
    homepage =
        homepage.startsWith("https://") ||
        homepage.startsWith("https://") ||
        homepage.startsWith("//") ||
        homepage.startsWith("www")
            ? homepage
            : null;

    if (!req.body.age && !homepage && !req.body.city) {
        res.redirect("/petition");
    } else {
        req.session.age = age;
        req.session.city = city;
        req.session.homepage = homepage;
        db.addProf(age, city, homepage, req.session.userId)
            .then(() => res.redirect("/petition"))
            .catch(err => console.log(err));
    }
});

// LOGIN PAGE -------------------------------------------//

app.get("/login", (req, res) => {
    if (req.session.userId == undefined) {
        res.render("login", {
            layout: "main"
        });
    } else {
        res.redirect("/petition");
    }
});

app.post("/login", (req, res) => {
    db.findUser(req.body.email)
        .then(result => {
            return [
                result.rows[0].name,
                result.rows[0].password,
                result.rows[0].id,
                result.rows[0].surname,
                result.rows[0].email,
                result.rows[0].age,
                result.rows[0].city,
                result.rows[0].homepage
            ];
        })
        .then(data => {
            db.findSig(data[2]).then(signUrl => {
                bc.checkPassword(req.body.password, data[1]).then(doesMatch => {
                    if (!doesMatch) {
                        res.render("login", {
                            layout: "main",
                            error: "error"
                        });
                    } else {
                        if (doesMatch && signUrl.rows.length == 0) {
                            req.session.surname = data[3];
                            req.session.password = data[1];
                            req.session.email = data[4];
                            req.session.name = data[0];
                            req.session.userId = data[2];
                            req.session.age = data[5];
                            req.session.city = data[6];
                            req.session.homepage = data[7];
                            res.redirect("/petition");
                        } else {
                            req.session.password = data[1];
                            req.session.signatureId = signUrl.rows[0].id;
                            req.session.surname = data[3];
                            req.session.email = data[4];
                            req.session.name = data[0];
                            req.session.userId = data[2];
                            req.session.age = data[5];
                            req.session.city = data[6];
                            req.session.homepage = data[7];
                            res.redirect("/petition/signed");
                        }
                    }
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.render("login", {
                layout: "main",
                error: "error"
            });
        });
});

// PETITION PAGE -------------------------------------------//

app.get("/petition", (req, res) => {
    if (req.session.userId) {
        db.findSig(req.session.userId).then(data => {
            if (data.rows.length != 0) {
                res.redirect("/petition/signed");
            } else {
                res.render("petition", {
                    layout: "main",
                    username: req.session.name,
                    vis: "vis"
                });
            }
        });
    } else {
        res.redirect("/registration");
    }
});

app.get("/petition/signed", (req, res) => {
    if (req.session.signatureId) {
        db.findNames().then(maxid => {
            let totalSigners = maxid.rows.length;
            db.findSig(req.session.userId).then(imageURL => {
                res.render("signed", {
                    layout: "main",
                    name: req.session.name,
                    url: imageURL.rows[0].signature,
                    num: totalSigners,
                    vis: "vis"
                });
            });
        });
    } else {
        res.redirect("/petition");
    }
});

app.post("/petition/signed", (req, res) => {
    db.deleteSig(req.session.userId).then(() => {
        req.session.signatureId = null;
        res.redirect("/petition");
    });
});

app.get("/petition/signers", (req, res) => {
    if (req.session.signatureId) {
        let signers = [];
        db.findNames()
            .then(result => {
                for (var i = 0; i < result.rows.length; i++) {
                    var obj = {};
                    obj.name = result.rows[i].name;
                    obj.surname = result.rows[i].surname;
                    obj.age = result.rows[i].age;
                    obj.city = result.rows[i].city;
                    obj.homepage = result.rows[i].homepage;
                    signers.push(obj);
                    obj = {};
                }
                return signers;
            })
            .then(() => {
                let totalSigners = signers.length;
                res.render("signers", {
                    layout: "main",
                    signers: signers,
                    totalSigners: totalSigners,
                    vis: "vis"
                });
            })
            .catch(err => console.log(err));
    } else {
        res.redirect("/petition");
    }
});

app.get("/petition/signers/:city", (req, res) => {
    if (req.session.signatureId) {
        let reqCity = req.params.city;
        let signers = [];
        db.findNames()
            .then(result => {
                for (let i = 0; i < result.rows.length; i++) {
                    if (result.rows[i].city != null) {
                        if (
                            result.rows[i].city.toLowerCase() ==
                            reqCity.toLowerCase()
                        ) {
                            var obj = {};
                            obj.name = result.rows[i].name;
                            obj.surname = result.rows[i].surname;
                            obj.age = result.rows[i].age;
                            obj.city = result.rows[i].city;
                            obj.homepage = result.rows[i].homepage;
                            signers.push(obj);
                            obj = {};
                        }
                    }
                }
                return signers;
            })
            .then(signers => {
                let totalSigners = signers.length;
                res.render("signers", {
                    layout: "main",
                    signers: signers,
                    totalSigners: totalSigners,
                    city: reqCity,
                    vis: "vis"
                });
            })
            .catch(err => console.log(err));
    } else {
        res.redirect("/petition");
    }
});

app.post("/petition", (req, res) => {
    if (req.body.signature) {
        db.addSig(req.session.userId, req.body.signature)
            .then(result => {
                req.session.signatureId = result.rows[0].id;
                res.redirect("/petition/signed");
            })
            .catch(err => console.log(err));
    } else {
        res.render("petition", {
            layout: "main",
            error: "error",
            username: req.session.name
        });
    }
});

// EDIT PROFILE PAGE -------------------------------------------//

app.get("/edit", (req, res) => {
    res.render("edit", {
        layout: "main",
        name: req.session.name,
        surname: req.session.surname,
        email: req.session.email,
        age: req.session.age,
        city: req.session.city,
        homepage: req.session.homepage,
        vis: "vis"
    });
});

app.post("/edit", (req, res) => {
    if (req.body.password == "") {
        db.updateUser(
            req.session.userId,
            req.body.name,
            req.body.surname,
            req.body.email,
            req.session.password
        )
            .then(() =>
                db.updateProf(
                    req.body.age,
                    req.body.city,
                    req.body.homepage,
                    req.session.userId
                )
            )
            .then(() => res.redirect("./logout"))
            .catch(err => {
                console.log(err);
                res.render("edit", {
                    layout: "main",
                    name: req.session.name,
                    surname: req.session.surname,
                    email: req.session.email,
                    age: req.session.age,
                    city: req.session.city,
                    homepage: req.session.homepage,
                    error: "error",
                    vis: "vis"
                });
            });
    } else {
        bc.hashPassword(req.body.password).then(hpass => {
            db.updateUser(
                req.session.userId,
                req.body.name,
                req.body.surname,
                req.body.email,
                hpass
            )
                .then(() =>
                    db.updateProf(
                        req.body.age,
                        req.body.city,
                        req.body.homepage,
                        req.session.userId
                    )
                )
                .then(() => res.redirect("./logout"))
                .catch(err => {
                    console.log(err);
                    res.render("edit", {
                        layout: "main",
                        name: req.session.name,
                        surname: req.session.surname,
                        email: req.session.email,
                        age: req.session.age,
                        city: req.session.city,
                        homepage: req.session.homepage,
                        error: "error"
                    });
                });
        });
    }
});

// DELETION PAGE -------------------------------------------//

app.get("/deletion", (req, res) => {
    db.deleteSig(req.session.userId).then(
        db
            .deleteProf(req.session.userId)
            .then(db.deleteUser(req.session.userId))
            .catch(err => console.log(err))
    );
    res.redirect("/logout");
});

// LOGOUT PAGE -------------------------------------------//

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/registration");
});

// our server listens
if (require.main == module) {
    app.listen(process.env.PORT || 8080, () =>
        console.log("Server is listening...")
    );
}
