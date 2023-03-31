import { Environment } from '../constants';
import { createAxiosInstanceByEnvironment } from './axios.helper';

describe('AxiosHelper', () => {
  describe('createAxiosInstance', () => {
    it('should create an axios instance', () => {
      const axiosInstance = createAxiosInstanceByEnvironment(Environment.Sandbox);
      expect(axiosInstance).toBeDefined();
    });
  });
});
