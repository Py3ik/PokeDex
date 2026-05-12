import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Get,
  Query,
} from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post()
  create(@Body() createCollectionDto: CreateCollectionDto) {
    return this.collectionsService.create(createCollectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.collectionsService.remove(id);
  }
  @Get()
  findAll(@Query('limit') limit: number, @Query('offset') offset: number) {
    return this.collectionsService.getAllCollections(limit, offset);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.collectionsService.getCollectionById(id);
  }
}
