
import React from "react";
import { Link } from "react-router-dom";
import { Heart, ArrowRight } from "lucide-react";
import GlassCard from "@/components/GlassCard";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-health-100 to-health-50 p-4">
      <GlassCard className="max-w-lg text-center p-8">
        <div className="flex justify-center mb-6">
          <Heart className="h-14 w-14 text-health-500" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-health-800">Welcome to Femmecare</h1>
        <p className="text-xl text-health-700 mb-8">
          Your personal women's health companion for tracking, insights, and support.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/home" className="btn-primary">
            Explore the App
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link to="/pcos-predictor" className="btn-secondary">
            Try PCOS Predictor
          </Link>
        </div>
      </GlassCard>
    </div>
  );
};

export default Index;
