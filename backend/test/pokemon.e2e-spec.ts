import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('Pokemon System (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    jwtService = moduleFixture.get<JwtService>(JwtService);
  });

  beforeEach(async () => {
    // Limpeza em ordem para evitar erros de chave estrangeira
    await prisma.pokemon.deleteMany();
    await prisma.user.deleteMany();

    // Criamos um usuário de teste para gerar o token
    const user = await prisma.user.create({
      data: { 
        email: 'test@unipe.edu.br', 
        password: 'hashedpassword' 
      }
    });
    
    accessToken = jwtService.sign({ email: user.email, sub: user.id });
  });

  it('/pokemon (POST) - Deve criar um novo Pokémon com sucesso', () => {
    return request(app.getHttpServer())
      .post('/pokemon')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Pikachu',
        type: 'Elétrico',
        level: 25,
        hp: 100,
        pokedexNumber: 25
      })
      .expect(201);
  });

  it('/pokemon (POST) - Deve falhar se não houver autenticação', () => {
    return request(app.getHttpServer())
      .post('/pokemon')
      .send({ name: 'Invasor' })
      .expect(401);
  });

  afterAll(async () => {
    await prisma.$disconnect(); // 👈 Isso libera o banco de dados
    await app.close();
  });
});