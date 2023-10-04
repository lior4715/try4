import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersRepository } from "./users.repository";
import { JwtPayload } from "./jwt-payload.interface";
import { User } from "./user.entity";

@Injectable()
export class JwtStartegy extends PassportStrategy(Strategy) {
    constructor(
        private readonly usersRepository: UsersRepository
    ) { super({
        secretOrKey: 'topSecret51',
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        name: 'jwt'
    })}
    async validate (payload: JwtPayload): Promise<User> {
        console.log('in validate')
        const { username } = payload;
        const user: User = await this.usersRepository.findUserbyUsername(username);
        if(!user) {
            throw new UnauthorizedException('Problem in va');
        }
        return user;
    }
}