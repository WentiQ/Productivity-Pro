import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertTaskSchema, insertEventSchema, insertPomodoroSessionSchema,
  insertNoteSchema, insertWaterIntakeSchema, insertHabitSchema,
  insertHabitEntrySchema, insertDistractionSiteSchema, insertUserSettingsSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Mock user for demonstration (in real app, this would come from auth)
  const MOCK_USER_ID = "mock-user-123";

  // Tasks routes
  app.get("/api/tasks", async (req, res) => {
    try {
      const tasks = await storage.getTasks(MOCK_USER_ID);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse({ ...req.body, userId: MOCK_USER_ID });
      const task = await storage.createTask(taskData);
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: "Invalid task data" });
    }
  });

  app.put("/api/tasks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const task = await storage.updateTask(id, req.body);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteTask(id);
      if (!deleted) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json({ message: "Task deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // Events routes  
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getEvents(MOCK_USER_ID);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      const eventData = insertEventSchema.parse({ ...req.body, userId: MOCK_USER_ID });
      const event = await storage.createEvent(eventData);
      res.json(event);
    } catch (error) {
      res.status(400).json({ message: "Invalid event data" });
    }
  });

  app.put("/api/events/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const event = await storage.updateEvent(id, req.body);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(400).json({ message: "Failed to update event" });
    }
  });

  app.delete("/api/events/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteEvent(id);
      if (!deleted) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json({ message: "Event deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete event" });
    }
  });

  // Pomodoro sessions routes
  app.get("/api/pomodoro/sessions", async (req, res) => {
    try {
      const { date } = req.query;
      const sessions = await storage.getPomodoroSessions(MOCK_USER_ID, date as string);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pomodoro sessions" });
    }
  });

  app.post("/api/pomodoro/sessions", async (req, res) => {
    try {
      const sessionData = insertPomodoroSessionSchema.parse({ ...req.body, userId: MOCK_USER_ID });
      const session = await storage.createPomodoroSession(sessionData);
      res.json(session);
    } catch (error) {
      res.status(400).json({ message: "Invalid session data" });
    }
  });

  app.put("/api/pomodoro/sessions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const session = await storage.updatePomodoroSession(id, req.body);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(400).json({ message: "Failed to update session" });
    }
  });

  // Notes routes
  app.get("/api/notes", async (req, res) => {
    try {
      const notes = await storage.getNotes(MOCK_USER_ID);
      res.json(notes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notes" });
    }
  });

  app.post("/api/notes", async (req, res) => {
    try {
      const noteData = insertNoteSchema.parse({ ...req.body, userId: MOCK_USER_ID });
      const note = await storage.createNote(noteData);
      res.json(note);
    } catch (error) {
      res.status(400).json({ message: "Invalid note data" });
    }
  });

  app.put("/api/notes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const note = await storage.updateNote(id, req.body);
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.json(note);
    } catch (error) {
      res.status(400).json({ message: "Failed to update note" });
    }
  });

  app.delete("/api/notes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteNote(id);
      if (!deleted) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.json({ message: "Note deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete note" });
    }
  });

  // Water intake routes
  app.get("/api/water", async (req, res) => {
    try {
      const { date } = req.query;
      const today = date as string || new Date().toISOString().split('T')[0];
      const intake = await storage.getWaterIntake(MOCK_USER_ID, today);
      res.json(intake);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch water intake" });
    }
  });

  app.post("/api/water", async (req, res) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const intakeData = insertWaterIntakeSchema.parse({ 
        ...req.body, 
        userId: MOCK_USER_ID,
        date: today
      });
      const intake = await storage.addWaterIntake(intakeData);
      res.json(intake);
    } catch (error) {
      res.status(400).json({ message: "Invalid water intake data" });
    }
  });

  // Habits routes
  app.get("/api/habits", async (req, res) => {
    try {
      const habits = await storage.getHabits(MOCK_USER_ID);
      res.json(habits);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch habits" });
    }
  });

  app.post("/api/habits", async (req, res) => {
    try {
      const habitData = insertHabitSchema.parse({ ...req.body, userId: MOCK_USER_ID });
      const habit = await storage.createHabit(habitData);
      res.json(habit);
    } catch (error) {
      res.status(400).json({ message: "Invalid habit data" });
    }
  });

  app.put("/api/habits/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const habit = await storage.updateHabit(id, req.body);
      if (!habit) {
        return res.status(404).json({ message: "Habit not found" });
      }
      res.json(habit);
    } catch (error) {
      res.status(400).json({ message: "Failed to update habit" });
    }
  });

  app.delete("/api/habits/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteHabit(id);
      if (!deleted) {
        return res.status(404).json({ message: "Habit not found" });
      }
      res.json({ message: "Habit deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete habit" });
    }
  });

  // Habit entries routes
  app.get("/api/habits/entries", async (req, res) => {
    try {
      const { date } = req.query;
      const today = date as string || new Date().toISOString().split('T')[0];
      const entries = await storage.getHabitEntries(MOCK_USER_ID, today);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch habit entries" });
    }
  });

  app.post("/api/habits/entries", async (req, res) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const entryData = insertHabitEntrySchema.parse({ 
        ...req.body, 
        userId: MOCK_USER_ID,
        date: today
      });
      const entry = await storage.createHabitEntry(entryData);
      res.json(entry);
    } catch (error) {
      res.status(400).json({ message: "Invalid habit entry data" });
    }
  });

  app.put("/api/habits/entries/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const entry = await storage.updateHabitEntry(id, req.body);
      if (!entry) {
        return res.status(404).json({ message: "Habit entry not found" });
      }
      res.json(entry);
    } catch (error) {
      res.status(400).json({ message: "Failed to update habit entry" });
    }
  });

  // Distraction sites routes
  app.get("/api/distraction-sites", async (req, res) => {
    try {
      const sites = await storage.getDistractionSites(MOCK_USER_ID);
      res.json(sites);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch distraction sites" });
    }
  });

  app.post("/api/distraction-sites", async (req, res) => {
    try {
      const siteData = insertDistractionSiteSchema.parse({ ...req.body, userId: MOCK_USER_ID });
      const site = await storage.createDistractionSite(siteData);
      res.json(site);
    } catch (error) {
      res.status(400).json({ message: "Invalid site data" });
    }
  });

  app.put("/api/distraction-sites/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const site = await storage.updateDistractionSite(id, req.body);
      if (!site) {
        return res.status(404).json({ message: "Site not found" });
      }
      res.json(site);
    } catch (error) {
      res.status(400).json({ message: "Failed to update site" });
    }
  });

  app.delete("/api/distraction-sites/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteDistractionSite(id);
      if (!deleted) {
        return res.status(404).json({ message: "Site not found" });
      }
      res.json({ message: "Site deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete site" });
    }
  });

  // User settings routes
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getUserSettings(MOCK_USER_ID);
      if (!settings) {
        // Create default settings if none exist
        const newSettings = await storage.createUserSettings({ userId: MOCK_USER_ID });
        return res.json(newSettings);
      }
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.put("/api/settings", async (req, res) => {
    try {
      const settings = await storage.updateUserSettings(MOCK_USER_ID, req.body);
      if (!settings) {
        return res.status(404).json({ message: "Settings not found" });
      }
      res.json(settings);
    } catch (error) {
      res.status(400).json({ message: "Failed to update settings" });
    }
  });

  // Analytics routes
  app.get("/api/analytics/dashboard", async (req, res) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Get today's data
      const tasks = await storage.getTasks(MOCK_USER_ID);
      const todayTasks = tasks.filter(task => {
        const taskDate = task.createdAt ? new Date(task.createdAt).toISOString().split('T')[0] : '';
        return taskDate === today;
      });
      
      const pomodoroSessions = await storage.getPomodoroSessions(MOCK_USER_ID, today);
      const waterIntake = await storage.getWaterIntake(MOCK_USER_ID, today);
      const habitEntries = await storage.getHabitEntries(MOCK_USER_ID, today);
      
      // Calculate stats
      const completedTasks = tasks.filter(task => task.status === 'completed').length;
      const totalTasks = tasks.length;
      const completedPomodoros = pomodoroSessions.filter(s => s.completed).length;
      const totalWater = waterIntake.reduce((sum, intake) => sum + intake.amount, 0);
      const completedHabits = habitEntries.filter(entry => entry.completed).length;
      
      // Calculate scores (simplified scoring algorithm)
      const taskScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      const pomodoroScore = Math.min(completedPomodoros * 12, 100); // 12 points per pomodoro, max 100
      const waterScore = Math.min(Math.round((totalWater / 2500) * 100), 100); // Goal: 2500ml
      const habitScore = habitEntries.length > 0 ? Math.round((completedHabits / habitEntries.length) * 100) : 0;
      const overallScore = Math.round((taskScore + pomodoroScore + waterScore + habitScore) / 4);
      
      res.json({
        tasksCompleted: `${completedTasks}/${totalTasks}`,
        pomodorosToday: completedPomodoros,
        waterIntake: `${(totalWater / 1000).toFixed(1)}L / 2.5L`,
        dailyScore: `${overallScore}/100`,
        scores: {
          tasks: taskScore,
          pomodoro: pomodoroScore,
          water: waterScore,
          habits: habitScore,
          blocker: 95, // Mock score for distraction blocking
          overall: overallScore
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Get weekly productivity data for charts
  app.get("/api/analytics/weekly", async (req, res) => {
    try {
      // Mock weekly data - in real app, this would aggregate historical data
      const weeklyData = {
        productivity: [75, 82, 78, 85, 90, 88, 87],
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      };
      res.json(weeklyData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch weekly analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
