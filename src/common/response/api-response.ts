export class ApiResponse<T> {
  constructor(
    public status: number,
    public message: string,
    public data: T | null,
  ) {}

  static success<T>(data: T): ApiResponse<T> {
    return new ApiResponse(200, "Success", data);
  }

  static successMessage<T>(message: string, data: T): ApiResponse<T> {
    return new ApiResponse(200, message, data);
  }

  // Return type allows null safely
  static error<T = null>(
    status: number,
    message: string,
  ): ApiResponse<T | null> {
    return new ApiResponse<T | null>(status, message, null);
  }
}
