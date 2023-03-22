import jwt from 'jsonwebtoken';



function authenticateToken(req, res, next) {
  const {token} = req.headers || req.body;
  if (!token) return res.status(401).json({code : 401, message : "No Token Found ! Login First !!"})

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({code : 403, message : err.message});
    
    req.user = user
    next()
  })
}
export default authenticateToken;