// Extra libraries
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';


// Responses
import { 
  FormatJSONResponse,
  NotFoundResponse,
  InternalServerError
} from '@libs/api-gateway';


// DynamoDB
import { getAll, getById } from "@libs/dynamo";


// Get products by id
const getProductsById: ValidatedEventAPIGatewayProxyEvent<void> = async (event) => {
  try {
    const productId = event.pathParameters.productId;
    const productsTable = process.env.productsTable;
    const stocksTable = process.env.stocksTable;
    const product = await getById(productId, productsTable);
    const stock = await getAll(stocksTable);

    if (!product.length) {
      return NotFoundResponse({
        message: `Product with ID=${productId} not found!`
      });
    }

    const item = stock.find(item => item.product_id === productId);

    return FormatJSONResponse({
      product: {
        ...product[0],
        count: item.count
      }
    });
  } catch (error) {
    return InternalServerError({
      message: "Internal Server Error"
    });
  }
};


export const main = middyfy(getProductsById);
