import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import {JwtService} from "@nestjs/jwt"

@Injectable()
export class AuthGuard implements CanActivate {
  constructor (private jwtService: JwtService){
  //tt guard preverja ce je uporabnik prijavlen (ma jwt cookie) 
  //in ce je bomo nardili da se lahka odjavi
  }
  canActivate(
    context: ExecutionContext,
  ){
    const request = context.switchToHttp().getRequest();
    
    try {
      const jwt = request.cookies['jwt']
      return this.jwtService.verify(jwt);
    } catch (error) {
      return false;
    }
    
  }
}
