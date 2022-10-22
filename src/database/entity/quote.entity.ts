
import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import User from './user.entity';
import Vote from './votes.entity';
 
@Entity({name: 'quotes'})
class Quote {
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
  
  @OneToOne(() => User)
  @JoinColumn({name:'user'})
  user: User;

  @OneToMany(() => Vote, (vote: Vote) => vote.quoteId)
  public votes: Vote[];
}
 
export default Quote;