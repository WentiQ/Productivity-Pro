import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { notificationService } from "@/lib/notifications";
import { Droplet, Plus, Target, TrendingUp, Clock } from "lucide-react";
import type { WaterIntake, UserSettings } from "@shared/schema";

export default function Water() {
  const [customAmount, setCustomAmount] = useState("");
  const { toast } = useToast();
  const today = new Date().toISOString().split('T')[0];

  const { data: waterIntake = [], isLoading } = useQuery<WaterIntake[]>({
    queryKey: ['/api/water'],
    queryParams: { date: today },
  });

  const { data: settings } = useQuery<UserSettings>({
    queryKey: ['/api/settings'],
  });

  const addWaterMutation = useMutation({
    mutationFn: async (amount: number) => {
      const response = await apiRequest('POST', '/api/water', { amount });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/water'] });
      toast({
        title: "Water Logged",
        description: "Keep up the good hydration!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to log water intake",
        variant: "destructive",
      });
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
        description: "Water tracking preferences saved",
      });
    },
  });

  // Calculate today's total intake
  const totalIntake = waterIntake.reduce((sum, intake) => sum + intake.amount, 0);
  const dailyGoal = settings?.waterDailyGoal || 2500; // Default 2.5L
  const progressPercentage = Math.min((totalIntake / dailyGoal) * 100, 100);

  // Quick add amounts
  const quickAmounts = [250, 500, 750, 1000]; // ml

  const handleQuickAdd = (amount: number) => {
    addWaterMutation.mutate(amount);
  };

  const handleCustomAdd = () => {
    const amount = parseInt(customAmount);
    if (amount && amount > 0) {
      addWaterMutation.mutate(amount);
      setCustomAmount("");
    }
  };

  const handleReminderSetup = () => {
    const intervalMinutes = settings?.waterReminderInterval || 60;
    notificationService.scheduleReminder(intervalMinutes * 60 * 1000, {
      title: 'Hydration Reminder 💧',
      body: 'Time to drink some water! Stay hydrated for better focus.',
      tag: 'water-reminder',
    });
    toast({
      title: "Reminder Set",
      description: `You'll be reminded every ${intervalMinutes} minutes`,
    });
  };

  // Get recent intake history (last 7 days)
  const getWeeklyStats = () => {
    // This would typically come from an API call with date range
    // For now, showing mock data structure
    return {
      average: 2200,
      bestDay: 2800,
      streak: 5
    };
  };

  const weeklyStats = getWeeklyStats();
  const glassHeight = Math.min((totalIntake / dailyGoal) * 200, 200); // Max 200px height

  return (
    <div className="py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Water Tracker</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Stay hydrated throughout the day</p>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
        {/* Main Water Display */}
        <Card className="mb-6">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center items-end mb-6">
              {/* Water Glass Visualization */}
              <div className="relative">
                <div className="w-24 h-48 border-4 border-blue-400 border-t-0 rounded-b-2xl bg-transparent relative overflow-hidden">
                  <div 
                    className="absolute bottom-0 left-0 right-0 water-level transition-all duration-500 ease-out"
                    style={{ height: `${glassHeight}px` }}
                  />
                  {/* Water level markers */}
                  <div className="absolute inset-x-0 top-0 flex flex-col justify-between h-full text-xs text-gray-400 px-1">
                    <div className="border-t border-gray-300 w-2"></div>
                    <div className="border-t border-gray-300 w-2"></div>
                    <div className="border-t border-gray-300 w-2"></div>
                    <div className="border-t border-gray-300 w-2"></div>
                  </div>
                </div>
                <Droplet className="w-6 h-6 text-blue-500 mx-auto mt-2" />
              </div>
              
              <div className="ml-8 text-left">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                  {(totalIntake / 1000).toFixed(1)}L
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  of {(dailyGoal / 1000).toFixed(1)}L goal
                </div>
                <div className="mt-2">
                  <Progress value={progressPercentage} className="w-32" />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {Math.round(progressPercentage)}% complete
                </div>
              </div>
            </div>

            {/* Quick Add Buttons */}
            <div className="flex justify-center space-x-3 mb-4">
              {quickAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  onClick={() => handleQuickAdd(amount)}
                  disabled={addWaterMutation.isPending}
                  className="flex flex-col items-center p-4 h-auto"
                >
                  <Droplet className="w-4 h-4 mb-1" />
                  <span className="text-xs">{amount}ml</span>
                </Button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="flex justify-center items-center space-x-2">
              <Input
                type="number"
                placeholder="Custom amount (ml)"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-40"
              />
              <Button 
                onClick={handleCustomAdd}
                disabled={!customAmount || addWaterMutation.isPending}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>

            {progressPercentage >= 100 && (
              <Badge className="mt-4 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                🎉 Daily goal achieved!
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Stats and Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Log */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Today's Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : waterIntake.length === 0 ? (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                  No water logged today. Start hydrating!
                </div>
              ) : (
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {waterIntake.map((intake, index) => (
                    <div key={intake.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <div className="flex items-center">
                        <Droplet className="w-4 h-4 text-blue-500 mr-2" />
                        <span className="text-sm font-medium">{intake.amount}ml</span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(intake.timestamp).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Settings & Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Settings & Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Daily Goal (ml)
                </Label>
                <Input
                  type="number"
                  value={settings?.waterDailyGoal || 2500}
                  onChange={(e) => updateSettingsMutation.mutate({
                    waterDailyGoal: parseInt(e.target.value) || 2500
                  })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Reminder Interval (minutes)
                </Label>
                <Input
                  type="number"
                  value={settings?.waterReminderInterval || 60}
                  onChange={(e) => updateSettingsMutation.mutate({
                    waterReminderInterval: parseInt(e.target.value) || 60
                  })}
                  className="mt-1"
                />
              </div>

              <Button onClick={handleReminderSetup} className="w-full">
                Set Reminder
              </Button>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Weekly Stats
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Average</span>
                    <span className="font-medium">{(weeklyStats.average / 1000).toFixed(1)}L</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Best Day</span>
                    <span className="font-medium">{(weeklyStats.bestDay / 1000).toFixed(1)}L</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Current Streak</span>
                    <span className="font-medium">{weeklyStats.streak} days</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
