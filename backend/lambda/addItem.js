// AWS Lambda function to add a shopping list item to DynamoDB
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const tableName = process.env.TABLE_NAME || 'ShoppingList';
    const userId = event.pathParameters?.userId || 'default';
    
    try {
        const body = JSON.parse(event.body);
        const { title } = body;
        
        if (!title || title.trim() === '') {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ error: 'Title is required' })
            };
        }
        
        const itemId = uuidv4();
        const timestamp = new Date().toISOString();
        
        const params = {
            TableName: tableName,
            Item: {
                userId: userId,
                itemId: itemId,
                title: title.trim(),
                createdAt: timestamp
            }
        };
        
        await dynamodb.put(params).promise();
        
        return {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS'
            },
            body: JSON.stringify({
                id: itemId,
                title: title.trim()
            })
        };
    } catch (error) {
        console.error('Error adding item:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: 'Failed to add item' })
        };
    }
};
