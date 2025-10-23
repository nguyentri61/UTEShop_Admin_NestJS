import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { ApiResponse } from "src/common/response/api-response";
import { Response } from "express";

function isResponseObject(val: unknown): val is { message?: string } {
  return (
    typeof val === "object" &&
    val !== null &&
    "message" in (val as Record<string, unknown>)
  );
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    // const req = ctx.getRequest();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const resp = exception.getResponse() as unknown;

      const message =
        typeof resp === "string"
          ? resp
          : isResponseObject(resp) && typeof resp.message === "string"
            ? resp.message
            : exception.message || "Error";

      return res.status(status).json(ApiResponse.error(status, message));
    }

    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = (exception as Error)?.message || "Internal server error";
    return res.status(status).json(ApiResponse.error(status, message));
  }
}
