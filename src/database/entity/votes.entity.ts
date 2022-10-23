
import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import {Quote} from './quote.entity';
import {User} from './user.entity';
 
@Entity('votes')
export class Vote {
  @PrimaryGeneratedColumn()
  public id: number;
 
  @Column()
  public rating: boolean;
  @ManyToOne(() => Quote, quote => quote.votes, {
    onDelete: 'CASCADE'
  })
  quote: Quote;
 
  @ManyToOne(() => User, user => user.votes)
  user: User;
}

export default Vote;