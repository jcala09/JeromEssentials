// AWS Lambda function to get shopping list items from DynamoDB
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const tableName = process.env.TABLE_NAME || 'ShoppingList';
    const userId = event.pathParameters?.userId || 'default';
    
    try {
        const params = {
            TableName: tableName,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        };
        
        const result = await dynamodb.query(params).promise();
        
        const items = result.Items.map(item => ({
            id: item.itemId,
            title: item.title
        }));
        
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS'
            },
            body: JSON.stringify(items)
        };
    } catch (error) {
        console.error('Error getting items:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: 'Failed to get items' })
        };
    }
};
