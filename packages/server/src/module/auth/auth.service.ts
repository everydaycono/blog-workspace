import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { passwordCompare, passwordHash } from 'src/utils/user.utils';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
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
    // Find exist user with email
    const isExistUser = await this.userRepository.findOne({
      where: { email: user.email },
    });

    if (!isExistUser) {
      throw new HttpException(
        'Incorrect user name or password',
        HttpStatus.NOT_FOUND,
      );
    }

    // Check password
    const isPasswordCorrect = passwordCompare({
      plainPassword: isExistUser.password,
      hashedPassword: user.password,
    });
    if (!isPasswordCorrect) {
      throw new HttpException(
        'Incorrect user name or password',
        HttpStatus.NOT_FOUND,
      );
    }

    // User status check ("locekd",'active')
    if (isExistUser.status === 'locked') {
      throw new HttpException('Your account is locked', HttpStatus.FORBIDDEN);
    }

    delete isExistUser.password;
    delete isExistUser.createAt;
    delete isExistUser.updateAt;

    // Create JWT TOKEN

    const token = this.createToken(isExistUser);
    return Object.assign(isExistUser, { token });
  }

  createToken(
    user: Pick<
      User,
      'email' | 'firstName' | 'lastName' | 'avatar' | 'role' | 'status' | 'id'
    >,
  ) {
    return this.jwtService.sign(
      {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        role: user.role,
        status: user.status,
        id: user.id,
      },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '15m',
      },
    );
  }
}
