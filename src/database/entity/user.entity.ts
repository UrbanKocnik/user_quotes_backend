
import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
 
@Entity({name: 'users'})
class User {
  @PrimaryGeneratedColumn()
  public id: number;
 
  @Column()
  public first_name: string;
 
  @Column()
  public last_name: string;

  @Column({unique:true})
  email:string
  @Column()
  //Pomeni da stora sam ne returna ce fetchamo userja
  @Exclude()
  password:string
}
 
export default User;