import mongoose from "mongoose";

const Schema = mongoose.Schema;

const BlogSchema = new Schema({
    title: {
        type: String, 
        required: true, 
        unique: true
    },
    description: {
        type: String
    },
    body: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        default: [],
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    state: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft',
    },
    read_count: {
        type: Number,
        default: 0,
    },
    reading_time: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

BlogSchema.pre('save', function () {
    if (this.isModified('body')) {
        const wordsPerMinute = 225;
        const text = this.body || '';
        const words = text.trim().split(/\s+/).length;
        this.reading_time = Math.ceil(words / wordsPerMinute);
    }
});

export default mongoose.model('Blog', BlogSchema);