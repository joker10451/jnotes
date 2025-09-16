import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotebookDto } from './dto/create-notebook.dto';
import { UpdateNotebookDto } from './dto/update-notebook.dto';

@Injectable()
export class NotebooksService {
  constructor(private prisma: PrismaService) {}

  async create(createNotebookDto: CreateNotebookDto, userId: string) {
    const { tagIds, ...notebookData } = createNotebookDto;

    return this.prisma.notebook.create({
      data: {
        ...notebookData,
        userId,
        tags: tagIds
          ? {
              create: tagIds.map((tagId) => ({
                tag: { connect: { id: tagId } },
              })),
            }
          : undefined,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        pages: {
          orderBy: { pageNumber: 'asc' },
        },
        _count: {
          select: {
            pages: true,
          },
        },
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.notebook.findMany({
      where: {
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
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            pages: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const notebook = await this.prisma.notebook.findFirst({
      where: {
        id,
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
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        pages: {
          orderBy: { pageNumber: 'asc' },
        },
        _count: {
          select: {
            pages: true,
          },
        },
      },
    });

    if (!notebook) {
      throw new NotFoundException('Notebook not found');
    }

    return notebook;
  }

  async update(id: string, updateNotebookDto: UpdateNotebookDto, userId: string) {
    const notebook = await this.findOne(id, userId);

    if (notebook.userId !== userId) {
      throw new ForbiddenException('You can only update your own notebooks');
    }

    const { tagIds, ...notebookData } = updateNotebookDto;

    return this.prisma.notebook.update({
      where: { id },
      data: {
        ...notebookData,
        tags: tagIds
          ? {
              deleteMany: {},
              create: tagIds.map((tagId) => ({
                tag: { connect: { id: tagId } },
              })),
            }
          : undefined,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        pages: {
          orderBy: { pageNumber: 'asc' },
        },
        _count: {
          select: {
            pages: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    const notebook = await this.findOne(id, userId);

    if (notebook.userId !== userId) {
      throw new ForbiddenException('You can only delete your own notebooks');
    }

    return this.prisma.notebook.delete({
      where: { id },
    });
  }

  async getPages(id: string, userId: string) {
    await this.findOne(id, userId); // Проверяем доступ

    return this.prisma.page.findMany({
      where: { notebookId: id },
      include: {
        strokes: true,
        textBlocks: true,
        images: true,
        audioSpans: true,
        pdfAttachments: true,
        annotations: true,
      },
      orderBy: { pageNumber: 'asc' },
    });
  }
}
