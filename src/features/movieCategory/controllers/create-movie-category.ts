import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import HTTP_STATUS from 'http-status-codes';
import { IMovieCategoryDocument } from '../interfaces/movieCategory.interface';
import { joiValidation } from '@global/decorators/joi-decorator';
import { movieCategorySchema } from '../schemas/movieCategory.schemes';
import { movieCategoryService } from '@service/db/movieCategory.service';
export class Create {
  @joiValidation(movieCategorySchema)
  public async post(req: Request, res: Response): Promise<void> {
    const { name, code, description } = req.body;
    console.log('req.currentUser', req.currentUser);
    const postObjectId: ObjectId = new ObjectId();
    const createdPost: IMovieCategoryDocument = {
      _id: postObjectId,
      description: description,
      createUserId: req.currentUser!.userId,
      updateUserId: req.currentUser!.userId,
      createdAt: new Date(),
      updateAt: new Date(),
      code,
      name
    } as IMovieCategoryDocument;
    await movieCategoryService.addMovieCategoryToDB(createdPost);
    res.status(HTTP_STATUS.CREATED).json({ message: 'Post created successfully' });
  }
}
