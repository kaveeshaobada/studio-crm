import React from 'react';
import { ShoppingBag } from 'lucide-react';

export default function GalleryStoreTab({ selectedGallery }) {
    if (!selectedGallery) return null;

    const storeProducts = [
        { title: 'Fine Art Prints', price: '$25.00+', markup: '300% markup' },
        { title: 'Linen Album (10x10)', price: '$350.00', markup: '$180 profit' },
        { title: 'Canvas Gallery Wrap', price: '$120.00+', markup: '250% markup' },
        { title: 'Digital Download Bundle', price: '$95.00', markup: '100% profit' },
    ];

    return (
        <div style={{ flex: 1, padding: '2rem 3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827', margin: 0 }}>
                        Client Print Store
                    </h2>
                    <p style={{ fontSize: '0.82rem', color: '#6b7280', margin: '4px 0 0 0' }}>
                        Sell high-quality prints, fine art frames, and linen albums fulfilled automatically by professional labs.
                    </p>
                </div>
                <span style={{ background: '#ecfdf5', color: '#059669', padding: '4px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: '600' }}>
                    Store Active
                </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                {storeProducts.map((item, idx) => (
                    <div
                        key={idx}
                        style={{
                            background: '#ffffff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            padding: '1.25rem',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        }}
                    >
                        <ShoppingBag size={20} color="#2563eb" />
                        <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#111827', margin: '8px 0 4px 0' }}>
                            {item.title}
                        </h3>
                        <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#111827' }}>
                            {item.price}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#059669', fontWeight: '600', marginTop: '2px' }}>
                            {item.markup}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
