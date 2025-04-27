import axios from 'axios';
import { API_BASE_URL } from '../config';

export interface QueryParam {
  name: string;
  type: 'string' | 'number' | 'boolean';
  required: boolean;
  description?: string;
}

export interface RequestBody {
  type: 'json' | 'form-data' | 'x-www-form-urlencoded';
  schema?: any;
  example?: any;
}

export interface Response {
  statusCode: number;
  description: string;
  schema?: any;
  example?: any;
}

export interface Api {
  id: string;
  name: string;
  description?: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  headers?: { [key: string]: string };
  queryParams?: QueryParam[];
  requestBody?: RequestBody;
  responses?: Response[];
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateApiDto extends Omit<Api, 'id' | 'createdAt' | 'updatedAt'> {}
export interface UpdateApiDto extends Partial<CreateApiDto> {}

class ApiService {
  private baseUrl = API_BASE_URL;

  async getProjectApis(projectId: string): Promise<Api[]> {
    const response = await axios.get(`${this.baseUrl}/projects/${projectId}/apis`);
    return response.data;
  }

  async createApi(api: CreateApiDto): Promise<Api> {
    const response = await axios.post(`${this.baseUrl}/apis`, api);
    return response.data;
  }

  async getApiDetail(apiId: string): Promise<Api> {
    const response = await axios.get(`${this.baseUrl}/apis/${apiId}`);
    return response.data;
  }

  async updateApi(apiId: string, api: UpdateApiDto): Promise<Api> {
    const response = await axios.put(`${this.baseUrl}/apis/${apiId}`, api);
    return response.data;
  }

  async deleteApi(apiId: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/apis/${apiId}`);
  }
}

export const apiService = new ApiService(); 