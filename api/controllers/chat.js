let io = require("socket.io")();

module.exports = (server) => {
    const get = (req, res) => {
        res.status(201).send();
    };

    const setup = () => {
        io.attach(server);

        io.on("connection", (socket) => {
            console.log("user connected")
        });

        io.on("disconnect", (socket) => {
            console.log("user disconnected");
        });
    };
    return {
        get,
        setup
    };
};