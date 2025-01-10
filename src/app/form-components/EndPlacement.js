'use client';

import { useState } from 'react';
import './EndPlacement.css';

export default function EndPlacement() {
  // Define all items with their display labels
  const items = [
    { id: 'none', label: 'None' },
    { id: 'park', label: 'Park' },
    { id: 'failpark', label: 'Fail Park' },
    { id: 'shallowcage', label: 'Shallow Cage' },
    { id: 'deepcage', label: 'Deep Cage' },
    { id: 'multi-cage', label: 'Multi-cage climb' } 
  ];

  const [selected, setSelected] = useState('');
  const [multiCageChecked, setMultiCageChecked] = useState(false);

  return (
    <div className="container">
      <h1 className="title">Endgame</h1>
      <div className="box-container">
        {items.map(({ id, label }) => {
          if (id === 'multi-cage' && selected !== 'deepcage') return null;

          const isChecked = id === 'multi-cage' ? multiCageChecked : selected === id;

          return (
            <div
              key={id}
              className={`box ${isChecked ? 'checked' : ''}`}
              onClick={() => {
                if (id !== 'multi-cage') {
                  setSelected(selected === id ? '' : id);
                }
              }}
            >
              <input type="checkbox"
                checked={isChecked}
                onChange={(e) => {
                  if (id === 'multi-cage') {
                    e.stopPropagation();
                    setMultiCageChecked(!multiCageChecked);
                  }
                }}
                onClick={e => id === 'multi-cage' && e.stopPropagation()}
              />
              <label>{label}</label>
            </div>
          );
        })}
      </div>
    </div>
  );
}