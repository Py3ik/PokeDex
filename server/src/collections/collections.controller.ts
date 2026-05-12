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
import { ImportCollectionDto } from './dto/import-collection.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post()
  create(@Body() createCollectionDto: CreateCollectionDto) {
    return this.collectionsService.create(createCollectionDto);
  }

  @Post('import')
  import(@Body() importCollectionDto: ImportCollectionDto) {
    return this.collectionsService.importCollection(importCollectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.collectionsService.remove(id);
  }
  @Get()
  @ApiQuery({ name: 'limit', required: false, type: String, default: '20' })
  @ApiQuery({ name: 'offset', required: false, type: String, default: '0' })
  findAll(
    @Query('limit') limit: string = '20',
    @Query('offset') offset: string = '0',
  ) {
    return this.collectionsService.getAllCollections(
      Number(limit),
      Number(offset),
    );
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.collectionsService.getCollectionById(id);
  }
}
