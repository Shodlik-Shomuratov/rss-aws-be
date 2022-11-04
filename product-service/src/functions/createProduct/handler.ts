// Extra libraries
import { v4 as uuidv4 } from 'uuid';


// Libraries
import { BadRequestResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { FormatJSONResponse } from '@libs/api-gateway';
import { create, getById } from '@libs/dynamo';
import { create as createValidation } from '@libs/validation';


// Schema
import schema from './schema';


// Get products list
const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    const { error, value: body } = createValidation.validate(event.body);

    if (error) {
        return BadRequestResponse({
            message: error.message
        });
    }

  const productsTable = process.env.productsTable;
  const stocksTable = process.env.stocksTable;

  const productItem = {
    id: uuidv4(),
    title: body.title,
    description: body.description,
    price: body.price
  }

  const stockItem = {
    id: uuidv4(),
    product_id: productItem.id,
    count: body.count
  }

  await create(productItem, productsTable);
  await create(stockItem, stocksTable);

  const product = await getById(productItem.id, productsTable);

  return FormatJSONResponse({
    message: "Product created successfully!",
    product: product[0]
  });
};


export const main = middyfy(createProduct);
