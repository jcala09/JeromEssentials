import React, {useState, useEffect} from 'react';
import { FaFolder } from 'react-icons/fa';
import './ShoppingList.css'
import api from '../services/api';


function ShoppingList() {
    const [list, setList]= useState([]);
    const [inputData, setInputData]= useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load items from database when component loads
    useEffect(() => {
        const loadItems = async () => {
            try {
                setLoading(true);
                const items = await api.getItems();
                setList(items);
                setError(null);
            } catch (err) {
                console.error('Failed to load items:', err);
                setError('Failed to load items. Make sure your API is configured.');
            } finally {
                setLoading(false);
            }
        };
        loadItems();
    }, []);

    const handleAddItem = async () => {
        if (inputData.trim() !== '') {
            const title = inputData.trim();
            setInputData(''); // Clear input immediately
            
            // Optimistically add to UI
            const tempItem = { id: Date.now().toString(), title };
            setList(prevList => [...prevList, tempItem]);
            
            try {
                // Save to database
                const newItem = await api.addItem(title);
                // Replace temp item with real item from database
                setList(prevList => 
                    prevList.map(item => 
                        item.id === tempItem.id ? newItem : item
                    )
                );
                setError(null);
            } catch (err) {
                console.error('Failed to add item:', err);
                // Remove the temp item if save failed
                setList(prevList => prevList.filter(item => item.id !== tempItem.id));
                setInputData(title); // Restore input
                setError('Failed to save item. Check your API configuration.');
            }
        }
    }

    const handleDelItem = async (itemId) => {
        // Optimistically remove from UI
        const itemToDelete = list.find(item => item.id === itemId);
        setList(prevList => prevList.filter(item => item.id !== itemId));
        
        try {
            // Delete from database
            await api.deleteItem(itemId);
            setError(null);
        } catch (err) {
            console.error('Failed to delete item:', err);
            // Restore item if delete failed
            if (itemToDelete) {
                setList(prevList => [...prevList, itemToDelete]);
            }
            setError('Failed to delete item. Check your API configuration.');
        }
    }
    return (
        <>
        
        <div className= 'background' />
            <div className = "ShoppingList">
            <h1 className= 'TitleContainer'>Shopping List</h1>
            <div className= 'Input'>
            
                <input 
                    type="text" 
                    value={inputData} 
                    onChange= {(event) => setInputData(event.target.value)}
                    onKeyPress={(event) => {
                        if (event.key === 'Enter') {
                            handleAddItem();
                        }
                    }}
                    placeholder="Add item to shopping list..."
                />
                <button onClick={() => handleAddItem()}>+ {FaFolder}</button>
            </div>
            {error && (
                <div style={{color: 'red', padding: '10px', fontSize: '14px'}}>
                    {error}
                </div>
            )}
            {loading ? (
                <div style={{padding: '20px', textAlign: 'center'}}>Loading your shopping list...</div>
            ) : (
                <div className='items-list'>
                    {list.length === 0 ? (
                        <div style={{padding: '20px', textAlign: 'center', color: '#666'}}>
                            Your shopping list is empty. Add items above!
                        </div>
                    ) : (
                        list.map((item) => {
                            return (
                                <div key={item.id}> 
                                    <p onClick={() => handleDelItem(item.id)}>{item.title}</p>
                                </div>
                            )
                        })
                    )}
                </div>
            )}
            </div>
        </>
    );
}
export default ShoppingList