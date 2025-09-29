import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store } from './entities/store.entity';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../common/roles';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const { ownerId, ...storeDetails } = createStoreDto;
    const newStore = this.storeRepository.create(storeDetails);

    if (ownerId) {
      const owner = await this.userRepository.findOneBy({ id: ownerId });
      if (!owner) {
        throw new NotFoundException(`User with ID ${ownerId} not found`);
      }
      owner.role = UserRole.OWNER;
      await this.userRepository.save(owner);
      newStore.owner = owner;
    }

    return this.storeRepository.save(newStore);
  }

  findAll(filters: { name?: string; address?: string }): Promise<Store[]> {
    const whereConditions: any = {};
    if (filters.name) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      whereConditions.name = ILike(`%${filters.name}%`);
    }
    if (filters.address) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      whereConditions.address = ILike(`%${filters.address}%`);
    }
    return this.storeRepository.find({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      where: whereConditions,
      relations: ['owner', 'ratings', 'ratings.user'],
      order: { name: 'ASC' },
    });
  }

  async findById(id: string): Promise<Store> {
    const store = await this.storeRepository.findOne({
      where: { id },
      relations: ['owner', 'ratings', 'ratings.user'],
    });

    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }
    return store;
  }

  async update(id: string, updateStoreDto: UpdateStoreDto): Promise<Store> {
    const store = await this.storeRepository.preload({
      id: id,
      ...updateStoreDto,
    });
    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }
    return this.storeRepository.save(store);
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.storeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }
    return { message: `Successfully deleted store with ID ${id}` };
  }

  async updateAverageRating(storeId: string, avg: number): Promise<void> {
    await this.storeRepository.update(storeId, { averageRating: avg });
  }
}
