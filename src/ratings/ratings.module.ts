import { Module } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rating } from './entities/rating.entity';
import { UsersModule } from '../users/users.module';
import { StoresModule } from '../stores/stores.module';

@Module({
  imports: [TypeOrmModule.forFeature([Rating]), UsersModule, StoresModule],
  controllers: [RatingsController],
  providers: [RatingsService],
})
export class RatingsModule {}
