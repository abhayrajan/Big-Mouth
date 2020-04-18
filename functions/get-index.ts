import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import { promises as fs } from "fs";
import * as path from "path";

let html = "";

const loadHtml = async () => {
  if (!html) {
    html = await fs.readFile("static/index.html", "utf8");
  }
  return html;
};

export const handler: APIGatewayProxyHandler = async (event, _context) => {
  let html = await loadHtml();

  return {
    statusCode: 200,
    body: html,
    headers: {
      "Content-Type": "text/html; charset=UTF-8",
    },
  };
};
