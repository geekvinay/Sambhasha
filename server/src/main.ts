import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
let app;

async function bootstrap() {
  app = await NestFactory.create(AppModule);
  app.use(cors());
  await app.listen(8001, '192.168.2.2');
}
bootstrap();
export default app;

