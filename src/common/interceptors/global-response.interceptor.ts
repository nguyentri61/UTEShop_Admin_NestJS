import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  StreamableFile,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ApiResponse } from "src/common/response/api-response";
import { Readable } from "stream";
import { Response } from "express";

@Injectable()
export class GlobalResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse<Response>();

    return next.handle().pipe(
      map((data) => {
        // giữ nguyên nếu đã theo ApiResponse
        if (data instanceof ApiResponse) return data;

        // không bọc file/stream/buffer (trả về trực tiếp)
        if (
          data instanceof StreamableFile ||
          Buffer.isBuffer(data) ||
          data instanceof Readable
        ) {
          return data;
        }

        // nếu controller trả string -> trả JSON string (giống Java xử lý String)
        if (typeof data === "string") {
          res.setHeader("Content-Type", "application/json");
          return JSON.stringify(ApiResponse.success(data));
        }

        // mặc định bọc vào ApiResponse.success
        return ApiResponse.success(data);
      }),
    );
  }
}
