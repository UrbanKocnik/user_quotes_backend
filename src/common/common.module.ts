import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        JwtModule.register({
            secret: 'ucxxhmRn6SYAzp6PbSftQ6JsPPHsyZ3nnZZCgQUarEbpUNIkkFZXZCX6v5UID6Fe',
            signOptions: { expiresIn: '1d' },
          })
    ],
    exports: [
        JwtModule
    ]
})
export class CommonModule {}
