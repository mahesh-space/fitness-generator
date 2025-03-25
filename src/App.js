import { useState } from 'react';
import Form from './Form';
import { exercises } from './exerciseData';
import { FaDumbbell, FaRunning, FaCalendarAlt, FaRegClock } from 'react-icons/fa';
import './App.css';

const generateWorkoutPlan = (userInput) => {
  // Calculate available time per day (minus 10 mins for warmup/cooldown)
  const totalAvailableTime = userInput.duration - 10;
  const minutesPerDay = Math.max(15, totalAvailableTime / userInput.days);

  // Filter available exercises
  const availableExercises = exercises.filter(exercise => 
    exercise.equipment.some(eq => userInput.equipment.includes(eq)) &&
    exercise.goals.includes(userInput.goals)
  );

  // Create workout split
  const split = [];
  for (let day = 0; day < userInput.days; day++) {
    let timeUsed = 0;
    const dayExercises = [];
    
    // Calculate time per exercise based on session duration
    const baseTimePerExercise = Math.min(
      20, // Max time per exercise
      Math.max(
        5, // Min time per exercise
        minutesPerDay / 3 // Scales with session duration
      )
    );

    // Add exercises until time is filled
    const shuffledExercises = [...availableExercises].sort(() => 0.5 - Math.random());
    for (const ex of shuffledExercises) {
      const exerciseTime = ex.type === 'Cardio' 
  ? Math.min(20, minutesPerDay - timeUsed)
  : Math.min(baseTimePerExercise, minutesPerDay - timeUsed);

      if (timeUsed + exerciseTime <= minutesPerDay) {
        dayExercises.push({
          ...ex,
          duration: exerciseTime,
          sets: ex.type === 'Cardio' ? 1 : Math.max(1, Math.floor(exerciseTime/5))
        });
        timeUsed += exerciseTime;
      }

      // Ensure minimum 2 exercises per day
      if (dayExercises.length >= 2 && timeUsed >= minutesPerDay * 0.7) break;
    }

    split.push({
      type: getDayType(day, userInput.days),
      exercises: dayExercises,
      totalTime: timeUsed + 10 // Add warmup time
    });
  }

  return split;
};

// Helper function to determine day type
const getDayType = (dayIndex, totalDays) => {
  if (totalDays <= 2) return 'Full Body';
  const types = ['Push', 'Pull', 'Legs', 'Upper', 'Lower', 'Cardio'];
  return types[dayIndex % types.length];
};



function App() {
  const [plan, setPlan] = useState(null);

  const generatePlan = (userInput) => {
    try {
      if (userInput.days < 1 || userInput.days > 7) throw new Error('Select 1-7 days');
      if (userInput.duration < 20) throw new Error('Minimum 20 minutes per session');
      
      const finalPlan = generateWorkoutPlan(userInput);
      if (finalPlan.some(day => day.exercises.length === 0)) {
        throw new Error('Could not create full plan - try more time/days');
      }
      setPlan(finalPlan);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="App">
      <div className="glass-container">
        <h1 className="app-title">
          <FaDumbbell className="title-icon" /> Fitness Generator
        </h1>
        
        <Form generatePlan={generatePlan} />
        
        {plan && (
          <div className="plan-container">
            <div className="plan-header">
              <FaCalendarAlt className="header-icon" />
              <h2>Your Custom Workout Plan</h2>
            </div>
            
            {plan.map((dayPlan, index) => (
              <div className="day-card" key={index}>
                <div className="day-header">
                  <span className="day-number">Day {index + 1}</span>
                  <span className="day-focus">{dayPlan.type}</span>
                  <span className="day-time">
                    <FaRegClock /> {dayPlan.totalTime} mins
                  </span>
                </div>
                
                {dayPlan.exercises.map((ex, i) => (
                  <div className="exercise-item" key={i}>
                    <FaRunning className="exercise-icon" />
                    <div className="exercise-details">
                      <h3>{ex.name}</h3>
                      <p>
                        {ex.sets} {ex.type === 'Cardio' ? 'min' : 'sets'} × {' '}
                        {ex.type === 'Cardio' ? 'AMRAP' : ex.baseReps + ' reps'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;