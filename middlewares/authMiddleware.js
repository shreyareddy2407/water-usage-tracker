import { verify } from "jsonwebtoken";

export default (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).send({
        message: "Auth failed",
        success: false,
      });
    }
    const decodedToken = verify(token, process.env.jwt_secret);
    req.params.userId = decodedToken.userId;
    next();
  } catch (error) {
    res.status(401).send({
      message: "Auth failed",
      success: false,
    });
  }
};
