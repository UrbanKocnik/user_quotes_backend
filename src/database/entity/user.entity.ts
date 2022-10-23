
import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import {Vote} from './votes.entity';
 
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  public id: number;
 
  @Column({unique: true})
  public username: string;

  @Column({unique:true})
  email:string
  @Column()
  image:string
  @Column()
  @Exclude()
  password:string

  @OneToMany(() => Vote, (vote: Vote) => vote.userId)
  public votes: Vote[];
}
 
export default User;