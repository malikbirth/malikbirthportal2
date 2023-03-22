import jwt from 'jsonwebtoken';

const validateAdhar = num => num.length==12

const genToken = (name) => {
  return jwt.sign({username : name}, process.env.TOKEN_SECRET, {'expiresIn' : '1d'})
}

export {
  validateAdhar,
  genToken
}