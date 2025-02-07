import jwt from "jsonwebtoken";

const createTokenAndSaveCookie = (userId, res) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
     secure: process.env.NODE_ENV === 'production', // Secure only in production
    sameSite: "Lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  return token; // ✅ Ensure function returns the token
};

export default createTokenAndSaveCookie;
