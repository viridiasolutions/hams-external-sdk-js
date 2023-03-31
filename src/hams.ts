import cryptojs from 'crypto-js';
import { jsonDateParser } from 'json-date-parser';
import { Environment } from './constants';
import { HAMSApiClient } from './hams-api-client';
import {
  autoRefreshToken,
  createAxiosInstanceByEnvironment,
  setAccessToken
} from './helpers/axios.helper';
import {
  AccessTokenRequestDto,
  AccessTokenResponseDto,
  ClientOptions,
  GenericMessageResponseDto,
  SnapshotResponseDto
} from './models';
import { ClientConfig } from './models/client-config';

export class HAMS {
  /** @hidden */
  constructor() {}

  /**
   * Create HAMS client
   * @param environment - external api environment
   * @param options - client options
   * @throws {Error} If failed to create http client
   */
  static async createApiClient(environment: Environment, options: ClientOptions) {
    const clientConfig: ClientConfig = {
      environment: environment,
      clientOptions: options,
      httpClient: await this.getHttpClient(environment, options)
    };

    const hamsClient = new HAMSApiClient(clientConfig);

    return hamsClient;
  }

  /** @hidden */
  private static async getHttpClient(environment: Environment, options: ClientOptions) {
    const httpClient = createAxiosInstanceByEnvironment(environment);

    const accessTokenRequestDto: AccessTokenRequestDto = {
      devId: options.devId,
      apiKey: options.apiKey
    };

    const response = await httpClient.post(`/auth/token`, accessTokenRequestDto, {
      headers: {
        Accept: 'application/json'
      }
    });

    if (response.status !== 200) {
      const body = response.data as GenericMessageResponseDto;
      throw new Error(`Failed to create http client(${body.message})`);
    }

    const body = response.data as AccessTokenResponseDto;
    setAccessToken(httpClient, body.accessToken);
    autoRefreshToken(httpClient, accessTokenRequestDto);

    return httpClient;
  }

  /**
   * Verify webhook snapshot
   * @param payload - raw json body from webhook request
   * @param signature - signature from webhook request
   * @param apiKey - api key
   * @throws {Error} If signature is invalid
   */
  static verifyWebhookSnapshot(payload: string, signature: string, apiKey: string) {
    const calcSignature = cryptojs.HmacSHA256(payload, apiKey).toString();

    if (signature !== calcSignature) {
      throw new Error('Invalid signature');
    }

    return JSON.parse(payload, jsonDateParser) as SnapshotResponseDto;
  }
}
