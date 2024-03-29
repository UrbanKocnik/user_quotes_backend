
import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Quote from './quote.entity';
import {Vote} from './votes.entity';
 
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  first_name:string

  @Column()
  last_name:string

  @Column({unique:true})
  email:string
  @Column()
  image:string
  @Column()
  @Exclude()
  password:string

  @OneToMany(() => Vote, (vote: Vote) => vote.user)
  public votes: Vote[];

  @OneToMany(() => Quote, (quote: Quote) => quote.user)
  public quotes: Quote[];
}
 
export default User;