const express = require('express');
const { HAMS } = require('@viridiasolutions/hams-external-sdk-js');

const app = express();

app.get('/webhook', async (req, res) => {
  try {
    const snapshot = HAMS.verifyWebhookSnapshot(
      req.body,
      req.headers['x-hams-signature'],
      '<YOUR_API_KEY>'
    );

    // The request needs to be responded to within 3 seconds, so respond to the request as soon as the validation is successful.
    res.status(200).end();

    // Do something with the snapshot...
    console.log(snapshot);
  } catch (error) {
    console.error(error);
  }

  res.end();
});

app.listen(3000);
