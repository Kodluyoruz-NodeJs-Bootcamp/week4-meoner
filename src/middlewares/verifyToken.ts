import {jwt} from 'jsonwebtoken';

module.exports = function (req, res, next){
    const authToken = req.header('auth-token');
    const accessToken = req.cookies.access_token;
    if(!authToken && !accessToken) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(authToken, process.env.JWT_TOKEN);
        console.log('verified', verified);;
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send('Invalid token');
    }
}