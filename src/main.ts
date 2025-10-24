import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { GlobalResponseInterceptor } from "src/common/interceptors/global-response.interceptor";
import { GlobalExceptionFilter } from "src/common/filters/global-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS - Đặt TRƯỚC các interceptors/filters
  app.enableCors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"], // Thêm cả 127.0.0.1
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "refreshtoken",
      "x-device-id",
    ],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
  });

  app.useGlobalInterceptors(new GlobalResponseInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(8080);
}
bootstrap();
