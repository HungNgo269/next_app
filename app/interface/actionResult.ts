export interface ActionResult {
  success: boolean;
  message?: string;
  // errors?: string | null;
  errors?: Record<string, string[]>;
  redirectTo?: string;
  data?: any;
}
