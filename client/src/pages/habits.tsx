import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertHabitSchema, type Habit, type HabitEntry } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, CheckCircle, Circle, TrendingUp, Target, Flame, Edit, Trash2 } from "lucide-react";
import { z } from "zod";
import { cn } from "@/lib/utils";

const habitFormSchema = insertHabitSchema;
type HabitFormData = z.infer<typeof habitFormSchema>;

export default function Habits() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const { toast } = useToast();
  const today = new Date().toISOString().split('T')[0];

  const { data: habits = [], isLoading } = useQuery<Habit[]>({
    queryKey: ['/api/habits'],
  });

  const { data: todayEntries = [] } = useQuery<HabitEntry[]>({
    queryKey: ['/api/habits/entries'],
    queryParams: { date: today },
  });

  const createHabitMutation = useMutation({
    mutationFn: async (data: HabitFormData) => {
      const response = await apiRequest('POST', '/api/habits', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/habits'] });
      setDialogOpen(false);
      toast({
        title: "Success",
        description: "Habit created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create habit",
        variant: "destructive",
      });
    },
  });

  const updateHabitMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Habit> }) => {
      const response = await apiRequest('PUT', `/api/habits/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/habits'] });
      setDialogOpen(false);
      toast({
        title: "Success",
        description: "Habit updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update habit",
        variant: "destructive",
      });
    },
  });

  const deleteHabitMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('DELETE', `/api/habits/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/habits'] });
      toast({
        title: "Success",
        description: "Habit deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete habit",
        variant: "destructive",
      });
    },
  });

  const toggleHabitMutation = useMutation({
    mutationFn: async ({ habitId, completed }: { habitId: string; completed: boolean }) => {
      const existingEntry = todayEntries.find(entry => entry.habitId === habitId);
      
      if (existingEntry) {
        // Update existing entry
        const response = await apiRequest('PUT', `/api/habits/entries/${existingEntry.id}`, {
          completed,
          count: completed ? 1 : 0
        });
        return response.json();
      } else {
        // Create new entry
        const response = await apiRequest('POST', '/api/habits/entries', {
          habitId,
          completed,
          count: completed ? 1 : 0
        });
        return response.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/habits/entries'] });
      toast({
        title: "Updated",
        description: "Habit progress updated",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update habit",
        variant: "destructive",
      });
    },
  });

  const form = useForm<HabitFormData>({
    resolver: zodResolver(habitFormSchema),
    defaultValues: {
      name: "",
      description: "",
      frequency: "daily",
      targetCount: 1,
      color: "#4CAF50",
      isActive: true,
    },
  });

  const onSubmit = (data: HabitFormData) => {
    if (editingHabit) {
      updateHabitMutation.mutate({ id: editingHabit.id, data });
    } else {
      createHabitMutation.mutate(data);
    }
  };

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    form.reset({
      name: habit.name,
      description: habit.description || "",
      frequency: habit.frequency,
      targetCount: habit.targetCount || 1,
      color: habit.color || "#4CAF50",
      isActive: habit.isActive,
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this habit?")) {
      deleteHabitMutation.mutate(id);
    }
  };

  const getHabitStatus = (habitId: string) => {
    const entry = todayEntries.find(entry => entry.habitId === habitId);
    return entry?.completed || false;
  };

  const getHabitStreak = (habitId: string) => {
    // In a real app, you'd calculate this from historical data
    // For now, return a mock value
    return Math.floor(Math.random() * 20) + 1;
  };

  const generateCalendarDays = () => {
    const days = [];
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 6); // Start 6 days ago

    for (let i = 0; i < 7; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return days;
  };

  const calendarDays = generateCalendarDays();
  const activeHabits = habits.filter(habit => habit.isActive);
  const completedToday = todayEntries.filter(entry => entry.completed).length;
  const completionRate = activeHabits.length > 0 ? (completedToday / activeHabits.length) * 100 : 0;

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Habit Tracker</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Build and maintain positive habits</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setEditingHabit(null);
              form.reset();
            }
          }}>
            <DialogTrigger asChild>
              <Button className="flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Add Habit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingHabit ? 'Edit Habit' : 'Create New Habit'}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Habit Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Morning Exercise" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Brief description of the habit" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="frequency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Frequency</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="targetCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Count</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="1" 
                              {...field} 
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 1)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <FormControl>
                          <Input type="color" {...field} value={field.value || "#3B82F6"} className="h-10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createHabitMutation.isPending || updateHabitMutation.isPending}>
                      {editingHabit ? 'Update' : 'Create'} Habit
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Progress</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {completedToday}/{activeHabits.length}
                  </p>
                </div>
                <Target className="w-8 h-8 text-blue-500" />
              </div>
              <Progress value={completionRate} className="mt-3" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Longest Streak</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.max(...habits.map(h => getHabitStreak(h.id)), 0)} days
                  </p>
                </div>
                <Flame className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Habits</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {activeHabits.length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Habit Calendar View */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Weekly View
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading habits...</div>
            ) : activeHabits.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No active habits. Create your first habit to get started!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left p-2 font-medium text-gray-700 dark:text-gray-300">Habit</th>
                      {calendarDays.map((day, index) => (
                        <th key={index} className="text-center p-2 font-medium text-gray-700 dark:text-gray-300 min-w-[40px]">
                          <div className="text-xs">
                            {day.toLocaleDateString('en-US', { weekday: 'short' })}
                          </div>
                          <div className="text-xs text-gray-500">
                            {day.getDate()}
                          </div>
                        </th>
                      ))}
                      <th className="text-center p-2 font-medium text-gray-700 dark:text-gray-300">Streak</th>
                      <th className="text-center p-2 font-medium text-gray-700 dark:text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeHabits.map((habit) => {
                      const isCompletedToday = getHabitStatus(habit.id);
                      const streak = getHabitStreak(habit.id);
                      
                      return (
                        <tr key={habit.id} className="border-t border-gray-200 dark:border-gray-700">
                          <td className="p-2">
                            <div className="flex items-center space-x-3">
                              <div 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: habit.color || "#3B82F6" }}
                              />
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {habit.name}
                                </div>
                                {habit.description && (
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {habit.description}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          {calendarDays.map((day, dayIndex) => {
                            const isToday = day.toDateString() === new Date().toDateString();
                            const dayCompleted = isToday ? isCompletedToday : Math.random() > 0.3; // Mock data for past days
                            
                            return (
                              <td key={dayIndex} className="p-2 text-center">
                                <button
                                  className={cn(
                                    "w-6 h-6 rounded-full border-2 transition-colors",
                                    dayCompleted
                                      ? `bg-[${habit.color}] border-[${habit.color}]`
                                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400",
                                    isToday && "ring-2 ring-blue-500 ring-offset-1"
                                  )}
                                  onClick={() => isToday && toggleHabitMutation.mutate({
                                    habitId: habit.id,
                                    completed: !isCompletedToday
                                  })}
                                  disabled={!isToday || toggleHabitMutation.isPending}
                                >
                                  {dayCompleted && (
                                    <CheckCircle className="w-4 h-4 text-white mx-auto" />
                                  )}
                                </button>
                              </td>
                            );
                          })}
                          <td className="p-2 text-center">
                            <Badge variant="secondary" className="flex items-center justify-center space-x-1">
                              <Flame className="w-3 h-3" />
                              <span>{streak}</span>
                            </Badge>
                          </td>
                          <td className="p-2 text-center">
                            <div className="flex items-center justify-center space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(habit)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(habit.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
