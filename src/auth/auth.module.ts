import { forwardRef, Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    imports: [
      forwardRef(()=>UsersModule),
      CommonModule     
      ],
    controllers: [AuthController],
    providers: [AuthService],
    exports:[AuthService]
    
  })
export class AuthModule {}
