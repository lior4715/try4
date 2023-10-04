import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { User } from './user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStartegy } from './jwt.startegy';


@Module({
  imports: [
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: 'topSecret51',
      signOptions: {
        expiresIn: 3600
      }
    }),
    TypeOrmModule.forFeature([User])
  ],
  providers: [UsersRepository, AuthService, JwtStartegy],
  controllers: [AuthController],
  exports: [JwtStartegy, PassportModule]
})
export class AuthModule {}