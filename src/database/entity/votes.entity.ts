
import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Quote from './quote.entity';
import User from './user.entity';
 
@Entity({name: 'votes'})
class Vote {
  @PrimaryGeneratedColumn()
  public id: number;
 
  @Column()
  public rating: boolean;

  @Exclude()
  @Column()
  public user_id: number;

  @Exclude()
  @Column()
  public quote_id: number;

  @ManyToOne(() => Quote)
  @JoinColumn({name:'quoteId'})
  quoteId: Quote;
 
  @ManyToOne(() => User)
  @JoinColumn({name:'userId'})
  userId: User;
}
 
export default Vote;