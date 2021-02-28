### 参考リンク
https://www.serverless.com/blog/node-rest-api-with-serverless-lambda-and-dynamodb

### Requirements
- Node.js >= `15.0.0` 
- Serverless Framework
- aws-cli

### Usage

#### Create event
```
curl -H "Content-Type: application/json" -X POST -d @src/v1/mock/request_event.json https://XXX.us-east-1.amazonaws.com/dev/v1/event/create
```

#### Show event
```
curl -s https://XXX.us-east-1.amazonaws.com/dev/v1/event/list
```
