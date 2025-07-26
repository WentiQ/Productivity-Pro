import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { 
  Gamepad2, 
  Brain, 
  Music, 
  BookOpen, 
  Coffee, 
  Headphones,
  Play,
  Pause,
  SkipForward,
  Volume2,
  Shuffle,
  Repeat,
  ExternalLink,
  Trophy,
  Clock,
  Target,
  Zap
} from "lucide-react";

export default function TimePass() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("games");
  
  // Chess state
  const [chessGame, setChessGame] = useState({
    isPlaying: false,
    difficulty: "medium",
    timeControl: "10+0",
  });

  // Sudoku state
  const [sudokuGame, setSudokuGame] = useState({
    difficulty: "medium",
    progress: 35,
    timeElapsed: "05:42",
  });

  // Music player state
  const [musicPlayer, setMusicPlayer] = useState({
    isPlaying: false,
    currentTrack: "Focus Beats - Deep Work",
    volume: 75,
    playlist: "Productivity Mix",
    progress: 45,
  });

  // Reading state
  const [readingList] = useState([
    {
      title: "Productivity Trends 2024",
      author: "TechCrunch",
      readTime: "3 min",
      category: "Technology",
      progress: 0,
    },
    {
      title: "Remote Work Best Practices",
      author: "Harvard Business Review",
      readTime: "5 min",
      category: "Business",
      progress: 60,
    },
    {
      title: "The Science of Focus",
      author: "Nature Magazine",
      readTime: "8 min",
      category: "Science",
      progress: 100,
    },
  ]);

  // Quiz state
  const [quiz, setQuiz] = useState({
    currentQuestion: 1,
    totalQuestions: 10,
    score: 0,
    category: "general",
    timeRemaining: 45,
  });

  // Meditation state
  const [meditation, setMeditation] = useState({
    isActive: false,
    sessionType: "breathing",
    duration: 5,
    progress: 0,
  });

  const handleChessStart = () => {
    setChessGame(prev => ({ ...prev, isPlaying: true }));
    toast({
      title: "Chess Game Started",
      description: "Good luck with your game!",
    });
  };

  const handleSudokuStart = (difficulty: string) => {
    setSudokuGame(prev => ({ ...prev, difficulty, progress: 0 }));
    toast({
      title: "New Sudoku Puzzle",
      description: `Started ${difficulty} difficulty puzzle`,
    });
  };

  const toggleMusic = () => {
    setMusicPlayer(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
    toast({
      title: musicPlayer.isPlaying ? "Music Paused" : "Music Playing",
      description: musicPlayer.currentTrack,
    });
  };

  const startMeditation = () => {
    setMeditation(prev => ({ ...prev, isActive: true, progress: 0 }));
    toast({
      title: "Meditation Started",
      description: `${meditation.duration} minute ${meditation.sessionType} session`,
    });
  };

  const startQuiz = (category: string) => {
    setQuiz(prev => ({ ...prev, category, currentQuestion: 1, score: 0 }));
    toast({
      title: "Quiz Started",
      description: `${category} knowledge quiz`,
    });
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Time Pass</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Take a productive break with these engaging activities
        </p>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="games">Games</TabsTrigger>
            <TabsTrigger value="music">Music</TabsTrigger>
            <TabsTrigger value="reading">Reading</TabsTrigger>
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
            <TabsTrigger value="meditation">Meditation</TabsTrigger>
            <TabsTrigger value="entertainment">More</TabsTrigger>
          </TabsList>

          {/* Games Tab */}
          <TabsContent value="games" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Chess */}
              <Card className="overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800 flex items-center justify-center">
                  <div className="text-6xl">♛</div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Chess</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Challenge yourself with a strategic game of chess
                  </p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Difficulty:</span>
                      <select 
                        className="text-sm border rounded px-2 py-1 bg-white dark:bg-gray-700"
                        value={chessGame.difficulty}
                        onChange={(e) => setChessGame(prev => ({ ...prev, difficulty: e.target.value }))}
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Time Control:</span>
                      <select 
                        className="text-sm border rounded px-2 py-1 bg-white dark:bg-gray-700"
                        value={chessGame.timeControl}
                        onChange={(e) => setChessGame(prev => ({ ...prev, timeControl: e.target.value }))}
                      >
                        <option value="5+0">5 min</option>
                        <option value="10+0">10 min</option>
                        <option value="15+10">15+10</option>
                      </select>
                    </div>
                  </div>

                  <Button 
                    onClick={handleChessStart}
                    className="w-full"
                    disabled={chessGame.isPlaying}
                  >
                    {chessGame.isPlaying ? "Game in Progress" : "Start New Game"}
                  </Button>
                </CardContent>
              </Card>

              {/* Sudoku */}
              <Card className="overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-1 w-24 h-24">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="bg-white dark:bg-gray-800 rounded flex items-center justify-center text-xs font-bold">
                        {Math.floor(Math.random() * 9) + 1}
                      </div>
                    ))}
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Sudoku</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Sharpen your logic with number puzzles
                  </p>

                  {sudokuGame.progress > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{sudokuGame.progress}%</span>
                      </div>
                      <Progress value={sudokuGame.progress} className="mb-2" />
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Time: {sudokuGame.timeElapsed}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <Button 
                      size="sm" 
                      variant={sudokuGame.difficulty === "easy" ? "default" : "outline"}
                      onClick={() => handleSudokuStart("easy")}
                    >
                      Easy
                    </Button>
                    <Button 
                      size="sm" 
                      variant={sudokuGame.difficulty === "medium" ? "default" : "outline"}
                      onClick={() => handleSudokuStart("medium")}
                    >
                      Medium
                    </Button>
                    <Button 
                      size="sm" 
                      variant={sudokuGame.difficulty === "hard" ? "default" : "outline"}
                      onClick={() => handleSudokuStart("hard")}
                    >
                      Hard
                    </Button>
                  </div>

                  <Button className="w-full">
                    New Puzzle
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Games */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="w-5 h-5 mr-2" />
                    Quick Brain Games
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Target className="w-4 h-4 mr-2" />
                    Memory Challenge
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Zap className="w-4 h-4 mr-2" />
                    Speed Math
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Clock className="w-4 h-4 mr-2" />
                    Reaction Time
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Trophy className="w-4 h-4 mr-2" />
                    Pattern Recognition
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Music Tab */}
          <TabsContent value="music" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Music Player */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Music className="w-5 h-5 mr-2" />
                    Focus Music Player
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <Music className="w-12 h-12 text-white" />
                    </div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {musicPlayer.currentTrack}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {musicPlayer.playlist}
                    </p>
                  </div>

                  <div>
                    <Progress value={musicPlayer.progress} className="mb-2" />
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>2:34</span>
                      <span>5:42</span>
                    </div>
                  </div>

                  <div className="flex justify-center items-center space-x-4">
                    <Button size="sm" variant="outline">
                      <Shuffle className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <SkipForward className="w-4 h-4 rotate-180" />
                    </Button>
                    <Button onClick={toggleMusic} className="w-12 h-12 rounded-full">
                      {musicPlayer.isPlaying ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6" />
                      )}
                    </Button>
                    <Button size="sm" variant="outline">
                      <SkipForward className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Repeat className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Volume2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <Slider
                      value={[musicPlayer.volume]}
                      onValueChange={(value) => setMusicPlayer(prev => ({ ...prev, volume: value[0] }))}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                      {musicPlayer.volume}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Music Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>Focus Playlists</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                          <Music className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">Rain Sounds</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Ambient • 2 hours</p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Play className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                          <Headphones className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">White Noise</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Focus • 1 hour</p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Play className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                          <Coffee className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">Cafe Sounds</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Background • 3 hours</p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Play className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button className="w-full" variant="outline">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Spotify
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reading Tab */}
          <TabsContent value="reading" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Curated Articles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {readingList.map((article, index) => (
                    <div key={index} className="border-l-4 border-primary pl-4 py-2">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {article.title}
                        </h4>
                        <Badge variant="secondary" className="ml-2">
                          {article.readTime}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        By {article.author} • {article.category}
                      </p>
                      {article.progress > 0 && (
                        <div className="mb-2">
                          <Progress value={article.progress} className="h-1" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {article.progress}% complete
                          </span>
                        </div>
                      )}
                      <Button size="sm" variant="outline">
                        {article.progress > 0 ? 'Continue Reading' : 'Start Reading'}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Reading Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="justify-start">
                      Technology
                    </Button>
                    <Button variant="outline" className="justify-start">
                      Business
                    </Button>
                    <Button variant="outline" className="justify-start">
                      Science
                    </Button>
                    <Button variant="outline" className="justify-start">
                      Self-Help
                    </Button>
                    <Button variant="outline" className="justify-start">
                      Design
                    </Button>
                    <Button variant="outline" className="justify-start">
                      Health
                    </Button>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Reading Stats</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Articles this week:</span>
                        <span>12</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Reading time:</span>
                        <span>2h 35m</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Favorite category:</span>
                        <span>Technology</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Quiz Tab */}
          <TabsContent value="quiz" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="w-5 h-5 mr-2" />
                    Quick Knowledge Quiz
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      onClick={() => startQuiz("General Knowledge")}
                      variant="outline" 
                      className="h-20 flex-col"
                    >
                      <Trophy className="w-6 h-6 mb-1" />
                      General Knowledge
                    </Button>
                    <Button 
                      onClick={() => startQuiz("Science & Tech")}
                      variant="outline" 
                      className="h-20 flex-col"
                    >
                      <Zap className="w-6 h-6 mb-1" />
                      Science & Tech
                    </Button>
                    <Button 
                      onClick={() => startQuiz("History")}
                      variant="outline" 
                      className="h-20 flex-col"
                    >
                      <BookOpen className="w-6 h-6 mb-1" />
                      History
                    </Button>
                    <Button 
                      onClick={() => startQuiz("Geography")}
                      variant="outline" 
                      className="h-20 flex-col"
                    >
                      <Target className="w-6 h-6 mb-1" />
                      Geography
                    </Button>
                  </div>

                  {quiz.currentQuestion > 1 && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex justify-between text-sm text-blue-800 dark:text-blue-200 mb-2">
                        <span>Question {quiz.currentQuestion} of {quiz.totalQuestions}</span>
                        <span>Score: {quiz.score}</span>
                      </div>
                      <Progress value={(quiz.currentQuestion / quiz.totalQuestions) * 100} />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quiz Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Quizzes completed:</span>
                      <Badge variant="secondary">47</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Average score:</span>
                      <Badge variant="secondary">8.2/10</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Best category:</span>
                      <Badge variant="secondary">Science & Tech</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Current streak:</span>
                      <Badge variant="secondary">5 days</Badge>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Achievements</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm">Quiz Master</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">Perfect Score</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Meditation Tab */}
          <TabsContent value="meditation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Coffee className="w-5 h-5 mr-2" />
                    Meditation Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <Coffee className="w-12 h-12 text-white" />
                      </div>
                    </div>
                    
                    {meditation.isActive && (
                      <div className="mb-4">
                        <Progress value={meditation.progress} className="mb-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {Math.floor(meditation.duration * (meditation.progress / 100))} / {meditation.duration} minutes
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Session Type
                      </label>
                      <select 
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700"
                        value={meditation.sessionType}
                        onChange={(e) => setMeditation(prev => ({ ...prev, sessionType: e.target.value }))}
                      >
                        <option value="breathing">Breathing Exercise</option>
                        <option value="mindfulness">Mindfulness</option>
                        <option value="focus">Focus Training</option>
                        <option value="relaxation">Relaxation</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Duration: {meditation.duration} minutes
                      </label>
                      <Slider
                        value={[meditation.duration]}
                        onValueChange={(value) => setMeditation(prev => ({ ...prev, duration: value[0] }))}
                        max={30}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={startMeditation}
                    className="w-full"
                    disabled={meditation.isActive}
                  >
                    {meditation.isActive ? "Session Active" : "Start Session"}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Meditation Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Sessions this week:</span>
                      <Badge variant="secondary">12</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total time:</span>
                      <Badge variant="secondary">2h 15m</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Current streak:</span>
                      <Badge variant="secondary">5 days</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Longest session:</span>
                      <Badge variant="secondary">20 min</Badge>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Preset Sessions</h4>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-between">
                        <span>5 Min Breathing</span>
                        <Badge variant="secondary">Beginner</Badge>
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-between">
                        <span>10 Min Focus</span>
                        <Badge variant="secondary">Intermediate</Badge>
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-between">
                        <span>15 Min Mindfulness</span>
                        <Badge variant="secondary">Advanced</Badge>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Entertainment Tab */}
          <TabsContent value="entertainment" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Video Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    TED Talks
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Educational YouTube
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Coursera Videos
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Podcasts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Headphones className="w-4 h-4 mr-2" />
                    Productivity Podcasts
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Headphones className="w-4 h-4 mr-2" />
                    Tech Talks
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Headphones className="w-4 h-4 mr-2" />
                    Business Insights
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Activities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Target className="w-4 h-4 mr-2" />
                    Word of the Day
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Brain className="w-4 h-4 mr-2" />
                    Daily Trivia
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Clock className="w-4 h-4 mr-2" />
                    Time Filler Games
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
