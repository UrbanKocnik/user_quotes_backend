
import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import User from './user.entity';
 
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

  @Exclude()
  @Column()
  public user_id: number;
  
  @OneToOne(() => User)
  @JoinColumn({name:'user'})
  user: User;
}
 
export default Quote;