import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import TimerDisplay from "@/components/pomodoro/timer-display";
import { useTimer } from "@/hooks/use-timer";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, Square, Settings, TrendingUp } from "lucide-react";
import type { UserSettings, PomodoroSession } from "@shared/schema";

export default function Pomodoro() {
  const { toast } = useToast();
  const [autoStart, setAutoStart] = useState(false);

  const { data: settings } = useQuery<UserSettings>({
    queryKey: ['/api/settings'],
  });

  const { data: todaySessions = [] } = useQuery<PomodoroSession[]>({
    queryKey: ['/api/pomodoro/sessions'],
    queryParams: { date: new Date().toISOString().split('T')[0] },
  });

  const createSessionMutation = useMutation({
    mutationFn: async (sessionData: { type: string; duration: number }) => {
      const response = await apiRequest('POST', '/api/pomodoro/sessions', sessionData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pomodoro/sessions'] });
    },
  });

  const updateSessionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PomodoroSession> }) => {
      const response = await apiRequest('PUT', `/api/pomodoro/sessions/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pomodoro/sessions'] });
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (settingsData: Partial<UserSettings>) => {
      const response = await apiRequest('PUT', '/api/settings', settingsData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      toast({
        title: "Settings Updated",
        description: "Pomodoro settings have been saved",
      });
    },
  });

  const defaultSettings = {
    pomodoroFocusTime: 25,
    pomodoroShortBreak: 5,
    pomodoroLongBreak: 15,
  };

  const currentSettings = settings || defaultSettings;
  const [sessionType, setSessionType] = useState<'focus' | 'short_break' | 'long_break'>('focus');
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const getDurationForType = (type: string) => {
    switch (type) {
      case 'focus': return currentSettings.pomodoroFocusTime || 25;
      case 'short_break': return currentSettings.pomodoroShortBreak || 5;
      case 'long_break': return currentSettings.pomodoroLongBreak || 15;
      default: return 25;
    }
  };

  const { 
    timeRemaining, 
    isRunning, 
    start, 
    pause, 
    reset 
  } = useTimer({
    initialTime: getDurationForType(sessionType) * 60,
    onComplete: async () => {
      // Mark session as completed
      if (currentSessionId) {
        await updateSessionMutation.mutateAsync({
          id: currentSessionId,
          data: { completed: true, endTime: new Date() }
        });
      }

      toast({
        title: "Session Complete!",
        description: `${sessionType.replace('_', ' ')} session finished. Take a break!`,
      });

      // Auto-start next session if enabled
      if (autoStart) {
        handleNextSession();
      }
    },
  });

  const handleStart = async () => {
    if (!isRunning && !currentSessionId) {
      // Create new session
      const session = await createSessionMutation.mutateAsync({
        type: sessionType,
        duration: getDurationForType(sessionType)
      });
      setCurrentSessionId(session.id);
    }
    start();
  };

  const handlePause = () => {
    pause();
  };

  const handleReset = async () => {
    reset();
    if (currentSessionId) {
      // Update session as incomplete
      await updateSessionMutation.mutateAsync({
        id: currentSessionId,
        data: { completed: false, endTime: new Date() }
      });
      setCurrentSessionId(null);
    }
  };

  const handleNextSession = () => {
    const completedFocusSessions = todaySessions.filter(s => s.type === 'focus' && s.completed).length;
    
    if (sessionType === 'focus') {
      // After focus, determine break type
      const nextBreakType = (completedFocusSessions + 1) % 4 === 0 ? 'long_break' : 'short_break';
      setSessionType(nextBreakType);
    } else {
      // After break, back to focus
      setSessionType('focus');
    }
    
    setCurrentSessionId(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseLabel = () => {
    switch (sessionType) {
      case 'focus': return 'Focus Time';
      case 'short_break': return 'Short Break';
      case 'long_break': return 'Long Break';
      default: return 'Focus Time';
    }
  };

  // Calculate today's stats
  const completedSessions = todaySessions.filter(s => s.completed).length;
  const focusTime = todaySessions
    .filter(s => s.type === 'focus' && s.completed)
    .reduce((total, session) => total + session.duration, 0);
  const breakTime = todaySessions
    .filter(s => s.type !== 'focus' && s.completed)
    .reduce((total, session) => total + session.duration, 0);

  // Daily goal progress (assuming 8 pomodoros per day)
  const dailyGoal = 8;
  const progressPercentage = Math.min((completedSessions / dailyGoal) * 100, 100);

  return (
    <div className="py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Pomodoro Timer</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Boost your productivity with focused work sessions</p>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
        {/* Timer Display */}
        <Card className="mb-6">
          <CardContent className="p-8 text-center">
            <TimerDisplay 
              timeRemaining={formatTime(timeRemaining)}
              phase={getPhaseLabel()}
              isRunning={isRunning}
            />
            
            <div className="flex justify-center space-x-4 mb-6">
              <Button
                onClick={handleStart}
                disabled={isRunning}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium"
              >
                <Play className="w-4 h-4 mr-2" />
                Start
              </Button>
              <Button
                onClick={handlePause}
                disabled={!isRunning}
                variant="secondary"
                className="px-6 py-3 rounded-lg font-medium"
              >
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
              <Button
                onClick={handleReset}
                variant="destructive"
                className="px-6 py-3 rounded-lg font-medium"
              >
                <Square className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              Session {completedSessions + 1} • {getPhaseLabel()}
            </div>
          </CardContent>
        </Card>

        {/* Timer Settings and Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Timer Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Timer Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Focus Duration (minutes)
                </Label>
                <Input 
                  type="number" 
                  value={currentSettings.pomodoroFocusTime} 
                  onChange={(e) => updateSettingsMutation.mutate({ 
                    pomodoroFocusTime: parseInt(e.target.value) || 25 
                  })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Short Break (minutes)
                </Label>
                <Input 
                  type="number" 
                  value={currentSettings.pomodoroShortBreak} 
                  onChange={(e) => updateSettingsMutation.mutate({ 
                    pomodoroShortBreak: parseInt(e.target.value) || 5 
                  })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Long Break (minutes)
                </Label>
                <Input 
                  type="number" 
                  value={currentSettings.pomodoroLongBreak} 
                  onChange={(e) => updateSettingsMutation.mutate({ 
                    pomodoroLongBreak: parseInt(e.target.value) || 15 
                  })}
                  className="mt-1"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="auto-start"
                  checked={autoStart}
                  onCheckedChange={setAutoStart}
                />
                <Label htmlFor="auto-start" className="text-sm text-gray-700 dark:text-gray-300">
                  Auto-start next session
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Today's Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Today's Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Completed Sessions</span>
                <span className="text-lg font-medium text-gray-900 dark:text-white">
                  {completedSessions}/{dailyGoal}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Focus Time</span>
                <span className="text-lg font-medium text-gray-900 dark:text-white">
                  {Math.floor(focusTime / 60)}h {focusTime % 60}m
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Break Time</span>
                <span className="text-lg font-medium text-gray-900 dark:text-white">
                  {breakTime}m
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span>Daily Goal Progress</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
