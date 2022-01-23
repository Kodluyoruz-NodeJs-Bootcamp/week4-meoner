import  mongoose  from "mongoose";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 255
    },
    surname: {
        type: String,
        required: true,
        min: 3,
        max: 255
    },
    userName:{
        type: String,
        required: true,
        min: 3,
        max: 255,
        unique: true,
    }, 
    password:{
        type: String,
        required: true,
        min: 6,
        max: 1024,
    }
});


const User = mongoose.model('User', userSchema);

export default User;
