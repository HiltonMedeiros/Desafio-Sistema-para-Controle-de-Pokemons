import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma.module';
import { PokemonModule } from './pokemon/pokemon.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, PokemonModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
