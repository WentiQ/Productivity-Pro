export interface ScoreMetrics {
  tasks: number;
  pomodoro: number;
  water: number;
  habits: number;
  focus: number;
  overall: number;
}

export interface ActivityData {
  completedTasks: number;
  totalTasks: number;
  completedPomodoros: number;
  waterIntake: number; // in ml
  waterGoal: number; // in ml
  completedHabits: number;
  totalHabits: number;
  distractionBlockingMinutes: number;
}

export function calculateScores(data: ActivityData): ScoreMetrics {
  // Task completion score (0-100)
  const taskScore = data.totalTasks > 0 
    ? Math.round((data.completedTasks / data.totalTasks) * 100)
    : 0;

  // Pomodoro score (12 points per pomodoro, max 100)
  const pomodoroScore = Math.min(data.completedPomodoros * 12, 100);

  // Water intake score (based on daily goal)
  const waterScore = data.waterGoal > 0 
    ? Math.min(Math.round((data.waterIntake / data.waterGoal) * 100), 100)
    : 0;

  // Habits score (0-100)
  const habitScore = data.totalHabits > 0 
    ? Math.round((data.completedHabits / data.totalHabits) * 100)
    : 0;

  // Focus score (based on distraction blocking)
  const focusScore = Math.min(Math.round(data.distractionBlockingMinutes / 10), 100);

  // Overall score (weighted average)
  const overallScore = Math.round(
    (taskScore * 0.3 + pomodoroScore * 0.25 + waterScore * 0.15 + habitScore * 0.2 + focusScore * 0.1)
  );

  return {
    tasks: taskScore,
    pomodoro: pomodoroScore,
    water: waterScore,
    habits: habitScore,
    focus: focusScore,
    overall: overallScore,
  };
}

export function getScoreColor(score: number): string {
  if (score >= 90) return 'text-green-600 dark:text-green-400';
  if (score >= 75) return 'text-blue-600 dark:text-blue-400';
  if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
  if (score >= 40) return 'text-orange-600 dark:text-orange-400';
  return 'text-red-600 dark:text-red-400';
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 60) return 'Average';
  if (score >= 40) return 'Below Average';
  return 'Needs Improvement';
}

export function getMotivationalMessage(score: number): string {
  if (score >= 90) return 'Outstanding work! You\'re crushing your productivity goals! 🚀';
  if (score >= 75) return 'Great job! You\'re making excellent progress! 💪';
  if (score >= 60) return 'Good effort! Keep pushing to reach your potential! 📈';
  if (score >= 40) return 'You\'re on the right track, let\'s boost that productivity! 💡';
  return 'Every small step counts. Let\'s build momentum together! 🌱';
}

export function generateProductivityInsights(data: ActivityData): string[] {
  const insights: string[] = [];
  
  if (data.completedTasks / data.totalTasks > 0.8) {
    insights.push('You have excellent task completion rates! 🎯');
  } else if (data.completedTasks / data.totalTasks < 0.5) {
    insights.push('Consider breaking down larger tasks into smaller, manageable chunks.');
  }

  if (data.completedPomodoros >= 6) {
    insights.push('Your focus sessions are on point! Great time management! ⏰');
  } else if (data.completedPomodoros < 3) {
    insights.push('Try incorporating more focused work sessions with the Pomodoro technique.');
  }

  if (data.waterIntake >= data.waterGoal * 0.9) {
    insights.push('Excellent hydration! Your body and mind thank you! 💧');
  } else if (data.waterIntake < data.waterGoal * 0.6) {
    insights.push('Remember to stay hydrated for optimal cognitive performance.');
  }

  if (data.completedHabits / data.totalHabits > 0.8) {
    insights.push('Your habit consistency is impressive! Building strong routines! 🔄');
  }

  return insights;
}
