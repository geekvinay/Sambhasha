import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { Logger } from 'nestjs-pino';
let app;
const PORT = 8443;
import * as fs from 'fs';

async function bootstrap() {
  app = await NestFactory.create(AppModule, {
    // httpsOptions: {
    //   key: fs.readFileSync('localhost-key.pem'),
    //   cert: fs.readFileSync('localhost.pem'),
    // },
  });
  app.useLogger(app.get(Logger));
  app.use(cors());
  await app.listen(PORT, "172.16.18.91");
}
bootstrap();
export default app;

