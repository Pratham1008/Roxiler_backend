import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Rating } from './entities/rating.entity';
import { Roles } from '../common/roles.decorators';
import { UserRole } from '../common/roles';
import { RolesGuard } from '../common/roles.guard';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':userId')
  async submit(
    @Param('userId') userId: string,
    @Body() dto: CreateRatingDto,
  ): Promise<{ success: true }> {
    return this.ratingsService.submitRating(userId, dto);
  }

  @Get('store/:storeId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async getForStore(@Param('storeId') storeId: string): Promise<Rating[]> {
    return this.ratingsService.getRatingsForStore(storeId);
  }

  @Get('user/:userId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async getForUser(@Param('userId') userId: string): Promise<Rating[]> {
    return this.ratingsService.getRatingsByUser(userId);
  }
}
