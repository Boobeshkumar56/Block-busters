
import React, { useState } from "react";
import { ArrowLeft, Info, Loader2, AlertTriangle, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import GlassCard from "@/components/GlassCard";
import HealthMetricInput from "@/components/HealthMetricInput";
import apiService from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PCOSPredictor = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    height: "",
    bmi: "",
   
    cycleLength: "",
   
    irregularPeriods: "no",
    hairGrowth: "no",
    skinDarkening: "no",
    hairLoss: "no",
    pimples: "no",
    fastFood: "no",
    regExercise: "no",
    
  });
  
  const [result, setResult] = useState<any>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData((prev) => {
      // Update BMI automatically if height or weight changes
      if (name === "height" || name === "weight") {
        const height = name === "height" ? parseFloat(value) : parseFloat(prev.height);
        const weight = name === "weight" ? parseFloat(value) : parseFloat(prev.weight);
        
        // Calculate BMI: weight(kg) / (height(m))²
        if (height && weight) {
          const heightInM = height / 100;
          const bmi = (weight / (heightInM * heightInM)).toFixed(1);
          return { ...prev, [name]: value, bmi };
        }
      }
      
      return { ...prev, [name]: value };
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.age || !formData.weight || !formData.height) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await apiService.predictPCOS(formData);
      
      if (response.success) {
        setResult(response);
        toast.success("Prediction completed successfully");
      } else {
        toast.error(response.message || "Failed to get prediction");
      }
    } catch (error) {
      console.error("Error predicting PCOS:", error);
      toast.error("An error occurred during prediction");
    } finally {
      setIsLoading(false);
    }
  };
  
  const getRiskLevel = (risk: number) => {
    if (risk < 30) return { level: "Low", color: "text-green-500" };
    if (risk < 60) return { level: "Moderate", color: "text-amber-500" };
    return { level: "High", color: "text-red-500" };
  };
  
  const resetForm = () => {
    setResult(null);
    setFormData({
      age: "",
      weight: "",
      height: "",
      bmi: "",
    
      cycleLength: "",
      irregularPeriods: "no",
      hairGrowth: "no",
      skinDarkening: "no",
      hairLoss: "no",
      pimples: "no",
      fastFood: "no",
      regExercise: "no"
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link to="/" className="text-health-700 hover:text-health-800 inline-flex items-center">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold mt-4 mb-2">PCOS Risk Predictor</h1>
        <p className="text-muted-foreground">
          Answer the questions below to assess your potential PCOS risk factors. This tool provides an estimate only and is not a medical diagnosis.
        </p>
      </div>
      
      {!result ? (
        <GlassCard className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-3 bg-health-50 rounded-lg mb-6 text-sm flex items-start">
              <Info className="w-5 h-5 text-health-700 mr-2 mt-0.5 flex-shrink-0" />
              <p>
                This risk assessment tool is for informational purposes only. Results should be discussed with a healthcare professional.
              </p>
            </div>
            
            <h2 className="text-xl font-medium mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <HealthMetricInput
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter your age"
                required
                min={18}
                max={70}
                unit="years"
              />
              
              <HealthMetricInput
                label="Height"
                name="height"
                type="number"
                value={formData.height}
                onChange={handleChange}
                placeholder="Enter your height"
                required
                min={100}
                max={220}
                unit="cm"
              />
              
              <HealthMetricInput
                label="Weight"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                placeholder="Enter your weight"
                required
                min={30}
                max={200}
                unit="kg"
              />
              
              <HealthMetricInput
                label="BMI (Calculated)"
                name="bmi"
                type="text"
                value={formData.bmi}
                onChange={handleChange}
                placeholder="Calculated from height and weight"
                readOnly
                className="opacity-80"
              />
            </div>
            
            <div className="border-t border-health-100 pt-6">
              <h2 className="text-xl font-medium mb-4">Menstrual & Reproductive History</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <HealthMetricInput
                  label="Average Cycle Length"
                  name="cycleLength"
                  type="number"
                  value={formData.cycleLength}
                  onChange={handleChange}
                  placeholder="Average days between periods"
                  helperText="Regular cycles are typically 21-35 days"
                  min={15}
                  max={90}
                  unit="days"
                />
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Do you have irregular periods?
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="irregularPeriods"
                        value="yes"
                        checked={formData.irregularPeriods === "yes"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="irregularPeriods"
                        value="no"
                        checked={formData.irregularPeriods === "no"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      No
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-health-100 pt-6">
              <h2 className="text-xl font-medium mb-4">Common PCOS Symptoms</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Excessive facial/body hair growth?
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hairGrowth"
                        value="yes"
                        checked={formData.hairGrowth === "yes"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hairGrowth"
                        value="no"
                        checked={formData.hairGrowth === "no"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      No
                    </label>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Hair loss from scalp (male pattern)?
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hairLoss"
                        value="yes"
                        checked={formData.hairLoss === "yes"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hairLoss"
                        value="no"
                        checked={formData.hairLoss === "no"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      No
                    </label>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Persistent acne/pimples?
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="pimples"
                        value="yes"
                        checked={formData.pimples === "yes"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="pimples"
                        value="no"
                        checked={formData.pimples === "no"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      No
                    </label>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Darkening of skin (neck, armpits)?
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="skinDarkening"
                        value="yes"
                        checked={formData.skinDarkening === "yes"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="skinDarkening"
                        value="no"
                        checked={formData.skinDarkening === "no"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      No
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-health-100 pt-6">
              <h2 className="text-xl font-medium mb-4">Lifestyle Factors</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Do you exercise regularly?
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="regExercise"
                        value="yes"
                        checked={formData.regExercise === "yes"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="regExercise"
                        value="no"
                        checked={formData.regExercise === "no"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      No
                    </label>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Frequent fast food consumption?
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="fastFood"
                        value="yes"
                        checked={formData.fastFood === "yes"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="fastFood"
                        value="no"
                        checked={formData.fastFood === "no"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      No
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                className="btn-primary w-full max-w-xs flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Calculate Risk"
                )}
              </button>
            </div>
          </form>
        </GlassCard>
      ) : (
        <div className="max-w-3xl mx-auto">
          <GlassCard className="mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Your PCOS Risk Assessment</h2>
              <p className="text-muted-foreground text-sm">
                Based on the information you provided, our algorithm has calculated your risk profile.
              </p>
            </div>
            
            <div className="flex flex-col items-center mb-8">
              <div className="relative w-48 h-48 mb-4">
                <div className="w-full h-full rounded-full bg-health-100 flex items-center justify-center">
                  <div 
                    className={cn(
                      "text-4xl font-bold",
                      getRiskLevel(result.risk).color
                    )}
                  >
                    {result.risk}%
                  </div>
                </div>
                <svg 
                  className="absolute top-0 left-0" 
                  width="192" 
                  height="192" 
                  viewBox="0 0 192 192"
                >
                  <circle
                    cx="96"
                    cy="96"
                    r="85"
                    fill="none"
                    stroke="#f5f5f5"
                    strokeWidth="12"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="85"
                    fill="none"
                    stroke={result.risk < 30 ? "#10b981" : result.risk < 60 ? "#f59e0b" : "#ef4444"}
                    strokeWidth="12"
                    strokeDasharray={`${result.risk * 5.34} 534`}
                    transform="rotate(-90 96 96)"
                  />
                </svg>
              </div>
              <div className="text-center">
                <h3 className={cn(
                  "text-xl font-semibold mb-1",
                  getRiskLevel(result.risk).color
                )}>
                  {getRiskLevel(result.risk).level} Risk
                </h3>
                <p className="text-muted-foreground text-sm">
                  This assessment is based on the information you provided
                </p>
              </div>
            </div>
            
            <div className="border-t border-health-100 pt-6">
              <h3 className="text-lg font-medium mb-4">Key Factors Influencing Your Risk:</h3>
              
              <div className="space-y-4">
                {result.factors && result.factors.map((factor: any, index: number) => (
                  <div key={index} className="bg-health-50 p-4 rounded-lg">
                    <h4 className="font-medium flex items-center">
                      {factor.impact === 'high' ? (
                        <AlertTriangle className="w-4 h-4 text-amber-500 mr-2" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      )}
                      {factor.name}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {factor.suggestion}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-8 border-t border-health-100 pt-6">
              <div className="bg-blue-50 text-blue-800 p-4 rounded-lg mb-6">
                <p className="text-sm flex items-start">
                  <Info className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span>
                    This risk assessment is an estimate only. PCOS diagnosis requires clinical evaluation
                    and lab tests. Please discuss these results with your healthcare provider.
                  </span>
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={resetForm}
                  className="btn-secondary"
                >
                  Start New Assessment
                </button>
                <Link to="/recommendations" className="btn-primary">
                  Get Health Recommendations
                </Link>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default PCOSPredictor;
