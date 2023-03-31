export interface SnapshotResponseDto {
  /**
   * Primary key of snapshot
   */
  dataId: string;
  /**
   * Vehicle number
   */
  vehicleNumber: string;
  /**
   * Send date of snapshot
   */
  sendDate: Date;
  /**
   * Latitude
   */
  latitude: number;
  /**
   * Longitude
   */
  longitude: number;
  /**
   * CAN Metrics of vehicle
   */
  metrics: [
    {
      /**
       * Metric name
       */
      name: string;
      /**
       * CAN value
       */
      value: number;
    }
  ];
}
