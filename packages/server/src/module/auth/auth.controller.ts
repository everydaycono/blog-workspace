import {
  Controller,
  Post,
  Body,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';

@ApiTags('🔐 Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register
   */
  @ApiOperation({ summary: 'Create User' })
  @ApiResponse({
    status: 201,
    description: 'The found record',
    type: User,
  })
  @UseInterceptors(ClassSerializerInterceptor) // password 제거.
  @Post('register')
  register(@Body() user: CreateUserDto) {
    return this.authService.register(user);
  }

  /**
   * Login
   */
  @Post('login')
  login(@Body() user: LoginUserDto) {
    return this.authService.login(user);
  }
}
