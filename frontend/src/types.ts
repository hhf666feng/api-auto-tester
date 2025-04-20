export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiParameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
}

export interface ApiResponse {
  code: number;
  data: any;
  message: string;
}

export type ApiStatus = 'success' | 'failed' | 'not_tested';

export interface ApiDetail {
  id: string;
  name: string;
  method: ApiMethod;
  path: string;
  description: string;
  parameters: ApiParameter[];
  headers: Record<string, string>;
  response: ApiResponse;
  status?: ApiStatus;
  lastTestedAt?: string;
} 