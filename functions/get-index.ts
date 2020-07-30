import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import { promises as fs } from "fs";
import * as Mustache from "mustache";
import * as moment from "moment";
import axios from "axios";
import * as aws4 from "aws4";
import { URL } from "url";

const restaurantsApiRoot = process.env.restaurants_api;
let html = "";

const loadHtml = async () => {
  if (!html) {
    html = await fs.readFile("static/index.html", "utf8");
  }
  return html;
};

const getRestaurants = async () => {
  let url = new URL(restaurantsApiRoot);
  let opts = {
    host: url.hostname,
    path: url.pathname,
  };
  aws4.sign(opts);
  let response = await axios.get(restaurantsApiRoot, {
    headers: {
      Host: opts["headers"]["Host"],
      "X-Amz-Date": opts["headers"]["X-Amz-Date"],
      Authorization: opts["headers"]["Authorization"],
      "X-Amz-Security-Token": opts["headers"]["X-Amz-Security-Token"],
    },
  });
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
