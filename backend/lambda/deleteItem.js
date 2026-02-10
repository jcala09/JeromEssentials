// AWS Lambda function to delete a shopping list item from DynamoDB
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const tableName = process.env.TABLE_NAME || 'ShoppingList';
    const userId = event.pathParameters?.userId || 'default';
    const itemId = event.pathParameters?.itemId;
    
    try {
        if (!itemId) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ error: 'Item ID is required' })
            };
        }
        
        const params = {
            TableName: tableName,
            Key: {
                userId: userId,
                itemId: itemId
            }
        };
        
        await dynamodb.delete(params).promise();
        
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS'
            },
            body: JSON.stringify({ message: 'Item deleted successfully' })
        };
    } catch (error) {
        console.error('Error deleting item:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: 'Failed to delete item' })
        };
    }
};
