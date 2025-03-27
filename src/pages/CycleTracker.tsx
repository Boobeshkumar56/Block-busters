import React, { useState, useEffect } from "react";
import { ArrowLeft, Calendar as CalendarIcon, Check, Loader2, Plus, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { format, addDays, parseISO, isSameDay, isWithinInterval, isBefore, isAfter, differenceInDays } from "date-fns";
import GlassCard from "@/components/GlassCard";
import apiService from "@/lib/api";
import { toast } from "sonner";

interface CycleData {
  startDate: string;
  endDate: string;
  symptoms: string[];
  flow: string;
}

interface CycleHistory {
  cycles: CycleData[];
  predictions: {
    nextPeriod: string;
    fertile: {
      start: string;
      end: string;
    };
  };
}

const flowOptions = [
  { value: "light", label: "Light" },
  { value: "medium", label: "Medium" },
  { value: "heavy", label: "Heavy" },
  { value: "spotting", label: "Spotting" }
];

const symptomOptions = [
  "Cramps",
  "Headache",
  "Bloating",
  "Fatigue",
  "Mood swings",
  "Breast tenderness",
  "Acne",
  "Back pain",
  "Nausea"
];

const CYCLE_STAGES = {
  MENSTRUAL: {
    name: "Menstrual Phase",
    description: "Day 1-5: Period occurs as the uterine lining sheds",
    color: "bg-health-200",
    textColor: "text-health-800"
  },
  FOLLICULAR: {
    name: "Follicular Phase",
    description: "Day 1-13: Overlaps with menstrual phase, as follicles develop",
    color: "bg-health-100",
    textColor: "text-health-700"
  },
  OVULATORY: {
    name: "Ovulatory Phase",
    description: "Day 14 (approx): Release of an egg from the ovary",
    color: "bg-blue-100",
    textColor: "text-blue-700"
  },
  LUTEAL: {
    name: "Luteal Phase",
    description: "Day 15-28: Post-ovulation until the next period",
    color: "bg-purple-100",
    textColor: "text-purple-700"
  }
};

const CycleTracker = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cycleHistory, setCycleHistory] = useState<CycleHistory | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentStage, setCurrentStage] = useState<keyof typeof CYCLE_STAGES | null>(null);
  const [currentCycleDay, setCurrentCycleDay] = useState<number | null>(null);
  const [newCycleData, setNewCycleData] = useState<Partial<CycleData>>({
    startDate: format(new Date(), "yyyy-MM-dd"),
    symptoms: [],
    flow: "medium"
  });

  useEffect(() => {
    if (newCycleData.startDate) {
      const startDate = parseISO(newCycleData.startDate);
      const endDate = addDays(startDate, 5);
      setNewCycleData(prev => ({
        ...prev,
        endDate: format(endDate, "yyyy-MM-dd")
      }));
    }
  }, [newCycleData.startDate]);

  useEffect(() => {
    const fetchCycleHistory = async () => {
      try {
        const response = await apiService.getCycleHistory("user123");
        if (response.success) {
          setCycleHistory(response);
        } else {
          toast.error("Failed to fetch cycle history");
        }
      } catch (error) {
        console.error("Error fetching cycle history:", error);
        toast.error("An error occurred while fetching cycle data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCycleHistory();
  }, []);

  useEffect(() => {
    if (!cycleHistory) return;

    const today = new Date();
    const { cycles, predictions } = cycleHistory;

    const lastPeriod = [...cycles].sort((a, b) => 
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    )[0];

    if (!lastPeriod) return;

    const lastPeriodStart = parseISO(lastPeriod.startDate);
    const daysSinceLastPeriod = differenceInDays(today, lastPeriodStart);

    setCurrentCycleDay(daysSinceLastPeriod + 1);

    if (daysSinceLastPeriod < 5) {
      setCurrentStage("MENSTRUAL");
    } else if (daysSinceLastPeriod < 14) {
      setCurrentStage("FOLLICULAR");
    } else if (daysSinceLastPeriod < 17) {
      setCurrentStage("OVULATORY");
    } else {
      setCurrentStage("LUTEAL");
    }
  }, [cycleHistory]);

  const handleAddCycle = async () => {
    if (!newCycleData.startDate || !newCycleData.flow) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiService.trackCycle({
        ...newCycleData,
        userId: "user123"
      });

      if (response.success) {
        if (cycleHistory) {
          const updatedHistory = {
            ...cycleHistory,
            cycles: [
              ...(cycleHistory.cycles || []),
              {
                startDate: newCycleData.startDate!,
                endDate: newCycleData.endDate!,
                symptoms: newCycleData.symptoms || [],
                flow: newCycleData.flow!
              }
            ],
            predictions: {
              nextPeriod: response.nextPeriod,
              fertile: response.fertile
            }
          };
          setCycleHistory(updatedHistory);
        }

        toast.success("Cycle data recorded successfully");
        setShowAddForm(false);

        setNewCycleData({
          startDate: format(new Date(), "yyyy-MM-dd"),
          symptoms: [],
          flow: "medium"
        });
      } else {
        toast.error(response.message || "Failed to record cycle data");
      }
    } catch (error) {
      console.error("Error adding cycle:", error);
      toast.error("An error occurred while recording cycle data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewCycleData(prev => ({ ...prev, [name]: value }));
  };

  const handleSymptomToggle = (symptom: string) => {
    setNewCycleData(prev => {
      const symptoms = prev.symptoms || [];

      if (symptoms.includes(symptom)) {
        return { ...prev, symptoms: symptoms.filter(s => s !== symptom) };
      } else {
        return { ...prev, symptoms: [...symptoms, symptom] };
      }
    });
  };

  const generateCalendarDays = () => {
    const days = [];
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const dayOfWeek = firstDay.getDay();
    for (let i = dayOfWeek; i > 0; i--) {
      const day = new Date(year, month, 1 - i);
      days.push({ date: day, isCurrentMonth: false });
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push({ date: new Date(year, month, day), isCurrentMonth: true });
    }

    const lastWeekDay = lastDay.getDay();
    for (let i = 1; i < 7 - lastWeekDay; i++) {
      const day = new Date(year, month + 1, i);
      days.push({ date: day, isCurrentMonth: false });
    }

    return days;
  };

  const getDayStatus = (date: Date) => {
    if (!cycleHistory) return { isPeriod: false, isFertile: false, isPredictedPeriod: false };

    const { cycles, predictions } = cycleHistory;

    const isPeriod = cycles.some(cycle => {
      const start = parseISO(cycle.startDate);
      const end = parseISO(cycle.endDate);
      return isWithinInterval(date, { start, end });
    });

    const isFertile = predictions?.fertile && isWithinInterval(date, {
      start: parseISO(predictions.fertile.start),
      end: parseISO(predictions.fertile.end)
    });

    const isPredictedPeriod = predictions?.nextPeriod && 
      isSameDay(date, parseISO(predictions.nextPeriod));

    return { isPeriod, isFertile, isPredictedPeriod };
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const findCycleForDate = (date: Date) => {
    if (!cycleHistory) return null;

    return cycleHistory.cycles.find(cycle => {
      const start = parseISO(cycle.startDate);
      const end = parseISO(cycle.endDate);
      return isWithinInterval(date, { start, end });
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link to="/" className="text-health-700 hover:text-health-800 inline-flex items-center">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold mt-4 mb-2">Menstrual Cycle Tracker</h1>
        <p className="text-muted-foreground">
          Track your menstrual cycle, symptoms, and get predictions for your next period and fertile window.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {format(currentDate, "MMMM yyyy")}
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 rounded-full hover:bg-health-100 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2 rounded-full hover:bg-health-100 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 transform rotate-180" />
                </button>
              </div>
            </div>
            
            {isLoading ? (
              <div className="min-h-[300px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-health-500 animate-spin" />
              </div>
            ) : (
              <>
                <div className={`mb-6 p-4 rounded-lg ${CYCLE_STAGES[currentStage]?.color} border border-${CYCLE_STAGES[currentStage]?.color.split('-')[1]}-200`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center">
                        <span className={`font-semibold ${CYCLE_STAGES[currentStage]?.textColor}`}>
                          {CYCLE_STAGES[currentStage]?.name}
                        </span>
                        <span className="ml-2 px-2 py-0.5 bg-white rounded-full text-xs font-medium">
                          Day {currentCycleDay} of cycle
                        </span>
                      </div>
                      <p className="text-sm mt-1">{CYCLE_STAGES[currentStage]?.description}</p>
                    </div>
                    <Info className="w-5 h-5 text-health-600" />
                  </div>
                </div>
                
                <div className="grid grid-cols-7 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
                    <div key={index} className="text-center font-medium text-sm py-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {generateCalendarDays().map((day, index) => {
                    const { isPeriod, isFertile, isPredictedPeriod } = getDayStatus(day.date);
                    
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedDate(day.date)}
                        className={`
                          relative p-2 h-12 rounded-full flex items-center justify-center transition-all
                          ${day.isCurrentMonth ? "text-foreground" : "text-muted-foreground opacity-50"}
                          ${isPeriod ? "bg-health-200" : ""}
                          ${isFertile ? "bg-blue-50" : ""}
                          ${isPredictedPeriod ? "bg-health-100 border border-health-300" : ""}
                          ${isSameDay(day.date, new Date()) ? "border-2 border-health-500" : ""}
                          ${selectedDate && isSameDay(day.date, selectedDate) ? "ring-2 ring-health-400" : ""}
                          hover:bg-health-50
                        `}
                      >
                        <span className="text-sm">
                          {format(day.date, "d")}
                        </span>
                        
                        {isPeriod && (
                          <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 h-1 w-1 bg-health-500 rounded-full" />
                        )}
                        
                        {isFertile && (
                          <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 h-1 w-1 bg-blue-400 rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </div>
                
                <div className="mt-6 flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center">
                    <span className="h-3 w-3 rounded-full bg-health-200 mr-2" />
                    Period
                  </div>
                  <div className="flex items-center">
                    <span className="h-3 w-3 rounded-full bg-blue-50 mr-2" />
                    Fertile Window
                  </div>
                  <div className="flex items-center">
                    <span className="h-3 w-3 rounded-full bg-health-100 border border-health-300 mr-2" />
                    Predicted Period
                  </div>
                  <div className="flex items-center">
                    <span className="h-3 w-3 rounded-full border-2 border-health-500 mr-2" />
                    Today
                  </div>
                </div>
              </>
            )}
            
            {selectedDate && (
              <div className="mt-6 pt-6 border-t border-health-100">
                <h3 className="font-medium mb-2">
                  {format(selectedDate, "EEEE, MMMM d, yyyy")}
                </h3>
                
                {findCycleForDate(selectedDate) ? (
                  <div className="bg-health-50 p-4 rounded-lg">
                    <div className="flex items-center text-health-700 font-medium mb-2">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      Period day
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Flow:</p>
                        <p className="capitalize">{findCycleForDate(selectedDate)?.flow || "Not recorded"}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Symptoms:</p>
                        {findCycleForDate(selectedDate)?.symptoms?.length ? (
                          <ul className="text-sm">
                            {findCycleForDate(selectedDate)?.symptoms.map((symptom, index) => (
                              <li key={index} className="inline-block bg-white px-2 py-1 rounded mr-1 mb-1">
                                {symptom}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>No symptoms recorded</p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-4">No period data recorded for this date.</p>
                    {isBefore(selectedDate, new Date()) && (
                      <button 
                        onClick={() => {
                          setShowAddForm(true);
                          setNewCycleData(prev => ({
                            ...prev,
                            startDate: format(selectedDate, "yyyy-MM-dd")
                          }));
                        }}
                        className="inline-flex items-center text-health-700 hover:text-health-800"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Record period for this date
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </GlassCard>
        </div>
        
        <div>
          {!showAddForm ? (
            <GlassCard>
              <h2 className="text-xl font-semibold mb-6">Cycle Insights</h2>
              
              {isLoading ? (
                <div className="min-h-[200px] flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-health-500 animate-spin" />
                </div>
              ) : cycleHistory ? (
                <>
                  <div className="lg:hidden mb-6">
                    {currentStage && currentCycleDay && (
                      <div className={`p-3 rounded-lg ${CYCLE_STAGES[currentStage].color} border border-${CYCLE_STAGES[currentStage].color.split('-')[1]}-200`}>
                        <div className="flex items-center justify-between">
                          <span className={`font-medium ${CYCLE_STAGES[currentStage].textColor}`}>
                            {CYCLE_STAGES[currentStage].name}
                          </span>
                          <span className="px-2 py-0.5 bg-white rounded-full text-xs">
                            Day {currentCycleDay}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-medium text-sm text-muted-foreground mb-2">
                      Next Period Expected
                    </h3>
                    <div className="bg-health-50 p-3 rounded-lg flex items-center">
                      <CalendarIcon className="w-5 h-5 text-health-700 mr-2" />
                      <span className="font-medium">
                        {format(parseISO(cycleHistory.predictions.nextPeriod), "MMMM d, yyyy")}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      This prediction is based on your cycle history and may vary.
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-medium text-sm text-muted-foreground mb-2">
                      Fertile Window
                    </h3>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center text-blue-700 font-medium">
                        {format(parseISO(cycleHistory.predictions.fertile.start), "MMMM d")} - {format(parseISO(cycleHistory.predictions.fertile.end), "MMMM d, yyyy")}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-medium text-sm text-muted-foreground mb-2">
                      Cycle Statistics
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-health-50 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">Average Cycle Length</p>
                        <p className="font-medium text-lg">28 days</p>
                      </div>
                      <div className="bg-health-50 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">Average Period Length</p>
                        <p className="font-medium text-lg">5 days</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-4">No cycle data recorded yet.</p>
                </div>
              )}
              
              <button
                onClick={() => setShowAddForm(true)}
                className="btn-primary w-full mt-4 flex items-center justify-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Record New Period
              </button>
            </GlassCard>
          ) : (
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Record New Period</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={newCycleData.startDate}
                    onChange={handleInputChange}
                    max={format(new Date(), "yyyy-MM-dd")}
                    className="health-input"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    End Date (estimated)
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={newCycleData.endDate}
                    onChange={handleInputChange}
                    className="health-input"
                    readOnly
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Automatically set to 5 days after start date. You can adjust this later.
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Flow
                  </label>
                  <select
                    name="flow"
                    value={newCycleData.flow}
                    onChange={handleInputChange}
                    className="health-input"
                  >
                    {flowOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Symptoms
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {symptomOptions.map(symptom => (
                      <button
                        key={symptom}
                        type="button"
                        onClick={() => handleSymptomToggle(symptom)}
                        className={`
                          px-3 py-1 rounded-full text-sm transition-colors
                          ${newCycleData.symptoms?.includes(symptom)
                            ? "bg-health-500 text-white"
                            : "bg-health-100 text-foreground hover:bg-health-200"}
                        `}
                      >
                        {newCycleData.symptoms?.includes(symptom) && (
                          <Check className="w-3 h-3 inline-block mr-1" />
                        )}
                        {symptom}
                      </button>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={handleAddCycle}
                  className="btn-primary w-full mt-6 flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Period Data"
                  )}
                </button>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default CycleTracker;
