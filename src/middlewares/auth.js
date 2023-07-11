const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../../config");

const authentication = (req, res, next) => {
  try {
    let token = req.headers["x-api-key"] || (req.headers["authorization"]);

    if (!token) {
      return res.status(401).json({ status: false, message: "Invalid token" });
    }
    if((req.headers["authorization"])){
         token = ((req.headers["authorization"]).split(" "))[1]
    }
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (
      error.message.includes("signature") ||
      error.message.includes("token") ||
      error.message.includes("malformed")
    ) {
      // console.log(err.message)
      return res
        .status(401)
        .send({ status: false, message: "You are not Authenticated" });
    }
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  authentication
};
