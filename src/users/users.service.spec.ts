import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { IUser } from './users.interface';
import { Model } from 'mongoose';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<IUser>;

  beforeEach(async () => {
    const mockUserModel = {
      findOne: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<IUser>>(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const email = 'test@example.com';
      const user: IUser = {
        _id: '1',
        name: 'Test User',
        email: email,
        password: 'password',
      };
      jest.spyOn(userModel, 'findOne').mockReturnValueOnce({
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce(user),
      } as any);

      const result = await service.findByEmail(email);

      expect(result).toEqual(user);
    });

    it('should return null if user is not found', async () => {
      const email = 'notfound@example.com';
      jest.spyOn(userModel, 'findOne').mockReturnValueOnce({
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      const result = await service.findByEmail(email);

      expect(result).toBeNull();
    });
  });
});
