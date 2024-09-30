import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';

import { AuthService } from './Auth.service';
import { JwtModule } from '@nestjs/jwt';
import { RepoReferenceInjection } from '@const';
import { UserInMemoryRepository } from 'src/Infra/Repositories/User/UserInMemory.repository';
import { SessionInMemoryRepository } from 'src/Infra/Repositories/Session/SessionImMemory.repository';
import { SignUpDto } from './dtos/SignUp.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService SignIn', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'SECRET',
          global: true,
        }),
      ], // Add
      controllers: [], // Add
      providers: [
        {
          provide: RepoReferenceInjection.USER_REPOSITORY,
          useClass: UserInMemoryRepository,
        },
        {
          provide: RepoReferenceInjection.SESSION_REPOSITORY,
          useClass: SessionInMemoryRepository,
        },
        AuthService,
      ], // Add
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    // jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should be able create a new user', async () => {
    const userDto: SignUpDto = {
      name: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const userCreated = await authService.signUp(userDto, {
      device: 'jest',
      ip_address: '127.0.0.1',
    });

    expect(userCreated).toHaveProperty('user');
    expect(userCreated.user.name).toEqual(userDto.name);
    expect(userCreated.user.email).toEqual(userDto.email);

    expect(userCreated).toHaveProperty('session');
    expect(userCreated).toHaveProperty('access_token');
  });

  it('It is not possible to create users with the same email', async () => {
    const userDto: SignUpDto = {
      name: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    await authService.signUp(userDto, {
      device: 'jest',
      ip_address: '127.0.0.1',
    });

    expect(
      async () =>
        await authService.signUp(userDto, {
          device: 'jest',
          ip_address: '127.0.0.1',
        }),
    ).rejects.toThrow(UnauthorizedException);
  });
});

describe('AuthService SignUp', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'SECRET',
          global: true,
        }),
      ], // Add
      controllers: [], // Add
      providers: [
        {
          provide: RepoReferenceInjection.USER_REPOSITORY,
          useClass: UserInMemoryRepository,
        },
        {
          provide: RepoReferenceInjection.SESSION_REPOSITORY,
          useClass: SessionInMemoryRepository,
        },
        AuthService,
      ], // Add
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    // jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('It must be possible to log in with an already registered user', async () => {
    const userDto: SignUpDto = {
      name: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const clientInfo = {
      device: 'jest',
      ip_address: '127.0.0.1',
    };

    const result = await authService.signUp(userDto, clientInfo);

    expect(result).toBeDefined();

    const userRegistered = await authService.signIn(
      {
        email: userDto.email,
        password: userDto.password,
      },
      clientInfo,
    );

    expect(userRegistered).toHaveProperty('user');
    expect(userRegistered).toHaveProperty('user.name', userDto.name);
    expect(userRegistered).toHaveProperty('user.email', userDto.email);
    expect(userRegistered).toHaveProperty('access_token');
    expect(userRegistered).toHaveProperty('session');
  });

  it('it is not possible to log in with an unregistered user', async () => {
    const userDto: SignUpDto = {
      name: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const clientInfo = {
      device: 'jest',
      ip_address: '127.0.0.1',
    };

    expect(
      async () =>
        await authService.signIn(
          {
            email: userDto.email,
            password: userDto.password,
          },
          clientInfo,
        ),
    ).rejects.toThrow(new UnauthorizedException());
  });

  it('is not possible to log in with an invalid password or email', async () => {
    const userDto: SignUpDto = {
      name: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const clientInfo = {
      device: 'jest',
      ip_address: '127.0.0.1',
    };

    await authService.signUp(userDto, clientInfo);

    expect(
      async () =>
        await authService.signIn(
          {
            email: 'wrong@email',
            password: userDto.password,
          },
          clientInfo,
        ),
    ).rejects.toThrow(UnauthorizedException);

    expect(
      async () =>
        await authService.signIn(
          {
            email: userDto.email,
            password: 'wrong-password',
          },
          clientInfo,
        ),
    ).rejects.toThrow(UnauthorizedException);
  });
});
