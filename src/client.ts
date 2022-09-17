import { Connection, WorkflowClient } from '@temporalio/client';
import { emailwflow } from './workflows';
import { nanoid } from 'nanoid';
import express = require("express");
import bodyParser = require("body-parser");


async function run() {
  const app = express();
  const PORT = 80;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  
  // Connect to the default Server location (localhost:7233)
  const connection = await Connection.connect();
  

  const client = new WorkflowClient({
    connection,
  });

  

  app.post("/webhook/twitter", (req, res) => {
    console.log(req.body);
    console.log(req.body.follow_events[0].target.id);
    client.start(emailwflow, {
      // type inference works! args: [name: string]
      args: [(req.body.follow_events[0].target.id).toString()],
      taskQueue: 'emails',
      // in practice, use a meaningful business id, eg customerId or transactionId
      workflowId: 'workflow-' + (req.body.follow_events[0].target.id).toString(),
    });
  
    res.status(200).end();
    
  });

}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
