import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { GlobalResponseInterceptor } from "src/common/interceptors/global-response.interceptor";
import { GlobalExceptionFilter } from "src/common/filters/global-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new GlobalResponseInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(8080);
}
bootstrap();
