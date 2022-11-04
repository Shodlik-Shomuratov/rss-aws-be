import * as AWS from "aws-sdk";


// DynamoDB Document Client
const dynamo = new AWS.DynamoDB.DocumentClient();


// Get all products and counts
export const getAll = async (tableName: string) => {
    const { Items } = await dynamo.scan({
        TableName: tableName
    }).promise();

    return Items;
}


// Get product by ID
export const getById = async (productId: string, tableName: string) => {
    const { Items } = await dynamo.query({
        TableName: tableName,
        KeyConditionExpression: "id = :productId",
        ExpressionAttributeValues: {
            ':productId': productId
        }
    }).promise();

    return Items;
}


// Create product
export const create = async (data: Record<string, any>, tableName: string) => {
    return await dynamo.put({
        TableName: tableName,
        Item: data
    }).promise();
}