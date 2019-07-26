const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// handlebars in order to create web pages quicker
const hb = require("express-handlebars");
app.engine("handlebars", hb());
app.set("view engine", "handlebars");

// Amazon Server
const s3 = require("./s3");

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

// code we need to name and upload file
var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(express.static("./public"));

app.get("/", (req, res) => {
    if (req.session.userId) {
        res.redirect("/logout");
    } else {
        res.render("login", {
            layout: "main"
        });
    }
});

app.get("/registration", (req, res) => {
    res.render("registration", {
        layout: "main"
    });
});

app.post("/images", (req, res) => {
    db.getImages(req.body.max)
        .then(data => {
            let images = data.rows;
            return images;
        })
        .then(images => res.json(images));
});

app.get("/profile/images", (req, res) => {
    db.getProfileImages(req.session.userId)
        .then(data => {
            let images = data.rows.reverse();
            return images;
        })
        .then(images => {
            let user = req.session.name;
            res.json({ images, user: user });
        });
});

app.post("/getmore", (req, res) => {
    db.getMoreImages(req.body.minId).then(data => {
        res.json(data);
    });
});

app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    let imageUrl = "https://s3.amazonaws.com/chrisgiann44/" + req.file.filename;
    let title = req.body.title;
    let description = req.body.description;

    db.insertImg(
        imageUrl,
        req.session.name,
        title,
        description,
        req.session.userId
    );

    if (req.file) {
        res.json({
            url: imageUrl,
            title: req.body.title,
            success: true
        });
    } else {
        res.json({
            success: false
        });
    }
});

app.post("/registration", (req, res) => {
    bc.hashPassword(req.body.password).then(hpass => {
        db.addUser(req.body.name, req.body.email, hpass)
            .then(result => {
                req.session.userId = result.rows[0].id;
                req.session.name = result.rows[0].name;
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

app.post("/", (req, res) => {
    db.findUser(req.body.email)
        .then(result => {
            return [
                result.rows[0].name,
                result.rows[0].password,
                result.rows[0].id
            ];
        })
        .then(data => {
            bc.checkPassword(req.body.password, data[1])
                .then(doesMatch => {
                    if (!doesMatch) {
                        res.render("login", {
                            layout: "main",
                            error: "error"
                        });
                    } else {
                        req.session.userId = data[2];
                        req.session.name = data[0];
                        res.redirect("/profile");
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.render("login", {
                        layout: "main",
                        error: "error"
                    });
                });
        });
});

app.post("/deletion", (req, res) => {
    let imageUrl = req.body.url;
    db.deleteImg(imageUrl)
        .then(() => {
            res.redirect("/profile/images");
        })
        .then(images => res.json(images));
});

app.get("/profile", (req, res) => {
    if (req.session.userId)
        res.render("profile", {
            layout: "main",
            name: req.session.name
        });
    else {
        res.redirect("/");
    }
});

app.get("/get-image-info/:imageId", (req, res) => {
    let imageId = req.params.imageId;
    db.getImageInfo(imageId).then(data => {
        res.json(data.rows);
    });
});

app.get("/get-comment-info/:imageId", (req, res) => {
    let imageId = req.params.imageId;
    db.getCommentInfo(imageId).then(data => {
        res.json(data.rows.reverse());
    });
});

app.post("/uploadcomment", (req, res) => {
    db.addCommentInfo(req.body.name, req.body.comment, req.body.imageId).then(
        data => res.json(data.rows[0])
    );
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

// our server listens
if (require.main == module) {
    app.listen(process.env.PORT || 8080, () =>
        console.log("Server is listening...")
    );
}
