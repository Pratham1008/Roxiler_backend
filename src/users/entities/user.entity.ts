import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Rating } from '../../ratings/entities/rating.entity';
import { Store } from '../../stores/entities/store.entity';
import { UserRole } from '../../common/roles';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 60 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ length: 400, nullable: true })
  address: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @OneToMany(() => Store, (store) => store.owner, { cascade: false })
  stores?: Store[];

  @OneToMany(() => Rating, (rating) => rating.user, { cascade: true })
  ratings?: Rating[];
}
