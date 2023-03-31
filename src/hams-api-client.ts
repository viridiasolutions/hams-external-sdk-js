import { HttpStatusCode } from 'axios';
import { ClientConfig, WebhookResponseDto } from './models';

export class HAMSApiClient {
  /** @hidden */
  private readonly clientConfig: ClientConfig;

  /** @hidden */
  constructor(clientConfig: ClientConfig) {
    this.clientConfig = clientConfig;
  }

  /**
   * Create webhook endpoint
   * @group Webhook
   * @param endpoint - Webhook endpoint
   * @throws {Error} If webhook already exists
   * @throws {Error} If failed to create webhook
   */
  async createWebhook(endpoint: string) {
    const response = await this.clientConfig.httpClient.post(
      `/company/webhook`,
      {
        endpoint: endpoint
      },
      {
        headers: {
          Accept: 'application/json'
        }
      }
    );

    if (response.status === HttpStatusCode.Conflict) {
      throw new Error(`Webhook already exists`);
    } else if (response.status !== HttpStatusCode.Created) {
      throw new Error(`Failed to create webhook(${response.status})`);
    }
  }

  /**
   * Get webhook endpoint
   * @group Webhook
   * @throws {Error} If webhook not found
   * @throws {Error} If failed to get webhook
   */
  async getWebhook() {
    const response = await this.clientConfig.httpClient.get(`/company/webhook`, {
      headers: {
        Accept: 'application/json'
      }
    });

    if (response.status === HttpStatusCode.NoContent) {
      throw new Error(`Webhook not found`);
    } else if (response.status !== HttpStatusCode.Ok) {
      throw new Error(`Failed to get webhook(${response.status})`);
    }

    return response.data as WebhookResponseDto;
  }

  /**
   * Delete webhook endpoint
   * @group Webhook
   * @throws {Error} If failed to delete webhook
   */
  async deleteWebhook() {
    const response = await this.clientConfig.httpClient.delete(`/company/webhook`, {
      headers: {
        Accept: 'application/json'
      }
    });

    if (response.status !== HttpStatusCode.Ok) {
      throw new Error(`Failed to delete webhook(${response.status})`);
    }
  }
}
