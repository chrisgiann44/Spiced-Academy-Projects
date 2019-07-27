const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    origins: "localhost:8080 mysocialnetworkonline.herokuapp.com:*"
}); //should be changed if deployed to HEROKU

// const io = require("socket.io")(server, {
//     origins: process.env.PORT || 5000
// }); //should be changed if deployed to HEROKU

const db = require("./utils/db");
const bc = require("./utils/bc");
const compression = require("compression");
const cookieSession = require("cookie-session");
const cookieSessionMiddleware = cookieSession({
    secret: `I'm always hungry.`,
    maxAge: 1000 * 60 * 60 * 24 * 7
});
const bodyParser = require("body-parser");
const csurf = require("csurf");

// Amazon Server
const s3 = require("./s3");

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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//  App Use
app.use(compression());
app.use(express.static("./public"));
app.use(express.json());
app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});
app.use(csurf());
app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

//only 2 servers with proxy in dev, in prodution it reads bundle.js
if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

//Routs

app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    let imageUrl = "https://s3.amazonaws.com/chrisgiann44/" + req.file.filename;
    db.insertImg(req.session.userId, imageUrl);
    res.json({ imageUrl: imageUrl });
});

app.post("/savebio", function(req, res) {
    db.insertBio(req.session.userId, req.body.bioText);
    res.end();
});

app.post("/register", function(req, res) {
    let { name, surname, email, password } = req.body;
    bc.hashPassword(password)
        .then(hashedPassword => {
            db.addUser(name, surname, email, hashedPassword)
                .then(resp => {
                    req.session.userId = resp.rows[0].id;
                    res.json({ userId: resp.rows[0].id });
                })
                .catch(err => {
                    console.log(err);
                    res.json({ error: true });
                });
        })
        .catch(err => {
            console.log(err);
            res.json({ error: true });
        });
});

app.post("/login", function(req, res) {
    let { email, password } = req.body;
    db.findUser(email)
        .then(resp =>
            bc
                .checkPassword(password, resp.rows[0].password)
                .then(doesMatch => {
                    if (!doesMatch) {
                        res.json({ error: true });
                    } else {
                        req.session.userId = resp.rows[0].id;
                        res.json({ userId: resp.rows[0].id });
                    }
                })
        )
        .catch(err => {
            console.log(err);
        });
});

app.get("/welcome", function(req, res) {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("/getuser", function(req, res) {
    db.findUserId(req.session.userId).then(data => res.json(data.rows[0]));
});

app.get("/getusers", function(req, res) {
    db.findnewUsers().then(data => {
        res.json(data.rows);
    });
});

// test Redux
app.get("/getlist", function(req, res) {
    let animals = ["cats", "dogs", "otter"];
    res.json(animals);
});

app.get("/getfriends", function(req, res) {
    db.findfriends(req.session.userId).then(data => {
        res.json({ data: data.rows, user: req.session.userId });
    });
});

app.get("/getusers/:val", function(req, res) {
    db.findreqUsers(req.params.val).then(data => {
        res.json(data.rows);
    });
});

app.post("/otheruser", function(req, res) {
    if (req.session.userId == req.body.id) {
        res.json({ same: "same" });
    } else {
        db.findUserId(req.body.id).then(data => {
            db.findCommonFriends(req.session.userId, req.body.id).then(resp => {
                res.json({ userProf: data.rows[0], commonFriends: resp.rows });
            });
        });
    }
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

app.get("/getfriendship/:val", function(req, res) {
    db.findfriendshipreq(req.session.userId, req.params.val)
        .then(data => {
            if (data.rows[0].accepted) {
                res.json({ existingfriend: true, existingreq: false });
            } else {
                if (!data.rows.length) {
                    res.json({ existingreq: false });
                } else if (data.rows[0].sender_id == req.session.userId) {
                    res.json({ existingreq: true, existinguser: true });
                } else if (data.rows[0].sender_id != req.session.userId) {
                    res.json({ existingreq: true, existinguser: false });
                }
            }
        })
        .catch(e => console.log("error:", e));
});

app.post("/deletefriend", function(req, res) {
    db.deletefriend(req.session.userId, req.body.profileOwner || req.body.user)
        .then(
            res.json({
                deleted: "success"
            })
        )
        .catch(e => console.log(e));
});

app.post("/addfriend", async function(req, res) {
    db.addfriend(req.session.userId, req.body.profileOwner)
        .then(
            res.json({
                added: "success"
            })
        )
        .catch(e => console.log(e));

    if (onlineNow.includes(Number(req.body.profileOwner))) {
        let reciepient = socketIds[Number(req.body.profileOwner)];
        io.sockets.sockets[reciepient].emit("popup", true);
        setTimeout(function() {
            io.sockets.sockets[reciepient].emit("popup", false);
        }, 2000);
    }
});

app.post("/acceptfriend", function(req, res) {
    db.acceptfriend(req.session.userId, req.body.profileOwner || req.body.user)
        .then(
            res.json({
                added: "success"
            })
        )
        .catch(e => console.log(e));
});

app.get("*", function(req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

// our server listens
if (require.main == module) {
    server.listen(process.env.PORT || 8080, () =>
        console.log("Server is listening... at " + process.env.PORT)
    );
}
const onlineUsers = {};
const onlineNow = [];
const socketIds = {};

// Socket EVENT Handling
io.on("connection", socket => {
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    } else {
        const userId = socket.request.session.userId;

        db.getMessages().then(data => {
            socket.emit("chatMessages", data.rows);
        });

        db.findUserbyId(userId)
            .then(data => {
                onlineUsers[socket.id] = data.rows[0];
                socketIds[userId] = socket.id;
                onlineNow.push(userId);
            })
            .then(() => {
                io.sockets.emit("onlineUsers", onlineUsers);
            });

        socket.on("checkHistory", id =>
            db.checkHistory(id).then(resp =>
                socket.emit("historyMessages", {
                    data: resp.rows
                })
            )
        );

        socket.on("newchatMessage", msg => {
            db.addMessage(userId, msg).then(resp => {
                db.findUserbyId(userId).then(data => {
                    io.sockets.emit("chatMessage", {
                        created_at: resp.rows[0].created_at,
                        id: resp.rows[0].id,
                        name: data.rows[0].name,
                        pic_url: data.rows[0].pic_url,
                        surname: data.rows[0].surname,
                        message: msg
                    });
                });
            });
        });

        socket.on("disconnect", async () => {
            delete onlineUsers[socket.id];
            onlineNow.splice(onlineNow.indexOf(userId), 1);
            await io.sockets.emit("onlineUsers", onlineUsers);
        });
    }
});
