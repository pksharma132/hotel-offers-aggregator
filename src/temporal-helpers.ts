import { Client, Connection } from '@temporalio/client';
import { QueryParams } from './validation-schema';
import { logger } from './logger';

export async function getTemporalClient() {
  const connection = await Connection.connect({ address: process.env.TEMPORAL_ADDRESS || 'localhost:7233' });

  const client = new Client({
    connection,
  });

  return client;
}

export async function runWorkflow(taskQueue: string, args: QueryParams) {
  const client = await getTemporalClient();

  const handle = await client.workflow.start('aggregateHotelsWorkflow', {
    taskQueue,
    args: [args],
    workflowId: 'workflow-' + Date.now(),
  });
  console.log(`Started workflow ${handle.workflowId}`);

  const res = await handle.result();

  logger.info({ res }, 'Workflow completed');

  return res;
}
