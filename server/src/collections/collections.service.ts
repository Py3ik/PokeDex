import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { ImportCollectionDto } from './dto/import-collection.dto';
import { Collection } from './schemas/collection.schema/collection.schema';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { PokemonService } from '../pokemon/pokemon.service';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectModel(Collection.name)
    private collectionModel: Model<Collection>,
    private readonly config: ConfigService,
    private readonly pokemonService: PokemonService,
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
    const totalWeight = this.validatePokemons(pokemons);

    const name = await this.generateUniqueName(createCollectionDto.name);
    const createdCollection = await this.collectionModel.create({
      ...createCollectionDto,
      name,
      totalWeight,
    });

    return createdCollection;
  }

  async remove(id: string) {
    return this.collectionModel.findByIdAndDelete(id).exec();
  }

  private async generateUniqueName(name: string): Promise<string> {
    const exists = await this.collectionModel.exists({ name }).exec();
    if (!exists) return name;

    let counter = 1;
    while (
      await this.collectionModel.exists({ name: `${name} (${counter})` }).exec()
    ) {
      counter++;
    }
    return `${name} (${counter})`;
  }

  async importCollection(dto: ImportCollectionDto) {
    const pokemons = await this.pokemonService.fetchManyByIds(dto.pokemonIds);
    const totalWeight = this.validatePokemons(pokemons);

    const name = await this.generateUniqueName(dto.name);
    return this.collectionModel.create({ name, pokemons, totalWeight });
  }

  private validatePokemons(
    pokemons: { name: string; weight: number }[],
  ): number {
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

    return totalWeight;
  }
}
