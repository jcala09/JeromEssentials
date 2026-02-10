// API service to connect React app to AWS DynamoDB database
// Replace the API_BASE_URL with your actual API Gateway URL after deployment

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/dev';
const USER_ID = 'default'; // Using default user for now

class ShoppingListAPI {
    async getItems() {
        try {
            const response = await fetch(`${API_BASE_URL}/items/${USER_ID}`);
            if (!response.ok) {
                throw new Error('Failed to fetch items');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching items:', error);
            return [];
        }
    }

    async addItem(title) {
        try {
            const response = await fetch(`${API_BASE_URL}/items/${USER_ID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title }),
            });
            if (!response.ok) {
                throw new Error('Failed to add item');
            }
            return await response.json();
        } catch (error) {
            console.error('Error adding item:', error);
            throw error;
        }
    }

    async deleteItem(itemId) {
        try {
            const response = await fetch(`${API_BASE_URL}/items/${USER_ID}/${itemId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete item');
            }
            return await response.json();
        } catch (error) {
            console.error('Error deleting item:', error);
            throw error;
        }
    }
}

export default new ShoppingListAPI();
