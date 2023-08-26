import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { passwordHash } from 'src/utils/user.utils';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async register(user: Partial<User>) {
    const { firstName, lastName, email, password } = user;
    if (!password || !firstName || !lastName || !email) {
      throw new HttpException(
        'Please enter all required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    // check if user exists with email
    const isUserExist = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (isUserExist) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    // Encrypt password
    user.password = passwordHash(password);

    const newUser = await this.userRepository.create(user);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async login(user: LoginUserDto) {
    return `sadfa`;
  }
}
