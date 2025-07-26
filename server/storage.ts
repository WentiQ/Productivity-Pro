import { 
  type User, type InsertUser,
  type Task, type InsertTask,
  type Event, type InsertEvent,
  type PomodoroSession, type InsertPomodoroSession,
  type Note, type InsertNote,
  type WaterIntake, type InsertWaterIntake,
  type Habit, type InsertHabit,
  type HabitEntry, type InsertHabitEntry,
  type DistractionSite, type InsertDistractionSite,
  type UserSettings, type InsertUserSettings
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Task methods
  getTasks(userId: string): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;
  
  // Event methods
  getEvents(userId: string): Promise<Event[]>;
  getEvent(id: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, updates: Partial<Event>): Promise<Event | undefined>;
  deleteEvent(id: string): Promise<boolean>;
  
  // Pomodoro methods
  getPomodoroSessions(userId: string, date?: string): Promise<PomodoroSession[]>;
  createPomodoroSession(session: InsertPomodoroSession): Promise<PomodoroSession>;
  updatePomodoroSession(id: string, updates: Partial<PomodoroSession>): Promise<PomodoroSession | undefined>;
  
  // Notes methods
  getNotes(userId: string): Promise<Note[]>;
  getNote(id: string): Promise<Note | undefined>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: string, updates: Partial<Note>): Promise<Note | undefined>;
  deleteNote(id: string): Promise<boolean>;
  
  // Water intake methods
  getWaterIntake(userId: string, date: string): Promise<WaterIntake[]>;
  addWaterIntake(intake: InsertWaterIntake): Promise<WaterIntake>;
  
  // Habit methods
  getHabits(userId: string): Promise<Habit[]>;
  getHabit(id: string): Promise<Habit | undefined>;
  createHabit(habit: InsertHabit): Promise<Habit>;
  updateHabit(id: string, updates: Partial<Habit>): Promise<Habit | undefined>;
  deleteHabit(id: string): Promise<boolean>;
  
  // Habit entry methods
  getHabitEntries(userId: string, date: string): Promise<HabitEntry[]>;
  getHabitEntry(habitId: string, date: string): Promise<HabitEntry | undefined>;
  createHabitEntry(entry: InsertHabitEntry): Promise<HabitEntry>;
  updateHabitEntry(id: string, updates: Partial<HabitEntry>): Promise<HabitEntry | undefined>;
  
  // Distraction sites methods
  getDistractionSites(userId: string): Promise<DistractionSite[]>;
  createDistractionSite(site: InsertDistractionSite): Promise<DistractionSite>;
  updateDistractionSite(id: string, updates: Partial<DistractionSite>): Promise<DistractionSite | undefined>;
  deleteDistractionSite(id: string): Promise<boolean>;
  
  // User settings methods
  getUserSettings(userId: string): Promise<UserSettings | undefined>;
  createUserSettings(settings: InsertUserSettings): Promise<UserSettings>;
  updateUserSettings(userId: string, updates: Partial<UserSettings>): Promise<UserSettings | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private tasks: Map<string, Task> = new Map();
  private events: Map<string, Event> = new Map();
  private pomodoroSessions: Map<string, PomodoroSession> = new Map();
  private notes: Map<string, Note> = new Map();
  private waterIntake: Map<string, WaterIntake> = new Map();
  private habits: Map<string, Habit> = new Map();
  private habitEntries: Map<string, HabitEntry> = new Map();
  private distractionSites: Map<string, DistractionSite> = new Map();
  private userSettings: Map<string, UserSettings> = new Map();

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    
    // Create default settings for new user
    await this.createUserSettings({ userId: id });
    
    return user;
  }

  // Task methods
  async getTasks(userId: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.userId === userId);
  }

  async getTask(id: string): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = randomUUID();
    const now = new Date();
    const task: Task = { 
      ...insertTask,
      id, 
      createdAt: now,
      completedAt: null,
      category: insertTask.category || null,
      description: insertTask.description || null,
      estimatedTime: insertTask.estimatedTime || null
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updatedTask = { 
      ...task, 
      ...updates,
      completedAt: updates.status === 'completed' ? new Date() : task.completedAt
    };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.tasks.delete(id);
  }

  // Event methods
  async getEvents(userId: string): Promise<Event[]> {
    return Array.from(this.events.values()).filter(event => event.userId === userId);
  }

  async getEvent(id: string): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = randomUUID();
    const now = new Date();
    const event: Event = { 
      ...insertEvent, 
      id, 
      createdAt: now,
      description: insertEvent.description || null,
      location: insertEvent.location || null,
      reminderMinutes: insertEvent.reminderMinutes || null
    };
    this.events.set(id, event);
    return event;
  }

  async updateEvent(id: string, updates: Partial<Event>): Promise<Event | undefined> {
    const event = this.events.get(id);
    if (!event) return undefined;
    
    const updatedEvent = { ...event, ...updates };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteEvent(id: string): Promise<boolean> {
    return this.events.delete(id);
  }

  // Pomodoro methods
  async getPomodoroSessions(userId: string, date?: string): Promise<PomodoroSession[]> {
    const sessions = Array.from(this.pomodoroSessions.values()).filter(session => session.userId === userId);
    if (date) {
      return sessions.filter(session => {
        const sessionDate = session.startTime ? new Date(session.startTime).toISOString().split('T')[0] : '';
        return sessionDate === date;
      });
    }
    return sessions;
  }

  async createPomodoroSession(insertSession: InsertPomodoroSession): Promise<PomodoroSession> {
    const id = randomUUID();
    const now = new Date();
    const session: PomodoroSession = { 
      ...insertSession, 
      id, 
      startTime: now,
      endTime: null,
      completed: insertSession.completed || null
    };
    this.pomodoroSessions.set(id, session);
    return session;
  }

  async updatePomodoroSession(id: string, updates: Partial<PomodoroSession>): Promise<PomodoroSession | undefined> {
    const session = this.pomodoroSessions.get(id);
    if (!session) return undefined;
    
    const updatedSession = { ...session, ...updates };
    this.pomodoroSessions.set(id, updatedSession);
    return updatedSession;
  }

  // Notes methods
  async getNotes(userId: string): Promise<Note[]> {
    return Array.from(this.notes.values()).filter(note => note.userId === userId);
  }

  async getNote(id: string): Promise<Note | undefined> {
    return this.notes.get(id);
  }

  async createNote(insertNote: InsertNote): Promise<Note> {
    const id = randomUUID();
    const now = new Date();
    const note: Note = { 
      ...insertNote, 
      id, 
      createdAt: now, 
      updatedAt: now,
      content: insertNote.content,
      attachments: insertNote.attachments || null,
      tags: insertNote.tags || null
    };
    this.notes.set(id, note);
    return note;
  }

  async updateNote(id: string, updates: Partial<Note>): Promise<Note | undefined> {
    const note = this.notes.get(id);
    if (!note) return undefined;
    
    const updatedNote = { 
      ...note, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.notes.set(id, updatedNote);
    return updatedNote;
  }

  async deleteNote(id: string): Promise<boolean> {
    return this.notes.delete(id);
  }

  // Water intake methods
  async getWaterIntake(userId: string, date: string): Promise<WaterIntake[]> {
    return Array.from(this.waterIntake.values()).filter(
      intake => intake.userId === userId && intake.date === date
    );
  }

  async addWaterIntake(insertIntake: InsertWaterIntake): Promise<WaterIntake> {
    const id = randomUUID();
    const now = new Date();
    const intake: WaterIntake = { 
      ...insertIntake, 
      id, 
      timestamp: now 
    };
    this.waterIntake.set(id, intake);
    return intake;
  }

  // Habit methods
  async getHabits(userId: string): Promise<Habit[]> {
    return Array.from(this.habits.values()).filter(habit => habit.userId === userId);
  }

  async getHabit(id: string): Promise<Habit | undefined> {
    return this.habits.get(id);
  }

  async createHabit(insertHabit: InsertHabit): Promise<Habit> {
    const id = randomUUID();
    const now = new Date();
    const habit: Habit = { 
      ...insertHabit, 
      id, 
      createdAt: now,
      color: insertHabit.color || null,
      isActive: insertHabit.isActive || null,
      description: insertHabit.description || null,
      targetCount: insertHabit.targetCount || null
    };
    this.habits.set(id, habit);
    return habit;
  }

  async updateHabit(id: string, updates: Partial<Habit>): Promise<Habit | undefined> {
    const habit = this.habits.get(id);
    if (!habit) return undefined;
    
    const updatedHabit = { ...habit, ...updates };
    this.habits.set(id, updatedHabit);
    return updatedHabit;
  }

  async deleteHabit(id: string): Promise<boolean> {
    return this.habits.delete(id);
  }

  // Habit entry methods
  async getHabitEntries(userId: string, date: string): Promise<HabitEntry[]> {
    return Array.from(this.habitEntries.values()).filter(
      entry => entry.userId === userId && entry.date === date
    );
  }

  async getHabitEntry(habitId: string, date: string): Promise<HabitEntry | undefined> {
    return Array.from(this.habitEntries.values()).find(
      entry => entry.habitId === habitId && entry.date === date
    );
  }

  async createHabitEntry(insertEntry: InsertHabitEntry): Promise<HabitEntry> {
    const id = randomUUID();
    const now = new Date();
    const entry: HabitEntry = { 
      ...insertEntry, 
      id, 
      timestamp: now,
      completed: insertEntry.completed || null,
      count: insertEntry.count || null
    };
    this.habitEntries.set(id, entry);
    return entry;
  }

  async updateHabitEntry(id: string, updates: Partial<HabitEntry>): Promise<HabitEntry | undefined> {
    const entry = this.habitEntries.get(id);
    if (!entry) return undefined;
    
    const updatedEntry = { ...entry, ...updates };
    this.habitEntries.set(id, updatedEntry);
    return updatedEntry;
  }

  // Distraction sites methods
  async getDistractionSites(userId: string): Promise<DistractionSite[]> {
    return Array.from(this.distractionSites.values()).filter(site => site.userId === userId);
  }

  async createDistractionSite(insertSite: InsertDistractionSite): Promise<DistractionSite> {
    const id = randomUUID();
    const now = new Date();
    const site: DistractionSite = { 
      ...insertSite, 
      id, 
      createdAt: now,
      isBlocked: insertSite.isBlocked || null
    };
    this.distractionSites.set(id, site);
    return site;
  }

  async updateDistractionSite(id: string, updates: Partial<DistractionSite>): Promise<DistractionSite | undefined> {
    const site = this.distractionSites.get(id);
    if (!site) return undefined;
    
    const updatedSite = { ...site, ...updates };
    this.distractionSites.set(id, updatedSite);
    return updatedSite;
  }

  async deleteDistractionSite(id: string): Promise<boolean> {
    return this.distractionSites.delete(id);
  }

  // User settings methods
  async getUserSettings(userId: string): Promise<UserSettings | undefined> {
    return Array.from(this.userSettings.values()).find(settings => settings.userId === userId);
  }

  async createUserSettings(insertSettings: InsertUserSettings): Promise<UserSettings> {
    const id = randomUUID();
    const settings: UserSettings = { 
      ...insertSettings, 
      id,
      pomodoroFocusTime: insertSettings.pomodoroFocusTime || null,
      pomodoroShortBreak: insertSettings.pomodoroShortBreak || null,
      pomodoroLongBreak: insertSettings.pomodoroLongBreak || null,
      waterDailyGoal: insertSettings.waterDailyGoal || null,
      waterReminderInterval: insertSettings.waterReminderInterval || null,
      theme: insertSettings.theme || null,
      notifications: insertSettings.notifications || null
    };
    this.userSettings.set(id, settings);
    return settings;
  }

  async updateUserSettings(userId: string, updates: Partial<UserSettings>): Promise<UserSettings | undefined> {
    const settings = Array.from(this.userSettings.values()).find(s => s.userId === userId);
    if (!settings) return undefined;
    
    const updatedSettings = { ...settings, ...updates };
    this.userSettings.set(settings.id, updatedSettings);
    return updatedSettings;
  }
}

export const storage = new MemStorage();
