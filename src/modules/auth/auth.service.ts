import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto): Promise<AuthResponseDto> {
    this.logger.debug(`Checking for existing user with email: ${dto.email}`);
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      this.logger.warn(`Signup conflict: email already in use: ${dto.email}`);
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: { fullName: dto.fullName, email: dto.email, hashedPassword },
    });

    this.logger.log(`User created with id: ${user.id}`);
    return this.signToken(user.id, user.email);
  }

  async login(user: { id: string; email: string }): Promise<AuthResponseDto> {
    this.logger.debug(`Generating token for user: ${user.id}`);
    return this.signToken(user.id, user.email);
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<{ id: string; email: string } | null> {
    this.logger.debug(`Validating credentials for email: ${email}`);
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      this.logger.warn(`Login failed: user not found for email: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const match = await bcrypt.compare(password, user.hashedPassword);
    if (!match) {
      this.logger.warn(`Login failed: invalid password for email: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    return { id: user.id, email: user.email };
  }

  private async signToken(userId: string, email: string): Promise<AuthResponseDto> {
    const access_token = await this.jwtService.signAsync({
      sub: userId,
      email,
    });
    return { access_token };
  }
}
