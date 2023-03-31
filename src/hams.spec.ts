import axios from 'axios';
import { Environment } from './constants';
import { HAMS } from './hams';
import * as AxiosHelper from './helpers/axios.helper';
import { SnapshotResponseDto } from './models';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('HAMS', () => {
  describe('createApiClient', () => {
    it('should create an HAMS api client', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        status: 200,
        data: {
          accessToken: '1234567890',
          expiresIn: 3600
        }
      });

      jest.spyOn(AxiosHelper, 'createAxiosInstanceByEnvironment').mockReturnValue(mockedAxios);

      await expect(
        HAMS.createApiClient(Environment.Sandbox, {
          devId: '1234567890',
          apiKey: '1234567890'
        })
      ).resolves.toBeDefined();
    });

    it('should throw an error', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        status: 400,
        data: {
          message: 'Invalid devId or apiKey'
        }
      });

      jest.spyOn(AxiosHelper, 'createAxiosInstanceByEnvironment').mockReturnValue(mockedAxios);

      await expect(
        HAMS.createApiClient(Environment.Sandbox, {
          devId: '1234567890',
          apiKey: '1234567890'
        })
      ).rejects.toThrow('Failed to create http client(Invalid devId or apiKey)');
    });
  });

  describe('verifyWebhookSnapshot', () => {
    const snapshot: SnapshotResponseDto = {
      dataId: '64224ed98971a5b3bc433e14',
      vehicleNumber: '4001',
      sendDate: new Date('2020-01-01T00:00:00.000Z'),
      latitude: 13.736717,
      longitude: 100.523186,
      metrics: [
        {
          name: 'SOC',
          value: 50
        }
      ]
    };

    it('should return validated webhook snapshot', () => {
      expect(
        HAMS.verifyWebhookSnapshot(
          JSON.stringify(snapshot),
          'e6a652e3de471c708c876806a529004ac081bcba6c414c66f01d9633a2866ea9',
          'abcdefg'
        )
      ).toEqual(snapshot);
    });

    it('should throw an error', () => {
      expect(() => {
        HAMS.verifyWebhookSnapshot(
          JSON.stringify(snapshot),
          'e6a652e3de471c708c876806a529004ac081bcba6c414c66f01d9633a2866ea9',
          'abcdefggg'
        );
      }).toThrow('Invalid signature');
    });
  });
});
