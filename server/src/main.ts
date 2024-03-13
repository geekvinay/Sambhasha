import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { Logger } from 'nestjs-pino';
let app;
const PORT = 8001;

async function bootstrap() {
  app = await NestFactory.create(AppModule);
  app.useLogger(app.get(Logger));
  app.use(cors());
  await app.listen(PORT, () => {
    console.log(`Server running on host ${PORT}`);
  });
}
bootstrap();
export default app;

