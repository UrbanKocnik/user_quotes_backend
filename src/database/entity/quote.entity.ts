
import { Exclude, Expose } from 'class-transformer';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
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

  @Column({nullable: true})
  public likes!: number;

  @Column({nullable: true})
  public dislikes!: number;

  @Column({nullable: true})
  public rating!: number;

  @Expose()
  get ratingSum(): number{
    return this.upvotes - this.downvotes
  }

  @Expose()
  get upvotes(): number{
    if(!this.votes){
      return 0;
    }
    this.likes = this.votes.reduce((accumulator, vote) => {
      if (vote.rating) {
        return accumulator + 1;
      }
    
      return accumulator;
    }, 0);
    return this.likes
  }

  @Expose()
  get downvotes(): number{
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