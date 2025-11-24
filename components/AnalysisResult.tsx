import React, { useState } from 'react';
import { RoomAnalysis, ActionStep, ProductSuggestion } from '../types';
import { CheckCircle2, Clock, AlertTriangle, Box, ArrowRight, Quote } from 'lucide-react';

interface AnalysisResultProps {
  analysis: RoomAnalysis;
  onReset: () => void;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis, onReset }) => {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (index: number) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
    }
    setCompletedSteps(newCompleted);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getClutterColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'High': return 'text-orange-600';
      case 'Extreme': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const calculateProgress = () => {
    if (analysis.actionableSteps.length === 0) return 0;
    return Math.round((completedSteps.size / analysis.actionableSteps.length) * 100);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      
      {/* Summary Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{analysis.roomType}</h2>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-500">Clutter Level:</span>
              <span className={`font-semibold ${getClutterColor(analysis.clutterLevel)}`}>{analysis.clutterLevel}</span>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex items-center bg-primary-50 px-4 py-2 rounded-full">
            <Quote className="w-4 h-4 text-primary-600 mr-2" />
            <p className="text-xs md:text-sm font-medium text-primary-800 italic">"{analysis.motivationalQuote}"</p>
          </div>
        </div>
        <p className="text-gray-600 leading-relaxed text-lg">
          {analysis.summary}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Action List (Left 2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <CheckCircle2 className="w-5 h-5 mr-2 text-primary-600" />
              Action Plan
            </h3>
            <span className="text-sm font-medium text-gray-500">{calculateProgress()}% Complete</span>
          </div>
          
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className="bg-primary-500 h-2 rounded-full transition-all duration-500" style={{ width: `${calculateProgress()}%` }}></div>
          </div>

          <div className="space-y-4">
            {analysis.actionableSteps.map((step, index) => (
              <div 
                key={index}
                className={`group relative bg-white border rounded-xl p-5 transition-all duration-200 hover:shadow-md ${
                  completedSteps.has(index) ? 'border-primary-200 bg-primary-50/30' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleStep(index)}
                    className={`flex-shrink-0 mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      completedSteps.has(index) 
                        ? 'bg-primary-500 border-primary-500 text-white' 
                        : 'border-gray-300 text-transparent hover:border-primary-400'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4 className={`font-semibold text-lg ${completedSteps.has(index) ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                        {step.title}
                      </h4>
                      <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${getPriorityColor(step.priority)}`}>
                        {step.priority} Priority
                      </span>
                    </div>
                    <p className={`text-gray-600 mb-3 ${completedSteps.has(index) ? 'opacity-50' : ''}`}>
                      {step.description}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{step.estimatedTimeMinutes} mins</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Recommendations (Right 1/3) */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <Box className="w-5 h-5 mr-2 text-blue-600" />
            Suggested Products
          </h3>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {analysis.storageSolutions.map((item, index) => (
              <div key={index} className="p-5 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {item.category}
                  </span>
                </div>
                <h4 className="font-bold text-gray-900 mb-1">{item.item}</h4>
                <p className="text-sm text-gray-600 mb-3">{item.usage}</p>
                <button className="text-sm font-medium text-primary-600 hover:text-primary-700 inline-flex items-center">
                  Search similar <ArrowRight className="w-3 h-3 ml-1" />
                </button>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-2xl p-6 text-white text-center">
            <h4 className="font-bold text-lg mb-2">Feeling Overwhelmed?</h4>
            <p className="text-secondary-200 text-sm mb-4">Start with the smallest task. Progress is progress, no matter how small.</p>
            <button 
              onClick={onReset}
              className="w-full bg-white text-secondary-900 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm"
            >
              Analyze Another Room
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
