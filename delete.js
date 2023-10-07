'use strict';

const { DynamoDB } = require("aws-sdk")

const db = new DynamoDB.DocumentClient()
const TableName = process.env.NOTES


module.exports.handler = async (event) => {
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
