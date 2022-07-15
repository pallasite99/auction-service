# Codingly.io: Base Serverless Framework Template

https://codingly.io

## What's included
* Folder structure used consistently across our projects.
* [serverless-pseudo-parameters plugin](https://www.npmjs.com/package/serverless-pseudo-parameters): Allows you to take advantage of CloudFormation Pseudo Parameters.
* [serverless-bundle plugin](https://www.npmjs.com/package/serverless-pseudo-parameters): Bundler based on the serverless-webpack plugin - requires zero configuration and fully compatible with ES6/ES7 features.

## Getting started
```
sls create --name YOUR_PROJECT_NAME --template-url https://github.com/codingly-io/sls-base
cd YOUR_PROJECT_NAME
npm install
```

## Sample CreateAuction using AWSLambda

```

Retrieving CloudFormation stack
Removing old service artifacts from S3

✔ Service deployed to stack auction-svc-dev (99s)

endpoint: POST - https://qidtybvjsi.execute-api.us-east-1.amazonaws.com/dev/auction
functions:
  createAuction: auction-svc-dev-createAuction (75 kB)

Stack Outputs:
  CreateAuctionLambdaFunctionQualifiedArn: arn:aws:lambda:us-east-1:517782367944:function:auction-svc-dev-createAuction:1
  ServiceEndpoint: https://qidtybvjsi.execute-api.us-east-1.amazonaws.com/dev
  ServerlessDeploymentBucketName: auction-svc-dev-serverlessdeploymentbucket-1fypjcecnxq0j

1 deprecation found: run 'serverless doctor' for more details

Monitor all your API routes with Serverless Console: run "serverless --console"

```

You are ready to go!
