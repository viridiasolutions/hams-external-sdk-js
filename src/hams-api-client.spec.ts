import axios from 'axios';
import { Environment } from './constants';
import { HAMSApiClient } from './hams-api-client';
import { ClientConfig, WebhookResponseDto } from './models';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('HAMSApiClient', () => {
  const mockClientConfig: ClientConfig = {
    environment: Environment.Sandbox,
    clientOptions: {
      devId: 'devId',
      apiKey: 'apiKey'
    },
    httpClient: mockedAxios
  };

  const hamsApiClient = new HAMSApiClient(mockClientConfig);

  it('should be defined', () => {
    expect(hamsApiClient).toBeDefined();
  });

  describe('createWebhook', () => {
    it('should return a successfully message', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        status: 201,
        data: {
          message: 'Create web hook successfully'
        }
      });

      await expect(hamsApiClient.createWebhook('http://localhost:3000')).resolves.toBeUndefined();
    });

    it('should throw an conflict error', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        status: 409,
        data: {
          message: 'Conflict'
        }
      });

      await expect(hamsApiClient.createWebhook('http://localhost:3000')).rejects.toThrow(
        'Webhook already exists'
      );
    });

    it('should throw an error', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        status: 401,
        data: {
          message: 'Unauthorized'
        }
      });

      await expect(hamsApiClient.createWebhook('http://localhost:3000')).rejects.toThrow(
        'Failed to create webhook(401)'
      );
    });
  });

  describe('getWebhook', () => {
    it('should return a webhook', async () => {
      const webhookResponse: WebhookResponseDto = {
        endpoint: 'http://localhost:3000'
      };

      mockedAxios.get.mockResolvedValueOnce({
        status: 200,
        data: webhookResponse
      });

      await expect(hamsApiClient.getWebhook()).resolves.toEqual(webhookResponse);
    });

    it('should throw an not found error', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        status: 204
      });

      await expect(hamsApiClient.getWebhook()).rejects.toThrow('Webhook not found');
    });

    it('should throw an error', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        status: 401,
        data: {
          message: 'Unauthorized'
        }
      });

      await expect(hamsApiClient.getWebhook()).rejects.toThrow('Failed to get webhook(401)');
    });
  });

  describe('deleteWebhook', () => {
    it('should return a successfully message', async () => {
      mockedAxios.delete.mockResolvedValueOnce({
        status: 200,
        data: {
          message: 'Delete the web hook successfully'
        }
      });

      await expect(hamsApiClient.deleteWebhook()).resolves.toBeUndefined();
    });

    it('should throw an error', async () => {
      mockedAxios.delete.mockResolvedValueOnce({
        status: 401,
        data: {
          message: 'Unauthorized'
        }
      });

      await expect(hamsApiClient.deleteWebhook()).rejects.toThrow('Failed to delete webhook(401)');
    });
  });
});
