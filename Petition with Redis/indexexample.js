// requesting REDIS Server
const redis = require("./redis");

// Handling requests and reponses

// DEMO PORPUSES ONLY ---------------------------------------------------//
// DEMO PORPUSES ONLY ---------------------------------------------------//
// DEMO PORPUSES ONLY ---------------------------------------------------//
app.get("/setisland", (req, res) => {
    redis
        .setex(
            "island",
            120,
            // we stringify casue Redis does not ccept objects. it will stringify them to [object object]
            JSON.stringify({
                name: "kos",
                length: "23km",
                population: 30000
            })
        )
        .then(() => {
            console.log("danos mavridis");
            res.send("<h1> DANOS</h1>");
        })
        .catch(err => console.log(err));
});

app.get("/getisland", (req, res) => {
    redis
        .get("island")
        .then(data => {
            console.log(JSON.parse(data));
            res.send(`<h1>GET ISLAND ${JSON.parse(data).name}</h1>`);
        })
        .catch(err => {
            res.send(`<h1>GET ISLAND probably deleted</h1>`);
            console.log(err);
        });
});

app.get("/delisland", (req, res) => {
    redis
        .del("island")
        .then(() => res.send(`<h1>GET ISLAND DELETED</h1>`))
        .catch(err => console.log(err));
});

// DEMO PORPUSES ONLY ---------------------------------------------------//
// DEMO PORPUSES ONLY ---------------------------------------------------//
// DEMO PORPUSES ONLY ---------------------------------------------------//
