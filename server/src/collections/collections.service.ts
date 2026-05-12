import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { Collection } from './schemas/collection.schema/collection.schema';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectModel(Collection.name)
    private collectionModel: Model<Collection>,
    private readonly config: ConfigService,
  ) {}

  async getCollectionById(id: string) {
    return this.collectionModel.findById(id).exec();
  }

  async getAllCollections(limit = 12, offset = 0) {
    const collections = await this.collectionModel
      .find()
      .skip(offset)
      .limit(limit)
      .exec();

    const total = await this.collectionModel.countDocuments();

    return {
      collections: collections,
      total,
      limit,
      offset,
    };
  }

  async create(createCollectionDto: CreateCollectionDto) {
    const { pokemons } = createCollectionDto;
    const maxWeight = this.config.get<number>('MAX_TOTAL_WEIGHT', 1300);
    const minSpecies = this.config.get<number>('MIN_SPECIES', 3);

    const uniqueSpecies = new Set(pokemons.map((p) => p.name)).size;
    if (uniqueSpecies < minSpecies) {
      throw new BadRequestException(
        `At least ${minSpecies} different species must be selected`,
      );
    }

    const totalWeight = pokemons.reduce((sum, p) => sum + p.weight, 0);
    if (totalWeight > maxWeight) {
      throw new BadRequestException(
        `Total weight ${totalWeight} hg exceeds the limit of ${maxWeight} hg`,
      );
    }

    const createdCollection = await this.collectionModel.create({
      ...createCollectionDto,
      totalWeight,
    });

    return createdCollection;
  }

  async remove(id: string) {
    return this.collectionModel.findByIdAndDelete(id).exec();
  }
}
