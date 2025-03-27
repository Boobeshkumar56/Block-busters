import React, { useState, useEffect } from "react";
import { ArrowLeft, Loader2, Heart, Salad, HeartPulse, Sun, Coffee, User } from "lucide-react";
import { Link } from "react-router-dom";
import GlassCard from "@/components/GlassCard";
import apiService from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface RecommendationItem {
  title: string;
  description: string;
  detail?: string;
}

interface RecommendationData {
  diet: string[];
  exercise: string[];
  lifestyle: string[];
}

interface HealthProfile {
  age: string;
  weight: string;
  height: string;
  activityLevel: string;
  goals: string[];
  conditions: string[];
}

const Recommendations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendationData | null>(null);
  const [activeTab, setActiveTab] = useState<'diet' | 'exercise' | 'lifestyle'>('diet');
  const [healthProfile, setHealthProfile] = useState<HealthProfile>({
    age: "",
    weight: "",
    height: "",
    activityLevel: "moderate",
    goals: [],
    conditions: []
  });
  const [showProfileForm, setShowProfileForm] = useState(true);
  
  const getRecommendations = async () => {
    if (!healthProfile.age || !healthProfile.height || !healthProfile.weight) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await apiService.getRecommendations(healthProfile);
      
      if (response.success) {
        setRecommendations(response.recommendations);
        setShowProfileForm(false);
        toast.success("Recommendations generated successfully");
      } else {
        toast.error(response.message || "Failed to get recommendations");
      }
    } catch (error) {
      console.error("Error getting recommendations:", error);
      toast.error("An error occurred while getting recommendations");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setHealthProfile(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (category: 'goals' | 'conditions', item: string) => {
    setHealthProfile(prev => {
      const items = [...prev[category]];
      
      if (items.includes(item)) {
        return { ...prev, [category]: items.filter(i => i !== item) };
      } else {
        return { ...prev, [category]: [...items, item] };
      }
    });
  };
  
  const activityLevels = [
    { value: "sedentary", label: "Sedentary (little to no exercise)" },
    { value: "light", label: "Light (exercise 1-3 days/week)" },
    { value: "moderate", label: "Moderate (exercise 3-5 days/week)" },
    { value: "active", label: "Active (exercise 6-7 days/week)" },
    { value: "very_active", label: "Very Active (intense exercise daily)" },
  ];
  
  const goalOptions = [
    "Weight loss",
    "Weight gain",
    "Muscle building",
    "Improved fitness",
    "Stress reduction",
    "Better sleep",
    "Hormone balance",
    "Fertility support",
    "Energy boost"
  ];
  
  const conditionOptions = [
    "PCOS",
    "Endometriosis",
    "Thyroid issues",
    "Diabetes/pre-diabetes",
    "High blood pressure",
    "Iron deficiency",
    "Vitamin D deficiency",
    "Irregular periods",
    "Hormonal imbalance"
  ];
  
  const renderRecommendations = () => {
    if (!recommendations) return null;
    
    const tabContent = {
      diet: {
        title: "Diet Recommendations",
        icon: Salad,
        color: "text-green-600",
        data: recommendations.diet
      },
      exercise: {
        title: "Exercise Recommendations",
        icon: HeartPulse,
        color: "text-blue-600",
        data: recommendations.exercise
      },
      lifestyle: {
        title: "Lifestyle Recommendations",
        icon: Sun,
        color: "text-amber-600",
        data: recommendations.lifestyle
      }
    };
    
    const current = tabContent[activeTab];
    const IconComponent = current.icon;
    
    return (
      <div>
        <div className="flex border-b border-health-100 mb-6">
          {Object.entries(tabContent).map(([key, tab]) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={cn(
                  "flex items-center px-4 py-3 border-b-2 transition-colors",
                  activeTab === key
                    ? `border-health-500 text-health-700 ${tab.color}`
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <TabIcon className="w-4 h-4 mr-2" />
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            );
          })}
        </div>
        
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <IconComponent className={cn("w-5 h-5 mr-2", current.color)} />
          {current.title}
        </h2>
        
        <div className="space-y-4">
          {current.data.map((item, index) => (
            <div 
              key={index} 
              className="p-4 rounded-lg bg-white shadow-sm border border-health-100 hover:border-health-200 transition-colors"
            >
              <p>{item}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link to="/" className="text-health-700 hover:text-health-800 inline-flex items-center">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold mt-4 mb-2">Health Recommendations</h1>
        <p className="text-muted-foreground">
          Get personalized health, nutrition, and wellness recommendations based on your health profile.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <GlassCard>
            {showProfileForm ? (
              <>
                <h2 className="text-xl font-semibold mb-6">Your Health Profile</h2>
                <p className="text-muted-foreground mb-6">
                  Fill in your health information to receive personalized recommendations.
                  All information is processed locally and not stored on our servers.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Age <span className="text-health-600">*</span>
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={healthProfile.age}
                      onChange={handleInputChange}
                      placeholder="Your age"
                      className="health-input"
                      min={18}
                      max={100}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Height (cm) <span className="text-health-600">*</span>
                    </label>
                    <input
                      type="number"
                      name="height"
                      value={healthProfile.height}
                      onChange={handleInputChange}
                      placeholder="Your height in cm"
                      className="health-input"
                      min={100}
                      max={220}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Weight (kg) <span className="text-health-600">*</span>
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={healthProfile.weight}
                      onChange={handleInputChange}
                      placeholder="Your weight in kg"
                      className="health-input"
                      min={30}
                      max={200}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Activity Level
                    </label>
                    <select
                      name="activityLevel"
                      value={healthProfile.activityLevel}
                      onChange={handleInputChange}
                      className="health-input"
                    >
                      {activityLevels.map(level => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Health Goals (select all that apply)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {goalOptions.map(goal => (
                      <label
                        key={goal}
                        className={cn(
                          "px-3 py-1 rounded-full text-sm cursor-pointer transition-colors",
                          healthProfile.goals.includes(goal)
                            ? "bg-health-500 text-white"
                            : "bg-health-100 text-foreground hover:bg-health-200"
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={healthProfile.goals.includes(goal)}
                          onChange={() => handleCheckboxChange('goals', goal)}
                          className="sr-only"
                        />
                        {goal}
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="mb-8">
                  <label className="block text-sm font-medium mb-2">
                    Health Conditions (select all that apply)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {conditionOptions.map(condition => (
                      <label
                        key={condition}
                        className={cn(
                          "px-3 py-1 rounded-full text-sm cursor-pointer transition-colors",
                          healthProfile.conditions.includes(condition)
                            ? "bg-health-500 text-white"
                            : "bg-health-100 text-foreground hover:bg-health-200"
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={healthProfile.conditions.includes(condition)}
                          onChange={() => handleCheckboxChange('conditions', condition)}
                          className="sr-only"
                        />
                        {condition}
                      </label>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={getRecommendations}
                  className="btn-primary w-full md:w-auto flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating recommendations...
                    </>
                  ) : (
                    "Get Personalized Recommendations"
                  )}
                </button>
              </>
            ) : (
              renderRecommendations()
            )}
          </GlassCard>
        </div>
        
        <div>
          {!showProfileForm && (
            <div className="space-y-6">
              <GlassCard>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Your Health Profile</h3>
                  <button 
                    onClick={() => setShowProfileForm(true)}
                    className="text-sm text-health-700 hover:text-health-800"
                  >
                    Edit
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-muted-foreground mr-2" />
                    <span className="text-sm text-muted-foreground">Age:</span>
                    <span className="ml-auto font-medium">{healthProfile.age} years</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 text-muted-foreground mr-2" />
                    <span className="text-sm text-muted-foreground">Height:</span>
                    <span className="ml-auto font-medium">{healthProfile.height} cm</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Coffee className="w-4 h-4 text-muted-foreground mr-2" />
                    <span className="text-sm text-muted-foreground">Weight:</span>
                    <span className="ml-auto font-medium">{healthProfile.weight} kg</span>
                  </div>
                  
                  <div className="flex items-center">
                    <HeartPulse className="w-4 h-4 text-muted-foreground mr-2" />
                    <span className="text-sm text-muted-foreground">Activity:</span>
                    <span className="ml-auto font-medium capitalize">{healthProfile.activityLevel}</span>
                  </div>
                </div>
                
                {healthProfile.goals.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm text-muted-foreground mb-2">Goals:</h4>
                    <div className="flex flex-wrap gap-1">
                      {healthProfile.goals.map(goal => (
                        <span key={goal} className="text-xs bg-health-100 px-2 py-1 rounded-full">
                          {goal}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {healthProfile.conditions.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm text-muted-foreground mb-2">Conditions:</h4>
                    <div className="flex flex-wrap gap-1">
                      {healthProfile.conditions.map(condition => (
                        <span key={condition} className="text-xs bg-health-50 px-2 py-1 rounded-full">
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </GlassCard>
              
              <GlassCard>
                <h3 className="font-medium mb-4">Related Resources</h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <a href="#" className="text-health-700 hover:text-health-800 hover:underline">
                      Understanding Hormonal Balance
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-health-700 hover:text-health-800 hover:underline">
                      Nutrition Guide for Women's Health
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-health-700 hover:text-health-800 hover:underline">
                      Exercise Plans for Hormonal Health
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-health-700 hover:text-health-800 hover:underline">
                      Managing Stress for Better Health
                    </a>
                  </li>
                </ul>
              </GlassCard>
              
              <div className="bg-health-50 p-4 rounded-lg">
                <p className="text-sm">
                  <strong>Disclaimer:</strong> These recommendations are generated based on the information you provided and general health guidelines. They are not a substitute for professional medical advice. Always consult with a healthcare provider before making significant changes to your diet, exercise, or lifestyle regimen.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
