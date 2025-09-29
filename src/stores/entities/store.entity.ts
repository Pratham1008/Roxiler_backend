import { User } from '../../users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Rating } from '../../ratings/entities/rating.entity';

@Entity()
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  address: string;

  @Column({ type: 'float', default: 0 })
  averageRating: number;

  @OneToMany(() => Rating, (rating) => rating.store, { cascade: true })
  ratings?: Rating[];

  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    lazy: true,
  })
  owner: User;
}
