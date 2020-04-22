import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import { promises as fs } from "fs";
import * as Mustache from "mustache";
import * as moment from "moment";
import axios from "axios";

const restaurantsApiRoot = process.env.restaurants_api;
let html = "";

const loadHtml = async () => {
  if (!html) {
    html = await fs.readFile("static/index.html", "utf8");
  }
  return html;
};

const getRestaurants = async () => {
  let response = await axios.get(restaurantsApiRoot);
  return response.data;
};

export const handler: APIGatewayProxyHandler = async (event, _context) => {
  let template = await loadHtml();
  let restaurants = await getRestaurants();
  let dayOfWeek = moment().format("dddd");
  let html = Mustache.render(template, { dayOfWeek, restaurants });

  return {
    statusCode: 200,
    body: html,
    headers: {
      "Content-Type": "text/html; charset=UTF-8",
    },
  };
};
