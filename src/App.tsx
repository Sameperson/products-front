import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ProductListView } from './ProductListView';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/product-lists/:id" element={<ProductListView />} />
            </Routes>
        </Router>
    );
}

export default App;
