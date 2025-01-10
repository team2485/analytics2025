'use client';
import { useState } from 'react';
import './EndPlacement.css';

function EndPlacement() {
  const items = [
    { id: 'none', label: 'None' },
    { id: 'park', label: 'Park' },
    { id: 'failpark', label: 'Fail Park' },
    { id: 'shallowcage', label: 'Shallow Cage' },
    { id: 'deepcage', label: 'Deep Cage' },
    { id: 'multi-cage', label: 'Multi-cage climb' }
  ];

  const [selected, setSelected] = useState('');

  const handleChange = (id) => {
    setSelected(id);
  };

  return (
    <div className="container">
      <h1 className="title">Endgame</h1>
      <div className="box-container">
        {items.map((item) => {
          if (item.id === 'multi-cage' && selected !== 'deepcage') {
            return null;
          }
          
          return (
            <div
              key={item.id}
              className={`box ${selected === item.id ? 'checked' : ''}`}
              onClick={() => handleChange(item.id)}
            >
              <input
                type="radio"
                name="endgame"
                value={item.id}
                checked={selected === item.id}
                onChange={() => handleChange(item.id)}
              />
              <label>{item.label}</label>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default EndPlacement;