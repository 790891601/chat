const UserRouter = require("./userRouter");
const CommonRouter = require("./common");

function main(app) {
	app.use("/", CommonRouter);
	app.use("/user", UserRouter);
}

module.exports = main;