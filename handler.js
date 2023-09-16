'use strict';

const { DynamoDB } = require("aws-sdk")
const { v4: uuidv4 } = require('uuid');

const db = new DynamoDB.DocumentClient()
const TableName = process.env.NOTES || 'dev-notes'

module.exports.create = async (event, context, callback) => {
  const data = JSON.parse(event.body);
  const newNote = {
    "id": uuidv4(),
    "title": data.title,
    "message": data.message,
  }
  const params = {
    TableName,
    Item: newNote,
  }

  if (typeof data.title !== 'string' || typeof data.message !== 'string') {
    console.error('Validation Failed');
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t create the Note item.',
    });
    return;
  }

  await db
    .put(params, (error) => {
      // handle potential errors
      if (error) {
        console.error(error);
        callback(null, {
          statusCode: error.statusCode || 501,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Couldn\'t create the todo item.',
        });
        return;
      }
  
      // create a response
      const response = {
        statusCode: 200,
        body: JSON.stringify(params.Item),
      };
      callback(null, response);
    })
    .promise()

  return { statusCode: 200, body: JSON.stringify(newNote), event: event }
};

module.exports.list = async (event) => {
  const notes = await db
    .scan({
      TableName,
    })
    .promise()

  return { statusCode: 200, body: JSON.stringify(notes) }
};

module.exports.delete = async (event) => {
  const noteToBeRemoved = event.pathParameters.id

  await db
    .delete({
      TableName,
      Key: {
        id: noteToBeRemoved,
      },
    })
    .promise()

  return { statusCode: 200 }
}
