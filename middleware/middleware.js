const jwt = require('jsonwebtoken');
const { exists } = require('../models/usermodel');

module.exports = async (req,res,next) =>{
    const token = req.header('x-token');
    if(!token){
        return res.status(400).send('Token Not Found');
    }

try{
    jwt.verify( 
        token,
        'jwtsecrtcode',
        (error,decode) =>{
            if(error){
                return res.status(401).json({msg:'Token not valid'})
            }
            else{
                req.user = decode.user;
                next();
            }
        }
    )   
}
catch(err){
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
}
}