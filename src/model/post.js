import mongoose from 'mongoose';
import paginate from 'mongoose-paginate';

const Schema = mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
}, { versionKey: false, timestamps: true });

Schema.plugin(paginate);

export default mongoose.model('Post', Schema);
