
import { Exclude, Expose } from 'class-transformer';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import {User} from './user.entity';
import { Vote } from './votes.entity';
 
@Entity('quotes')
export class Quote {
  @PrimaryGeneratedColumn()
  public id: number;
 
  @Column()
  public quote: string;
 
  @Column()
  public likes: number;

  @Column()
  public dislikes: number;

  @CreateDateColumn()
  @Exclude()
  public created_at: Date

  @UpdateDateColumn()
  @Exclude()
  public updated_at: Date

  @Exclude()
  @Column()
  public user_id: number;
  
  @ManyToOne(() => User, user => user.quotes)
  user: User;

  @OneToMany(() => Vote, (vote: Vote) => vote.quote)
  public votes: Vote[]

  @Expose()
  get ratingSum(): number{
    return this.upvoteNumber - this.downvoteNumber
  }

  @Expose()
  get upvoteNumber(): number{
    if(!this.votes){
      return 0;
    }
    return this.votes.reduce((accumulator, vote) => {
      if (vote.rating) {
        return accumulator + 1;
      }
    
      return accumulator;
    }, 0);
  }

  @Expose()
  get downvoteNumber(): number{
    if(!this.votes){
      return 0;
    }
    return this.votes.reduce((accumulator: number, vote: Vote) => {
      if (!vote.rating) {
        return accumulator + 1;
      }
    
      return accumulator;
    }, 0);
  }
}
 
export default Quote;