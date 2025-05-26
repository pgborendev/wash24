import { Injectable } from '@nestjs/common';
import { User } from '../schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { BaseService } from '../../core/services/base.service';

@Injectable()
class UserService extends BaseService<User> {

     constructor(@InjectModel(User.name) model: PaginateModel<User>) {
         super(model);
       }

    protected getPopulation(): string[] {
        return ['roles'];
    }

    async findByUsername(username: string): Promise<User | null> {
        return this.model.findOne({ username })
          .select('password') // Include password field
          .populate('roles') // Populate roles
          .exec();
    }

    
    async findByPhone(phonenumber: string): Promise<User | null> {
        return this.model.findOne({ phonenumber: phonenumber })
          .select('password') // Include password field
          .populate('roles') // Populate roles
          .exec();
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.model.findOne({ email: email })
          .select('password') // Include password field
          .populate('roles') // Populate roles
          .exec();
    }

    public async checkEmailExists(email: string, id: string | undefined): Promise<boolean> {

      interface QueryType {
        email: string;
        deleted: boolean;
        _id?: { $ne: string };
      }

      let query: QueryType = { email: email, deleted: false };
      if (id) {
        query._id = { $ne: id };
      }
      
      let users: User[] = await this.model.find(query);
      return users.length > 0;
    }

    public async checkUserNameExists(username: string, id: string | undefined): Promise<boolean> {

      interface QueryType {
        username: string;
        deleted: boolean;
        _id?: { $ne: string };
      }

      let query: QueryType = { username: username, deleted: false };

      if (id) {
        query._id = { $ne: id };
      }
      let users: User[] = await this.model.find(query);
      return users.length > 0;
    }

    protected getModelDataFromRequest(param: any): any {
      return {
        username: param.username ,
        email: param.email,
        password: param.password,
        deletable: false
        };
    }

}

export { UserService };