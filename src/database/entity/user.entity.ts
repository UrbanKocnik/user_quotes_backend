
import { Exclude } from 'class-transformer';
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Quote from './quote.entity';
import Vote from './votes.entity';
 
@Entity({name: 'users'})
class User {
  @PrimaryGeneratedColumn()
  public id: number;
 
  @Column({unique: true})
  public username: string;

  @Column({unique:true})
  email:string
  @Column()
  image:string
  @Column()
  //Pomeni da stora sam ne returna ce fetchamo userja
  @Exclude()
  password:string

  @OneToMany(() => Vote, (vote: Vote) => vote.userId)
  public votes: Vote[];
}
 
export default User;