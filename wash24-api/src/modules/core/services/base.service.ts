import { Injectable, NotFoundException, ForbiddenException, Query } from '@nestjs/common';
import { PaginateModel, Document, PaginateOptions } from 'mongoose';

interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  [key: string]: any; // for additional filter fields
}

interface PaginatedResponse<T> {
  docs: T[];
  totalItems: number;
  limit: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  nextPage?: number;  // Optional
  hasPrevPage: boolean;
  prevPage?: number;  // Optional
  pagingCounter?: number;  // Optional if you want to include it
}

@Injectable()
export abstract class BaseService<T extends Document> {
  protected model: PaginateModel<T>;

  constructor(model: PaginateModel<T>) {
    this.model = model;
  }

  // Abstract methods for child classes to implement
  protected abstract getPopulation(): string[];
 
  
  // Get single document
  async get(id: string): Promise<any> {
    const doc = await this.model.findById(id)
      .populate(this.getPopulation())
      .orFail(() => new NotFoundException(`Document with ID ${id} not found`))
      .exec();
    return doc;
  }

  // Delete document
  async remove(id: string): Promise<void> {
    const result = await this.model.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
  }

  // Update document
  async update(id: string, data: Partial<T>): Promise<any> {
    const existingDoc = await this.model.findById(id).exec();

    if (!existingDoc) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    if ('deleted' in existingDoc && existingDoc['deleted']) {
      throw new ForbiddenException('Cannot update a document marked as deleted');
    }

    const updatedDoc = await this.model.findByIdAndUpdate(
      id, 
      { $set: data },
      { new: true, runValidators: true }
    )
      .populate(this.getPopulation())
      .orFail(() => new NotFoundException(`Document with ID ${id} not found after update`))
      .exec();

    return updatedDoc;
  }

  // Create document
  async create(data: Partial<T>): Promise<any> {
    const createdDoc = await this.model.create(data);
    const populatedDoc = await this.model.findById(createdDoc._id)
      .populate(this.getPopulation())
      .exec();
    return populatedDoc;
  }

  // Find all with pagination
  async findAll(
    query: PaginationQuery,
    filter: any = {},
    additionalOptions: Partial<PaginateOptions> = {}
  ): Promise<PaginatedResponse<any>> {
    const options: PaginateOptions = {
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
      collation: { locale: 'en' },
      populate: this.getPopulation(),
      sort: {},
    };

    if (query.sort && query.order) {
      options.sort = { [query.sort]: query.order === 'desc' ? -1 : 1 };
    }

    const result = await this.model.paginate(filter, options);
    
    return {
      docs: result.docs,
      totalItems: result.totalDocs,
      limit: result.limit,
      currentPage: result.page ?? 0,
      totalPages: result.totalPages,
      hasNextPage: result.hasNextPage,
      nextPage: result.nextPage ?? 0, 
      hasPrevPage: result.hasPrevPage,
      prevPage: result.prevPage ?? 0, 
    };
  }
}