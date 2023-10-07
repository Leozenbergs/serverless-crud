'use strict';

const { DynamoDB } = require("aws-sdk")
const { v4: uuidv4 } = require('uuid');

const db = new DynamoDB.DocumentClient()
const TableName = process.env.NOTES

module.exports.handler = async (event, context) => {
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

  if (!data?.title || !data.message) return {
    statusCode: 400,
    headers: { 'Content-Type': 'text/plain' },
    body: 'Couldn\'t create the Note item.',
  }

  await db
    .put(params, (error) => {
      // handle potential errors
      if (error) {
        console.error(error);
        return {
          statusCode: error.statusCode || 501,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Couldn\'t create the todo item.',
        }
      }
    })
    .promise()

  return { statusCode: 200, body: JSON.stringify(newNote), event: event }
};
