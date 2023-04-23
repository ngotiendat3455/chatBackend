import { IMovieCategoryDocument, IGetMovieCategoryQuery, IQueryComplete, IQueryDeleted } from '@root/features/movieCategory/interfaces/movieCategory.interface';
import { MovieCatergoyModel } from '@root/features/movieCategory/models/movieCategory.schema';
import { Query, UpdateQuery } from 'mongoose';

class MovieCategoryService {
    public async addMovieCategoryToDB(createdPost: IMovieCategoryDocument): Promise<void> {
        const post: Promise<IMovieCategoryDocument> = MovieCatergoyModel.create(createdPost);
        await Promise.all([post]);
      }
    
      public async getMovieCategory(query: IGetMovieCategoryQuery, skip = 0, limit = 0, sort: Record<string, 1 | -1>): Promise<IMovieCategoryDocument[]> {
        const postQuery = query;
        const posts: IMovieCategoryDocument[] = await MovieCatergoyModel.aggregate([{ $match: postQuery }, { $sort: sort }, { $skip: skip }, { $limit: limit }]);
        return posts;
      }
    
      public async movieCategoryCount(): Promise<number> {
        const count: number = await MovieCatergoyModel.find({}).countDocuments();
        return count;
      }
    
      public async deleteMovieCategory(movieCategoryId: string): Promise<void> {
        const deletePost: Query<IQueryComplete & IQueryDeleted, IMovieCategoryDocument> = MovieCatergoyModel.deleteOne({ _id: movieCategoryId });
        await deletePost;
        // return res;
      }
    
      public async editMovieCategory(movieCategoryId: string, updatedPost: IMovieCategoryDocument): Promise<void> {
        const updatePost: UpdateQuery<IMovieCategoryDocument> = MovieCatergoyModel.updateOne({ _id: movieCategoryId }, { $set: updatedPost });
        await Promise.all([updatePost]);
      }
}
export const movieCategoryService:MovieCategoryService = new MovieCategoryService();