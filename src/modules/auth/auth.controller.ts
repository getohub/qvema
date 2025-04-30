import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

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
  async register(@Body() createUserDto: CreateUserDto & { role: 'entrepreneur' | 'investor' }) {
    // S'assurer que le rôle est valide (entrepreneur ou investor)
    if (!['entrepreneur', 'investor'].includes(createUserDto.role)) {
      createUserDto.role = 'investor'; // Valeur par défaut
    }
    
    const user = await this.usersService.create(createUserDto);
    return user;
  }
}