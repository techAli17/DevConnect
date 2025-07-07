// app.use("/tests", (req, res) => {
//   res.send("Hello form the tests");
// });

// app.use("/user", (req, res) => {
//   res.send("getting the user for app.use ");
// });

// app.get("/user", (req, res) => {
//   res.send("getting the user");
// });

// app.post("/user", (req, res) => {
//   res.send("saving the user");
// });

// app.delete("/user", (req, res) => {
//   res.send("deleted the user");
// });
//regex
// app.get(/.*fly$/, (req, res) => {
//   res.send("Matched /ab+c new ");
// });

// query params
// app.get("/user/:userId/:name/:password", (req, res) => {
//   console.log(req.query);
//   console.log(req.params);
//   res.send({ firstName: "Ali" });
// });

//this is the route for global access if you write this then not any route below this will be accessible
// app.use("/", (req, res) => {
//   res.send("Hello form the server"); // });
