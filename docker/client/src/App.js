import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch items on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/items');
      if (!response.ok) throw new Error('Failed to fetch items');
      const data = await response.json();
      setItems(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (e) => {
    e.preventDefault();
    if (!newItem.name.trim()) {
      alert('Please enter an item name');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });
      if (!response.ok) throw new Error('Failed to add item');
      const data = await response.json();
      setItems([...items, data]);
      setNewItem({ name: '', description: '' });
    } catch (err) {
      alert('Error adding item: ' + err.message);
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`http://localhost:8000/api/items/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete item');
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      alert('Error deleting item: ' + err.message);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Items Management</h1>
      </header>

      <main className="container">
        {error && <div className="error">Error: {error}</div>}

        <section className="add-item-section">
          <h2>Add New Item</h2>
          <form onSubmit={addItem}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Item name"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Description"
                value={newItem.description}
                onChange={(e) =>
                  setNewItem({ ...newItem, description: e.target.value })
                }
              />
            </div>
            <button type="submit">Add Item</button>
          </form>
        </section>

        <section className="items-section">
          <h2>Items List</h2>
          {loading ? (
            <p>Loading items...</p>
          ) : items.length === 0 ? (
            <p>No items found</p>
          ) : (
            <ul className="items-list">
              {items.map((item) => (
                <li key={item.id} className="item">
                  <div className="item-content">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                  </div>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
