// 1. route declaration
//
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

//2.regex route
//
// app.get(/.*fly$/, (req, res) => {
//   res.send("Matched /ab+c new ");
// });

// 3. query params
//
// app.get("/user/:userId/:name/:password", (req, res) => {
//   console.log(req.query);
//   console.log(req.params);
//   res.send({ firstName: "Ali" });
// });

// 4. global route
//
//this is the route for global access if you write this then not any route below this will be accessible
// app.use("/", (req, res) => {
//   res.send("Hello form the server"); // });

// 5. multiple route and res
//
// multiple route handle with res.send & next with multiple cases use, get , put etc...
// app.use(
//   "/user",
//   (req, res, next) => {
//     console.log("handle res gently");
//     res.send("hello user");
//     next();
//   },
//   (req, res) => {
//     console.log("handle 2");
//     res.send("2nd response");
//   }
// );

// 6. middle wares
//
// >> this is a middleware and call only for route start from /admin only
// app.use("/admin", (req, res, next) => {
//   const token = "isAdmin";
//   const isValidToken = token === "isAdmin";
//   if (!isValidToken) res.status(401).send("Not authorize");
//   // else res.status(200).send("Authorize");
//   else next();
// });

// app.get("/admin/getAllData", (req, res) => {
//   res.send("All Data sent");
// });

// app.get("/admin/deleteUser", (req, res) => {
//   res.send("user data deleted ");
// });

// app.get("/admin/updateUser", (req, res) => {
//   res.send("user updated!");
// });
//

// 7. middleware usage
// const { adminAuthMiddleware, userAuthMiddleware } = require("./middlewares/authmiddleware");

// //global level middleware call
// app.use("/admin", adminAuthMiddleware);

// app.get("/admin/deleteUser", (req, res) => {
//   res.send("admin deleted");
// });

// //route level middleware call
// app.get("/user/deleteUser", userAuthMiddleware, (req, res) => {
//   res.send("User deleted");
// });

// 8.  Error handling
//
// app.get("/getUserData", (req, res) => {
//   try {
//     throw new Error("fjnkdfd");
//     res.send("user get data");
//   } catch (error) {
//     res.status(500).send("some error occurred");
//   }
// });

// Global error handling if any thing breaks its trump/wild card for error handling
// app.use("/", (err, req, res, next) => {
//   if (err) {
//     // Log error here to get ALert through sentry , email or etc
//     res.status(500).send("something went wrong");
//   }
// });
//
