import { APIGatewayProxyHandler } from "aws-lambda";
import * as AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const defaultResultCount = process.env.defaultResultCount || 8;

export const handler: APIGatewayProxyHandler = async (event, _context) => {
  let restaurants = getRestaurants(defaultResultCount);

  return {
    statusCode: 200,
    body: JSON.stringify(restaurants),
  };
};
