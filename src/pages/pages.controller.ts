import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('pages')
@UseGuards(JwtAuthGuard)
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Post()
  create(@Body() createPageDto: CreatePageDto, @Request() req) {
    return this.pagesService.create(createPageDto, req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.pagesService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePageDto: UpdatePageDto,
    @Request() req,
  ) {
    return this.pagesService.update(id, updatePageDto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.pagesService.remove(id, req.user.userId);
  }

  @Post(':id/strokes')
  addStroke(@Param('id') id: string, @Body() strokeData: any, @Request() req) {
    return this.pagesService.addStroke(id, strokeData, req.user.userId);
  }

  @Post(':id/text-blocks')
  addTextBlock(@Param('id') id: string, @Body() textBlockData: any, @Request() req) {
    return this.pagesService.addTextBlock(id, textBlockData, req.user.userId);
  }

  @Post(':id/annotations')
  addAnnotation(@Param('id') id: string, @Body() annotationData: any, @Request() req) {
    return this.pagesService.addAnnotation(id, annotationData, req.user.userId);
  }
}
