import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { Collection } from './schemas/collection.schema/collection.schema';
import { Model } from 'mongoose';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectModel(Collection.name)
    private collectionModel: Model<Collection>,
  ) {}

  async getAllCollections(limit = 20, offset = 0) {
    const collections = await this.collectionModel
      .find()
      .skip(offset)
      .limit(limit)
      .exec();

    const total = await this.collectionModel.countDocuments();

    return {
      data: collections,
      total,
      limit,
      offset,
    };
  }

  async create(createCollectionDto: CreateCollectionDto) {
    const createdCollection =
      await this.collectionModel.create(createCollectionDto);

    return createdCollection;
  }

  async remove(id: number) {
    return this.collectionModel.findByIdAndDelete(id).exec();
  }
}
