import React, {useState} from 'react';
import { FaFolder } from 'react-icons/fa';
import './ShoppingList.css'


function ShoppingList() {
    const [list, setList]= useState([]);
    const [inputData, setInputData]= useState('');

    const handleAddItem = () => {
        const newList= [...list, {title:inputData}] // make a new list with input data
        setList(newList); // set a new list
        setInputData(''); // set a data
        console.log(list); //output if it is saving data
    }

    const handleDelItem= (index) => {
        const newList= [];
        for( let i =0; i <list.length; i++)
        {
            if (index !== i)
            {
                newList.push(list[i]);
            }
        }
        setList(newList);
    }
    return (
        <>
        
        <div className= 'background' />
            <div className = "ShoppingList">
            <h1 className= 'TitleContainer'>Shopping List</h1>
            <div className= 'Input'>
            
                <input type="text" value={inputData} onChange= {(event) => setInputData(event.target.value)}/>
                <button onClick={() => handleAddItem()}>+ {FaFolder}</button>
            </div>
            <div className='items-list'>
                {list.map( (item,index) =>{
                return (
                <div> 
                    <p onClick={() => handleDelItem(index)}>{item.title}</p>
                </div>
                )
                })}
            </div>
            </div>
        </>
    );
}
export default ShoppingList