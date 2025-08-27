import { NativeConnection, Worker } from '@temporalio/worker';
import * as activities from './activities/aggregate-activities';
import { HOTEL_OFFER_TASK_QUEUE } from './constants';

async function run() {
  const connection = await NativeConnection.connect({
    address: 'localhost:7233',
  });
  try {
    const worker = await Worker.create({
      connection,
      taskQueue: HOTEL_OFFER_TASK_QUEUE,
      workflowsPath: require.resolve('./workflows/aggregate'),
      activities,
    });

    await worker.run();
  } finally {
    await connection.close();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
