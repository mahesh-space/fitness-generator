import React, { useState } from 'react';
import { FaBurn, FaWeight, FaLeaf, FaRegCheckCircle, FaRegClock } from 'react-icons/fa';

const Form = ({ generatePlan }) => {
  const [equipment, setEquipment] = useState(['Bodyweight', 'None']);
  const [goals, setGoals] = useState('Muscle Gain');
  const [days, setDays] = useState(3);
  const [duration, setDuration] = useState(45);

  const handleEquipmentChange = (item) => {
    setEquipment(prev => {
      const newEquipment = prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item];
      return newEquipment.length === 0 ? ['Bodyweight'] : newEquipment;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (equipment.length === 0) return alert('Select at least one equipment');
    generatePlan({ goals, days, duration, equipment });
  };

  return (
    <form className="glass-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="input-label">
          <FaBurn className="input-icon" />
          Fitness Goal
        </label>
        <div className="select-wrapper">
          <select 
            className="glass-select" 
            value={goals} 
            onChange={(e) => setGoals(e.target.value)}
          >
            <option value="Muscle Gain"><FaWeight /> Muscle Gain</option>
            <option value="Weight Loss"><FaBurn /> Weight Loss</option>
            <option value="Flexibility"><FaLeaf /> Flexibility</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="input-label">
            <FaRegClock className="input-icon" />
            Days/Week
          </label>
          <input
            type="number"
            min="1"
            max="7"
            value={days}
            onChange={(e) => setDays(Math.max(1, Math.min(7, e.target.value)))}
            className="glass-input"
          />
        </div>

        <div className="form-group">
          <label className="input-label">
            <FaRegClock className="input-icon" />
            Minutes/Session
          </label>
          <input
            type="number"
            min="20"
            max="120"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="glass-input"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="input-label">Equipment Available</label>
        <div className="equipment-grid">
          {['Bodyweight', 'Dumbbells', 'Resistance Bands', 'Pull-Up Bar', 'None'].map((item) => (
            <label 
              className={`equipment-card ${equipment.includes(item) ? 'selected' : ''}`} 
              key={item}
            >
              <input
                type="checkbox"
                checked={equipment.includes(item)}
                onChange={() => handleEquipmentChange(item)}
                className="hidden-checkbox"
              />
              <div className="equipment-content">
                <div className="check-icon">
                  <FaRegCheckCircle />
                </div>
                {item}
              </div>
            </label>
          ))}
        </div>
      </div>

      <button type="submit" className="generate-button">
        Generate My Plan <FaRegCheckCircle />
      </button>
    </form>
  );
};

export default Form;