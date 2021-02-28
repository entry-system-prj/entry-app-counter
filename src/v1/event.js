'use strict';

const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const name = requestBody.name;
  const start_date = requestBody.start_date;
  const detail = requestBody.detail;
  const data = {name, start_date, detail};

  if (typeof name !== 'string' || typeof start_date !== 'string' || typeof detail !== 'string') {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t submit candidate because of validation errors.'));
    return;
  }

  putData(createPostData(data))
    .then(res => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Sucessfully created event with name ${name}.`,
          data,
        })
      });
    })
    .catch(err => {
      console.log(err);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `Unable to create event with name ${name}.`,
          data,
        })
      })
    });
};

module.exports.list = (event, context, callback) => {
  const params = {
      TableName: process.env.EVENT_TABLE_NAME,
      // ProjectionExpression: "id, fullname, email"
  };

  console.log("Scanning Candidate table.");
  const onScan = (err, data) => {
      if (err) {
          console.log('Scan failed to load data. Error JSON:', JSON.stringify(err, null, 2));
          callback(err);
      } else {
          console.log("Scan succeeded.");
          return callback(null, {
              statusCode: 200,
              body: JSON.stringify({
                  event: data.Items
              })
          });
      }
  };

  dynamoDb.scan(params, onScan);
};

const putData = item => {
  console.log('Put data');
  const data = {
    TableName: process.env.EVENT_TABLE_NAME,
    Item: item,
  };
  return dynamoDb.put(data).promise();
};

const createPostData = (data) => {
  const timestamp = new Date().toISOString();
  return {
    id: uuidv4(),
    ...data,
    created_at: timestamp,
    updated_at: timestamp,
  };
};
