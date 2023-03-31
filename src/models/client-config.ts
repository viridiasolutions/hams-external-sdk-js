import { AxiosInstance } from 'axios';
import { Environment } from '../constants';
import { ClientOptions } from './client-options';

/** @hidden */
export interface ClientConfig {
  environment: Environment;
  clientOptions: ClientOptions;
  httpClient: AxiosInstance;
}
