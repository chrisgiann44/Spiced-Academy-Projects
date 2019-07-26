const supertest = require("supertest");
const { app } = require("./index");

// fake cookiess session th one that lives in the mock directory
const cookieSession = require("cookie-session");

test("GET request is successful", () => {
    return supertest(app)
        .get("/")
        .then(res => {
            console.log(res.header);
            expect(res.statusCode).toBe(302);
            // expect(res.headers['content-type']).toContain('text/html');
            // expect(res.text).toContain('<title>hello</title>');
            // expect(res.text).toContain('style="color:magenta;"')
        });
});
