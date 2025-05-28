import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards,
  Request
} from '@nestjs/common';
import { InterestsService } from './interests.service';
import { CreateInterestDto } from './dto/create-interest.dto';
import { UpdateInterestDto } from './dto/update-interest.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserInterestsDto } from './dto/user-interests.dto';

@Controller()
export class InterestsController {
  constructor(private readonly interestsService: InterestsService) {}

  @Get('interests')
  findAll() {
    return this.interestsService.findAll();
  }

  @Post('interests')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() createInterestDto: CreateInterestDto) {
    return this.interestsService.create(createInterestDto);
  }

  @Post('users/interests')
  @UseGuards(JwtAuthGuard)
  addUserInterests(@Request() req, @Body() userInterestsDto: UserInterestsDto) {
    return this.interestsService.addUserInterests(req.user.userId, userInterestsDto);
  }

  @Get('users/interests')
  @UseGuards(JwtAuthGuard)
  getUserInterests(@Request() req) {
    return this.interestsService.getUserInterests(req.user.userId);
  }

  @Get('projects/recommended')
  @UseGuards(JwtAuthGuard)
  getRecommendedProjects(@Request() req) {
    return this.interestsService.getRecommendedProjects(req.user.userId);
  }
}