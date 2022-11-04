import type { AWS } from '@serverless/typescript';

import getProductsList from '@functions/getProductsList';
import getProductsById from '@functions/getProductsById';
import createProduct from '@functions/createProduct';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    region: "ap-southeast-1",
    stage: "dev",
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      productsTable: "${self:custom.productsTableName}",
      stocksTable: "${self:custom.stocksTableName}",
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: "dynamodb:*",
            Resource: [
              "arn:aws:dynamodb:${self:provider.region}:${aws:accountId}:table/${self:custom.productsTableName}"
            ]
          },
          {
            Effect: "Allow",
            Action: "dynamodb:*",
            Resource: [
              "arn:aws:dynamodb:${self:provider.region}:${aws:accountId}:table/${self:custom.stocksTableName}"
            ]
          }
        ]
      }
    },
  },


  // import the function via paths
  functions: { getProductsList, getProductsById, createProduct },
  package: { individually: true },
  custom: {
    productsTableName: "${sls:stage}-table-products",
    stocksTableName: "${sls:stage}-table-stocks",
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },

  
  resources: {
    Resources: {
      productsTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "${self:custom.productsTableName}",
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH"
            }
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          }
        }
      },
      stocksTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "${self:custom.stocksTableName}",
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH"
            }
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          }
        }
      },
    }
  }
};

module.exports = serverlessConfiguration;
