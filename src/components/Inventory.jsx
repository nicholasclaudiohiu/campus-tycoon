// src/components/Inventory.jsx
import React, { useState, useRef } from 'react';
import { getItemById } from '../utils/inventoryItems';

export default function Inventory({ inventory = [], onUseItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const gridRef = useRef(null);

  // Pad inventory to always show 10 slots
  const slots = [...inventory];
  while (slots.length < 10) {
    slots.push(null);
  }

  const handleMouseEnter = (item, e) => {
    if (!item) return;
    setHoveredItem(item.id);
    
    // Calculate position relative to grid
    const slot = e.currentTarget;
    const slotRect = slot.getBoundingClientRect();
    const gridRect = gridRef.current.getBoundingClientRect();
    
    const top = slotRect.top - gridRect.top;
    const left = slotRect.left - gridRect.left + slotRect.width + 10; // 10px gap
    
    setTooltipPos({ top, left });
  };

  return (
    <div className="inventory-container">
      <button 
        className="inventory-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Open Inventory"
      >
        📦 Inventory ({inventory.length}/10)
      </button>

      {isOpen && (
        <div className="inventory-modal">
          <div className="inventory-header">
            <h3>Inventory</h3>
            <button 
              className="close-btn"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>
          <div style={{ position: 'relative' }} ref={gridRef}>
            <div className="inventory-grid">
              {slots.map((item, idx) => (
                <div 
                  key={idx} 
                  className="inventory-slot"
                  onClick={() => item && onUseItem && onUseItem(item.id)}
                  onMouseEnter={(e) => handleMouseEnter(item, e)}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{ cursor: item ? 'pointer' : 'default' }}
                  title={item ? `Click to use ${item.name}` : 'Empty slot'}
                >
                  {item ? (
                    <div className="item">
                      <div className="item-icon">{item.icon}</div>
                      <div className="item-name">{item.name}</div>
                      {item.quantity > 1 && (
                        <div className="item-quantity">{item.quantity}</div>
                      )}
                    </div>
                  ) : (
                    <div className="empty-slot">—</div>
                  )}
                </div>
              ))}
            </div>
            
            {hoveredItem && (
              <div className="item-tooltip" style={{ top: `${tooltipPos.top}px`, left: `${tooltipPos.left}px` }}>
                {(() => {
                  const itemData = inventory.find(inv => inv.id === hoveredItem);
                  if (!itemData) return null;
                  const fullItem = itemData.itemData || getItemById(hoveredItem);
                  if (!fullItem) return null;
                  
                  return (
                    <div>
                      <div className="tooltip-title">{itemData.name}</div>
                      <div className="tooltip-effects">
                        {fullItem.effects.hunger !== 0 && <span className="chip">🍔 {fullItem.effects.hunger > 0 ? `+${fullItem.effects.hunger}` : fullItem.effects.hunger}</span>}
                        {fullItem.effects.energy !== 0 && <span className="chip">⚡ {fullItem.effects.energy > 0 ? `+${fullItem.effects.energy}` : fullItem.effects.energy}</span>}
                        {fullItem.effects.hygiene !== 0 && <span className="chip">🧼 {fullItem.effects.hygiene > 0 ? `+${fullItem.effects.hygiene}` : fullItem.effects.hygiene}</span>}
                        {fullItem.effects.happiness !== 0 && <span className="chip">🙂 {fullItem.effects.happiness > 0 ? `+${fullItem.effects.happiness}` : fullItem.effects.happiness}</span>}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
