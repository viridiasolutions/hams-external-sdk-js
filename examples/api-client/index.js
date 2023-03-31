const { HAMS, Environment } = require('@viridiasolutions/hams-external-sdk-js');

const run = async () => {
  try {
    // Create HAMS API client with your credentials
    const hamsApiClient = await HAMS.createApiClient(Environment.Sandbox, {
      devId: '<YOUR_DEV_ID>',
      apiKey: '<YOUR_API_KEY>'
    });

    //Create webhook with your http endpoint
    await hamsApiClient.createWebhook('<YOUR_API_ENDPOINT>');

    //Get your webhook endpoint
    await hamsApiClient.getWebhook();

    //Delete your webhook
    await hamsApiClient.deleteWebhook();
  } catch (error) {
    console.error(error);
  }
};

run();
