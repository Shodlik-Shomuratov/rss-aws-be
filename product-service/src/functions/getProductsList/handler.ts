// Extra libraries
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';


// Response
import { FormatJSONResponse } from '@libs/api-gateway';


// DynamoDB
import { getAll } from "@libs/dynamo";


// Get products list
const getProductsList: ValidatedEventAPIGatewayProxyEvent<void> = async () => {
  const productsTable = process.env.productsTable;
  const products = await getAll(productsTable);

  return FormatJSONResponse({
    products
  });
};


export const main = middyfy(getProductsList);
