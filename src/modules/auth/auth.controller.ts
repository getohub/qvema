import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserRole } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    return this.authService.login(user);
  }
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    if (!createUserDto.role || ![UserRole.ENTREPRENEUR, UserRole.INVESTOR].includes(createUserDto.role)) {
      createUserDto.role = UserRole.INVESTOR;
    }
    
    const user = await this.usersService.create(createUserDto);
    return user;
  }
}