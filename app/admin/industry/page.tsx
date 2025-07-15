'use client';
import { useState } from "react";
import axios from "axios";
export default function IndustryPage(){
    const [industry, setIndustry] = useState('');


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            console.log('Submitting industry:', industry);
            const response = await axios.post('/api/industry', { name: industry });
            console.log('Industry submitted:', response.data);
            setIndustry(''); // Clear the input field after submission 
        }
        catch(error){
            console.error('Error submitting industry:', error);
        }
    }
    return (
        <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Industry Page</h1>
        <form onSubmit={handleSubmit}>
            <label className="block mb-2">
                Industry Name:
                <input type="text" 
                    value={industry} 
                    onChange={(e) => setIndustry(e.target.value)} 
                    className="border p-2 w-full" 
                    placeholder="Enter industry name" />
            </label>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Industry</button>
        </form>
        </div>
    )
    
}