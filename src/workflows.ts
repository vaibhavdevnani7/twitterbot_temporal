import { proxyActivities } from '@temporalio/workflow';
// Only import the activity types
import type * as activities from './activities';

const { top_tweets } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});
const { send_email } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});


/** A workflow that simply calls an activity */
export async function emailwflow(name: string): Promise<string> {
  const tweets = await top_tweets(name);
  return await send_email(JSON.stringify(tweets));
}
