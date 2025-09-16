import { Module } from '@nestjs/common';
import { NotebooksService } from './notebooks.service';
import { NotebooksController } from './notebooks.controller';

@Module({
  controllers: [NotebooksController],
  providers: [NotebooksService],
})
export class NotebooksModule {}
