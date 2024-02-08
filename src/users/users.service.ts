import { Injectable } from '@nestjs/common';
import { IUser } from './users.interface';
import { SignupDto } from '../auth/dto/signup.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<IUser>) {}
  async signup(signupDto: SignupDto): Promise<IUser> {
    const newStudent = await new this.userModel(signupDto);
    return newStudent.save();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    try {
      return await this.userModel.findOne({ email }).exec();
    } catch (error) {
      console.error(
        `[UsersService] Error finding user by email: ${error.message}`,
      );
      throw error;
    }
  }
}
