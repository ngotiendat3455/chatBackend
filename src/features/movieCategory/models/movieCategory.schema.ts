import mongoose, { model, Model, Schema } from 'mongoose';
import { IMovieCategoryDocument } from '../interfaces/movieCategory.interface';

const movieCategorySchema: Schema = new Schema({
    name: { type: String },
    code: { type: String },
    description: { type: String },
    createUserId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    updateUserId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    createdAt: { type: Date, default: Date.now() },
    updateAt: { type: Date, default: Date.now() },
    fee: { type: Boolean, default: false },
  });
  

const MovieCatergoyModel: Model<IMovieCategoryDocument> = model<IMovieCategoryDocument>('MovieCatergoy', movieCategorySchema, 'MovieCatergoy');
export {MovieCatergoyModel};