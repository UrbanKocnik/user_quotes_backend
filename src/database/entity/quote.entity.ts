
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
  
  @OneToOne(() => User)
  @JoinColumn({name:'user_id'})
  user_id: User;
}
 
export default Quote;