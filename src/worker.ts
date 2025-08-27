import { NativeConnection, Worker } from '@temporalio/worker';
import * as activities from './activities/aggregate-activities';
import { HOTEL_OFFER_TASK_QUEUE } from './constants';

async function run() {
  console.log('Worker starting...', process.env.TEMPORAL_ADDRESS);

  let connection;
  while (!connection) {
    try {
      connection = await NativeConnection.connect({
        address: process.env.TEMPORAL_ADDRESS || 'localhost:7233',
      });
    } catch (err) {
      console.error('Temporal not ready yet, retrying in 3s...', err);
      await new Promise((res) => setTimeout(res, 3000));
    }
  }

  const worker = await Worker.create({
    connection,
    taskQueue: HOTEL_OFFER_TASK_QUEUE,
    workflowsPath: require.resolve('./workflows/aggregate'),
    activities,
  });

  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
