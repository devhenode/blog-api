import mongoose from "mongoose"

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true, unique: true, lowercase: true},
    password: { type: String, required: true},
}, {timestamps: true });

export default mongoose.model('User', UserSchema);