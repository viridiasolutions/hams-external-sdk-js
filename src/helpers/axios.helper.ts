import axios, { AxiosInstance, HttpStatusCode } from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { Environment } from '../constants';
import {
  AccessTokenRequestDto,
  AccessTokenResponseDto,
  GenericMessageResponseDto
} from '../models';

export const createAxiosInstanceByEnvironment = (environment: Environment) => {
  const instance = axios.create({
    baseURL: environment
  });

  return instance;
};

export const setAccessToken = (axiosInstance: AxiosInstance, accessToken: string) => {
  axiosInstance.interceptors.request.use((request) => {
    request.headers['Authorization'] = `Bearer ${accessToken}`;
    return request;
  });
};

export const autoRefreshToken = (
  axiosInstance: AxiosInstance,
  accessTokenRequestDto: AccessTokenRequestDto
) => {
  createAuthRefreshInterceptor(axiosInstance, async (failedRequest) => {
    const response = await axiosInstance.post('/auth/token', accessTokenRequestDto, {
      headers: {
        Accept: 'application/json'
      }
    });

    if (response.status !== HttpStatusCode.Ok) {
      const body = response.data as GenericMessageResponseDto;
      throw new Error(`Failed to refresh token(${body.message})`);
    }

    const body = response.data as AccessTokenResponseDto;
    setAccessToken(axiosInstance, body.accessToken);

    failedRequest.response.config.headers['Authorization'] = `Bearer ${body.accessToken}`;
  });
};
