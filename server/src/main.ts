import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { Logger } from 'nestjs-pino';
let app;
const PORT = 8001;
import * as fs from 'fs';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  app = await NestFactory.create(AppModule, {
    // httpsOptions: {
    //   key: fs.readFileSync('localhost-key.pem'),
    //   cert: fs.readFileSync('localhost.pem'),
    // },
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      validateCustomDecorators: true,
    })
  );
  app.setGlobalPrefix('backend');
  app.useLogger(app.get(Logger));
  app.use(cors());
  await app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}
bootstrap();
export default app;

