import "source-map-support/register";
import { APIGatewayProxyHandler } from "aws-lambda";
import * as AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const defaultResultCount = Number(process.env.defaultResultCount) || 8;
const restaurantsTable = process.env.restaurantsTable;

const findRestaurantsByTheme = async (theme: any, numResults: number) => {
  let req = {
    TableName: restaurantsTable,
    Limit: numResults,
    FilterExpression: "contains(themes, :theme)",
    ExpressionAttributeValues: { ":theme": theme },
  };

  let response = await dynamoDb.scan(req).promise();
  return response.Items;
};

export const handler: APIGatewayProxyHandler = async (event, _context) => {
  let req = JSON.parse(event.body);
  let restaurants = await findRestaurantsByTheme(req.theme, defaultResultCount);

  return {
    statusCode: 200,
    body: JSON.stringify(restaurants),
  };
};
