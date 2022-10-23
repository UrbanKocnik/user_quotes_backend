
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

  @CreateDateColumn()
  @Exclude()
  public created_at: Date

  @UpdateDateColumn()
  @Exclude()
  public updated_at: Date
  
  @ManyToOne(() => User, user => user.quotes)
  user: User;

  @OneToMany(() => Vote, (vote: Vote) => vote.quote)
  public votes: Vote[]

  @Expose()
  get ratingSum(): number{
    return this.likes - this.dislikes
  }

  @Expose()
  get likes(): number{
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
  get dislikes(): number{
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