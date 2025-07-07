export interface CloudinaryUploadResponse {
  success: boolean;
  url?: string;
  public_id?: string;
  error?: string;
}

export interface CloudinaryResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
}
