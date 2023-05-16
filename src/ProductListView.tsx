import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

type ProductEntry = {
    id: number,
    name: string,
    description: string,
    quantity: number,
};

type ProductList = {
    id: number,
    name: string,
    description: string,
    entries: ProductEntry[],
};

export function ProductListView() {
    const [data, setData] = useState<ProductList | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [entryName, setEntryName] = useState('');
    const [entryQuantity, setEntryQuantity] = useState('');
    const [entryDescription, setEntryDescription] = useState('');
    let { id } = useParams();

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        let res = await fetch(`http://localhost:8000/products/product_lists/${id}/`);
        let data = await res.json();
        setData(data);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await fetch(`http://localhost:8000/products/entries/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: entryName,
                quantity: entryQuantity,
                description: entryDescription,
                product_list_id: id,
            }),
        });

        fetchData();
        setEntryName('');
        setEntryQuantity('');
        setEntryDescription('');
    };

    const handleDelete = async (entryId: number) => {
        await fetch(`http://localhost:8000/products/entries/${entryId}/`, {
            method: 'DELETE',
        });

        fetchData();
    };

    return (
        <div className="App" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            {data && (
                <div key={data.id} style={{ marginBottom: '20px' }}>
                    <h1 style={{ color: 'green' }}>{data.name}: {data.description}</h1>
                    {data.entries.map((entry: ProductEntry) => (
                        <div key={entry.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                            <span style={{ marginRight: '10px' }}>{entry.name}: {entry.quantity}</span>
                            <span style={{ color: 'gray', fontSize: '0.8em' }}>{entry.description}</span>
                            {isEditMode && (
                                <button onClick={() => handleDelete(entry.id)}
                                        style={{
                                            marginLeft: '10px',
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '4px',
                                            border: 'none',
                                            backgroundColor: 'gray',
                                            color: 'white',
                                            cursor: 'pointer',
                                            fontSize: '16px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                >
                                    &minus;
                                </button>
                            )}
                        </div>
                    ))}
                    {isEditMode && (
                        <div className="form-container" style={{backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px'}}>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <input
                                        type="text"
                                        placeholder="Entry name"
                                        value={entryName}
                                        onChange={e => setEntryName(e.target.value)}
                                        required
                                        style={{ flex: 1, marginRight: '10px', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Quantity"
                                        value={entryQuantity}
                                        onChange={e => setEntryQuantity(e.target.value)}
                                        required
                                        style={{ width: '100px', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Description"
                                    value={entryDescription}
                                    onChange={e => setEntryDescription(e.target.value)}
                                    style={{ marginBottom: '10px', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                                />
                                <button type="submit" style={{ padding: '10px', borderRadius: '4px', border: 'none', backgroundColor: 'green', color: 'white', cursor: 'pointer' }}>Add Entry</button>
                            </form>
                        </div>
                    )}
                    <button onClick={() => setIsEditMode(!isEditMode)} style={{ marginTop: '20px', padding: '10px', borderRadius: '4px', border: 'none', backgroundColor: isEditMode ? 'red' : 'green', color: 'white', cursor: 'pointer' }}>
                        {isEditMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
                    </button>
                </div>
            )}
        </div>
    );
}