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
import { NotebooksService } from './notebooks.service';
import { CreateNotebookDto } from './dto/create-notebook.dto';
import { UpdateNotebookDto } from './dto/update-notebook.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notebooks')
@UseGuards(JwtAuthGuard)
export class NotebooksController {
  constructor(private readonly notebooksService: NotebooksService) {}

  @Post()
  create(@Body() createNotebookDto: CreateNotebookDto, @Request() req) {
    return this.notebooksService.create(createNotebookDto, req.user.userId);
  }

  @Get()
  findAll(@Request() req) {
    return this.notebooksService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.notebooksService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNotebookDto: UpdateNotebookDto,
    @Request() req,
  ) {
    return this.notebooksService.update(id, updateNotebookDto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.notebooksService.remove(id, req.user.userId);
  }

  @Get(':id/pages')
  getPages(@Param('id') id: string, @Request() req) {
    return this.notebooksService.getPages(id, req.user.userId);
  }
}
