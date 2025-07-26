import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ChartWrapper from "@/components/analytics/chart-wrapper";
import { calculateScores, getScoreColor, getScoreLabel, getMotivationalMessage, generateProductivityInsights } from "@/lib/scoring";
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Calendar,
  Clock,
  CheckCircle,
  Droplet,
  Shield,
  Star,
  Award,
  Zap
} from "lucide-react";
import type { Task, PomodoroSession, WaterIntake, HabitEntry } from "@shared/schema";

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("day");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const { data: dashboardStats } = useQuery({
    queryKey: ['/api/analytics/dashboard'],
  });

  const { data: weeklyData } = useQuery({
    queryKey: ['/api/analytics/weekly'],
  });

  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ['/api/tasks'],
  });

  const { data: pomodoroSessions = [] } = useQuery<PomodoroSession[]>({
    queryKey: ['/api/pomodoro/sessions'],
    queryParams: { date: selectedDate },
  });

  const { data: waterIntake = [] } = useQuery<WaterIntake[]>({
    queryKey: ['/api/water'],
    queryParams: { date: selectedDate },
  });

  const { data: habitEntries = [] } = useQuery<HabitEntry[]>({
    queryKey: ['/api/habits/entries'],
    queryParams: { date: selectedDate },
  });

  // Calculate detailed scores
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;
  const completedPomodoros = pomodoroSessions.filter(s => s.completed).length;
  const totalWater = waterIntake.reduce((sum, intake) => sum + intake.amount, 0);
  const completedHabits = habitEntries.filter(entry => entry.completed).length;
  const totalHabits = habitEntries.length;

  const activityData = {
    completedTasks,
    totalTasks,
    completedPomodoros,
    waterIntake: totalWater,
    waterGoal: 2500,
    completedHabits,
    totalHabits,
    distractionBlockingMinutes: 480, // Mock data for distraction blocking
  };

  const scores = calculateScores(activityData);
  const insights = generateProductivityInsights(activityData);

  // Chart data
  const performanceChartData = weeklyData ? {
    labels: weeklyData.labels,
    datasets: [
      {
        label: 'Tasks',
        data: [85, 88, 92, 90, 87, 89, 91],
        borderColor: 'hsl(207, 90%, 54%)',
        backgroundColor: 'hsla(207, 90%, 54%, 0.1)',
      },
      {
        label: 'Focus',
        data: [78, 82, 87, 85, 83, 86, 88],
        borderColor: 'hsl(119, 62%, 50%)',
        backgroundColor: 'hsla(119, 62%, 50%, 0.1)',
      },
      {
        label: 'Habits',
        data: [72, 75, 80, 83, 81, 84, 86],
        borderColor: 'hsl(38, 92%, 50%)',
        backgroundColor: 'hsla(38, 92%, 50%, 0.1)',
      }
    ]
  } : null;

  const activityBreakdownData = {
    labels: ['Tasks', 'Focus Time', 'Breaks', 'Learning'],
    datasets: [{
      data: [35, 30, 15, 20],
      backgroundColor: [
        'hsl(207, 90%, 54%)',
        'hsl(119, 62%, 50%)',
        'hsl(38, 92%, 50%)',
        'hsl(271, 81%, 56%)'
      ]
    }]
  };

  const ScoreCard = ({ title, score, icon: Icon, color }: {
    title: string;
    score: number;
    icon: any;
    color: string;
  }) => (
    <Card>
      <CardContent className="p-4 text-center">
        <div className={`w-12 h-12 rounded-full ${color} bg-opacity-10 flex items-center justify-center mx-auto mb-3`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{title}</div>
        <Badge variant="secondary" className="mt-2 text-xs">
          {getScoreLabel(score)}
        </Badge>
      </CardContent>
    </Card>
  );

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Analytics & Reports</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Comprehensive insights into your productivity patterns and performance
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="year">Year</SelectItem>
              </SelectContent>
            </Select>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Overall Score Card */}
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="relative">
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-gray-200 dark:text-gray-700"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - scores.overall / 100)}`}
                        className={getScoreColor(scores.overall)}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-2xl font-bold ${getScoreColor(scores.overall)}`}>
                        {scores.overall}
                      </span>
                    </div>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Overall Productivity Score
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {getMotivationalMessage(scores.overall)}
                </p>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {getScoreLabel(scores.overall)}
                </Badge>
              </CardContent>
            </Card>

            {/* Score Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <ScoreCard
                title="Tasks Score"
                score={scores.tasks}
                icon={CheckCircle}
                color="text-blue-600"
              />
              <ScoreCard
                title="Focus Score"
                score={scores.pomodoro}
                icon={Clock}
                color="text-green-600"
              />
              <ScoreCard
                title="Water Score"
                score={scores.water}
                icon={Droplet}
                color="text-cyan-600"
              />
              <ScoreCard
                title="Habits Score"
                score={scores.habits}
                icon={Target}
                color="text-purple-600"
              />
              <ScoreCard
                title="Focus Shield"
                score={scores.focus}
                icon={Shield}
                color="text-orange-600"
              />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Performance Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    {performanceChartData && (
                      <ChartWrapper type="line" data={performanceChartData} />
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Activity Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ChartWrapper type="doughnut" data={activityBreakdownData} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Performance Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                      Task Performance
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-900 dark:text-white">Completion Rate</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-900 dark:text-white">Completed Tasks</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {completedTasks}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-900 dark:text-white">Pending Tasks</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {totalTasks - completedTasks}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                      Focus Metrics
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-900 dark:text-white">Pomodoros Today</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {completedPomodoros}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-900 dark:text-white">Focus Time</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {Math.floor((completedPomodoros * 25) / 60)}h {(completedPomodoros * 25) % 60}m
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-900 dark:text-white">Average Session</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">25m</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                      Health & Habits
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-900 dark:text-white">Water Goal</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {Math.round((totalWater / 2500) * 100)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-900 dark:text-white">Habits Completed</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {completedHabits}/{totalHabits}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-900 dark:text-white">Consistency Rate</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Productivity Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insights.length > 0 ? (
                    insights.map((insight, index) => (
                      <div key={index} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-800 dark:text-blue-200">{insight}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      Complete more activities to generate personalized insights!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Focus Improvement</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Try using longer focus sessions during your peak productivity hours.
                    </p>
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Task Management</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Consider breaking down complex tasks into smaller, manageable subtasks.
                    </p>
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Health Habits</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Set reminders to maintain consistent hydration throughout the day.
                    </p>
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Consistency</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Build streaks by focusing on 1-2 key habits rather than many at once.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Daily Goals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Complete 8 tasks</span>
                    <Badge variant={completedTasks >= 8 ? "default" : "secondary"}>
                      {completedTasks}/8
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">8 Pomodoro sessions</span>
                    <Badge variant={completedPomodoros >= 8 ? "default" : "secondary"}>
                      {completedPomodoros}/8
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Drink 2.5L water</span>
                    <Badge variant={totalWater >= 2500 ? "default" : "secondary"}>
                      {(totalWater / 1000).toFixed(1)}L/2.5L
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Weekly Goals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Maintain 80% task completion</span>
                    <Badge variant="secondary">In Progress</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">40+ focus hours</span>
                    <Badge variant="secondary">In Progress</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Build 3-day habit streaks</span>
                    <Badge variant="secondary">In Progress</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="w-5 h-5 mr-2" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                      <Award className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">First Task Completed</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Completed your first task</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Focus Master</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Completed 10 Pomodoro sessions</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
