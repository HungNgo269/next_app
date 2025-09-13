export interface ActionResult {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  redirectTo?: string;
}
