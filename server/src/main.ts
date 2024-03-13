import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
let app;
const PORT = 8001;

async function bootstrap() {
  app = await NestFactory.create(AppModule);
  app.use(cors());
  await app.listen(PORT, () => {
    console.log(`Server running on host ${PORT}`);
  });
}
bootstrap();
export default app;

