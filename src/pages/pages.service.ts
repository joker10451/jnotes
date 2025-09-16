import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@Injectable()
export class PagesService {
  constructor(private prisma: PrismaService) {}

  async create(createPageDto: CreatePageDto, userId: string) {
    // Проверяем доступ к блокноту
    const notebook = await this.prisma.notebook.findFirst({
      where: {
        id: createPageDto.notebookId,
        OR: [
          { userId },
          {
            sharedWith: {
              some: {
                userId,
              },
            },
          },
        ],
      },
    });

    if (!notebook) {
      throw new NotFoundException('Notebook not found');
    }

    if (notebook.userId !== userId) {
      throw new ForbiddenException('You can only add pages to your own notebooks');
    }

    return this.prisma.page.create({
      data: createPageDto,
      include: {
        strokes: true,
        textBlocks: true,
        images: true,
        audioSpans: true,
        pdfAttachments: true,
        annotations: true,
      },
    });
  }

  async findOne(id: string, userId: string) {
    const page = await this.prisma.page.findFirst({
      where: {
        id,
        notebook: {
          OR: [
            { userId },
            {
              sharedWith: {
                some: {
                  userId,
                },
              },
            },
          ],
        },
      },
      include: {
        strokes: true,
        textBlocks: true,
        images: true,
        audioSpans: true,
        pdfAttachments: true,
        annotations: true,
        notebook: {
          select: {
            id: true,
            title: true,
            userId: true,
          },
        },
      },
    });

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    return page;
  }

  async update(id: string, updatePageDto: UpdatePageDto, userId: string) {
    const page = await this.findOne(id, userId);

    if (page.notebook.userId !== userId) {
      throw new ForbiddenException('You can only update pages in your own notebooks');
    }

    return this.prisma.page.update({
      where: { id },
      data: updatePageDto,
      include: {
        strokes: true,
        textBlocks: true,
        images: true,
        audioSpans: true,
        pdfAttachments: true,
        annotations: true,
      },
    });
  }

  async remove(id: string, userId: string) {
    const page = await this.findOne(id, userId);

    if (page.notebook.userId !== userId) {
      throw new ForbiddenException('You can only delete pages from your own notebooks');
    }

    return this.prisma.page.delete({
      where: { id },
    });
  }

  async addStroke(pageId: string, strokeData: any, userId: string) {
    await this.findOne(pageId, userId); // Проверяем доступ

    return this.prisma.stroke.create({
      data: {
        ...strokeData,
        pageId,
      },
    });
  }

  async addTextBlock(pageId: string, textBlockData: any, userId: string) {
    await this.findOne(pageId, userId); // Проверяем доступ

    return this.prisma.textBlock.create({
      data: {
        ...textBlockData,
        pageId,
      },
    });
  }

  async addAnnotation(pageId: string, annotationData: any, userId: string) {
    await this.findOne(pageId, userId); // Проверяем доступ

    return this.prisma.annotation.create({
      data: {
        ...annotationData,
        pageId,
      },
    });
  }
}
