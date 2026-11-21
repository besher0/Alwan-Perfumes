import 'dotenv/config';
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32 || process.env.JWT_SECRET.startsWith('CHANGE_ME'))
    throw new Error('Set a unique JWT_SECRET of at least 32 characters');

  const app = await NestFactory.create(AppModule, { cors:false });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true,transform:true}));
  const allowed=(process.env.ALLOWED_ORIGINS||'').split(',').map(x=>x.trim()).filter(Boolean);
  app.enableCors({origin:(origin,callback)=>callback(null,!origin||allowed.includes(origin)),methods:'GET,POST,PATCH,OPTIONS',allowedHeaders:'Content-Type,Authorization'});
  app.enableShutdownHooks();
  const port=Number(process.env.PORT||3001);
  await app.listen(port,'0.0.0.0');
  console.log(`Alwan API listening on http://0.0.0.0:${port}/api`);
}
bootstrap().catch(error=>{console.error(error);process.exit(1)});
