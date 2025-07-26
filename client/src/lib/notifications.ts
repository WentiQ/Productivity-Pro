export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  requireInteraction?: boolean;
}

class NotificationService {
  private permission: NotificationPermission = 'default';

  constructor() {
    this.checkPermission();
  }

  private checkPermission() {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    if (this.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission === 'granted';
    }

    return false;
  }

  async show(options: NotificationOptions): Promise<boolean> {
    const hasPermission = await this.requestPermission();
    
    if (!hasPermission) {
      console.warn('Notification permission denied');
      return false;
    }

    try {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/favicon.ico',
        tag: options.tag,
        requireInteraction: options.requireInteraction || false,
      });

      // Auto close after 5 seconds if not requiring interaction
      if (!options.requireInteraction) {
        setTimeout(() => {
          notification.close();
        }, 5000);
      }

      return true;
    } catch (error) {
      console.error('Failed to show notification:', error);
      return false;
    }
  }

  // Predefined notification types
  async showPomodoroComplete(sessionType: string): Promise<boolean> {
    return this.show({
      title: 'Pomodoro Complete! 🍅',
      body: `Your ${sessionType.replace('_', ' ')} session is finished. Time for a break!`,
      tag: 'pomodoro-complete',
      requireInteraction: true,
    });
  }

  async showWaterReminder(): Promise<boolean> {
    return this.show({
      title: 'Hydration Reminder 💧',
      body: 'Time to drink some water! Stay hydrated for better focus.',
      tag: 'water-reminder',
    });
  }

  async showHabitReminder(habitName: string): Promise<boolean> {
    return this.show({
      title: 'Habit Reminder 🎯',
      body: `Don't forget about your "${habitName}" habit today!`,
      tag: 'habit-reminder',
    });
  }

  async showTaskDue(taskTitle: string): Promise<boolean> {
    return this.show({
      title: 'Task Due Soon! ⏰',
      body: `"${taskTitle}" is due soon. Time to wrap it up!`,
      tag: 'task-due',
      requireInteraction: true,
    });
  }

  async showBreakReminder(): Promise<boolean> {
    return this.show({
      title: 'Break Time! 🧘',
      body: 'You\'ve been working hard. Take a short break to recharge.',
      tag: 'break-reminder',
    });
  }

  async showDailyGoalAchieved(): Promise<boolean> {
    return this.show({
      title: 'Daily Goal Achieved! 🎉',
      body: 'Congratulations! You\'ve reached your daily productivity goal!',
      tag: 'daily-goal',
      requireInteraction: true,
    });
  }

  async scheduleReminder(delay: number, options: NotificationOptions): Promise<void> {
    setTimeout(() => {
      this.show(options);
    }, delay);
  }
}

export const notificationService = new NotificationService();

// Utility functions for common reminder patterns
export function scheduleWaterReminders(intervalMinutes: number = 60): void {
  const scheduleNext = () => {
    setTimeout(() => {
      notificationService.showWaterReminder();
      scheduleNext(); // Schedule the next reminder
    }, intervalMinutes * 60 * 1000);
  };
  
  scheduleNext();
}

export function scheduleBreakReminder(workMinutes: number = 60): void {
  setTimeout(() => {
    notificationService.showBreakReminder();
  }, workMinutes * 60 * 1000);
}

export function checkTaskDeadlines(tasks: Array<{ title: string; dueDate: Date | null }>): void {
  const now = new Date();
  const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

  tasks.forEach(task => {
    if (task.dueDate && task.dueDate <= oneHourFromNow && task.dueDate > now) {
      notificationService.showTaskDue(task.title);
    }
  });
}
