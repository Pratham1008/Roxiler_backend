import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './entities/rating.entity';
import { UsersService } from '../users/users.service';
import { StoresService } from '../stores/stores.service';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingsRepo: Repository<Rating>,
    private readonly usersService: UsersService,
    private readonly storesService: StoresService,
  ) {}

  async submitRating(
    userId: string,
    dto: CreateRatingDto,
  ): Promise<{ success: true }> {
    const { storeId, ratingValue } = dto;

    if (ratingValue < 1 || ratingValue > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    const user = await this.usersService.findById(userId);
    const store = await this.storesService.findById(storeId);

    // check if rating already exists
    const existing = await this.ratingsRepo.findOne({
      where: { user: { id: userId }, store: { id: storeId } },
      relations: ['user', 'store'],
    });

    if (existing) {
      existing.ratingValue = ratingValue;
      await this.ratingsRepo.save(existing);
    } else {
      const newRating = this.ratingsRepo.create({ ratingValue, user, store });
      await this.ratingsRepo.save(newRating);
    }

    await this.recomputeStoreAverage(storeId);
    return { success: true };
  }

  private async recomputeStoreAverage(storeId: string): Promise<void> {
    const res: { avg: string | null } | undefined = await this.ratingsRepo
      .createQueryBuilder('r')
      .select('AVG(r.ratingValue)', 'avg')
      .where('r.storeId = :storeId', { storeId })
      .getRawOne();

    const avg = res?.avg ? parseFloat(res.avg) : 0;
    await this.storesService.updateAverageRating(storeId, avg);
  }

  async getRatingsForStore(storeId: string): Promise<Rating[]> {
    return this.ratingsRepo.find({
      where: { store: { id: storeId } },
      relations: ['user'],
    });
  }

  async getRatingsByUser(userId: string): Promise<Rating[]> {
    return this.ratingsRepo.find({
      where: { user: { id: userId } },
      relations: ['store'],
    });
  }
}
