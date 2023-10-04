import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService) {}
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.usersRepository.createUser(authCredentialsDto);
  }
  async signIn(newUserCredentials: AuthCredentialsDto): Promise<{accessToken: string}> {
    const {username, password} = newUserCredentials
    const user = await this.usersRepository.findUserbyUsername(username);
    if(user && (await bcrypt.compare(password, user.password))){
        const payload: JwtPayload = { username };
        const accessToken: string = await this.jwtService.sign(payload);
        return { accessToken };
    } else {
        throw new UnauthorizedException('Invalid credentials, Try again.')
    }
  }
}
