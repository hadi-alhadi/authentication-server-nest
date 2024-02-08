import { Injectable, Logger } from '@nestjs/common';
import { IUser } from './users.interface';
import { SignupDto } from '../auth/dto/signup.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<IUser>) {}

  private readonly logger = new Logger(UsersService.name);
  async signup(signupDto: SignupDto): Promise<IUser> {
    this.logger.log('Signing up a new user.');
    const newStudent = await new this.userModel(signupDto);
    return newStudent.save();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    try {
      this.logger.log('Finding User By Email');
      return await this.userModel.findOne({ email }).exec();
    } catch (error) {
      this.logger.error(`Error finding user by email: ${error.message}`);
      throw error;
    }
  }
}
