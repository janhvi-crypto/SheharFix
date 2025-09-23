import React from 'react';
import { Bot, TrendingUp, MapPin, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface AIAnalysisProps {
  className?: string;
}

const AIIssueAnalyzer: React.FC<AIAnalysisProps> = ({ className }) => {
  const aiAnalysis = {
    priorityFactors: [
      { factor: 'Public Safety Impact', score: 92, weight: 'High', description: 'Affects pedestrian and vehicle safety' },
      { factor: 'Issue Severity', score: 85, weight: 'High', description: 'Deep pothole causing vehicle damage' },
      { factor: 'Location Traffic', score: 78, weight: 'Medium', description: 'High traffic area - MG Road' },
      { factor: 'Citizen Reports', score: 75, weight: 'Medium', description: '15 confirmations from citizens' },
      { factor: 'Weather Impact', score: 60, weight: 'Low', description: 'Monsoon season approaching' },
      { factor: 'Resource Availability', score: 88, weight: 'High', description: 'Road maintenance team available' },
    ],
    recommendations: [
      {
        priority: 'Immediate',
        action: 'Deploy road maintenance team within 4 hours',
        reasoning: 'High safety risk in busy commercial area',
        estimatedCost: '₹25,000',
        timeline: '6-8 hours'
      },
      {
        priority: 'Secondary',
        action: 'Install temporary warning signs',
        reasoning: 'Prevent accidents during repair work',
        estimatedCost: '₹2,000',
        timeline: '1 hour'
      },
      {
        priority: 'Follow-up',
        action: 'Quality inspection and citizen notification',
        reasoning: 'Ensure repair quality and close feedback loop',
        estimatedCost: '₹1,000',
        timeline: '2-3 days post-repair'
      }
    ],
    overallPriority: 'Critical',
    aiConfidence: 94
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'immediate': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'secondary': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'follow-up': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getWeightColor = (weight: string) => {
    switch (weight.toLowerCase()) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-orange-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* AI Analysis Header */}
      <Card className="card-gradient border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-primary" />
            <span>AI Issue Analysis & Prioritization</span>
            <Badge variant="secondary" className="ml-auto">
              {aiAnalysis.aiConfidence}% Confidence
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Overall Priority Assessment</h3>
              <p className="text-sm text-muted-foreground">
                Based on multiple data points and risk factors
              </p>
            </div>
            <Badge className={getPriorityColor(aiAnalysis.overallPriority)}>
              {aiAnalysis.overallPriority} Priority
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Priority Factors Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Priority Factors Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {aiAnalysis.priorityFactors.map((factor, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-sm">{factor.factor}</span>
                  <Badge variant="outline" className={getWeightColor(factor.weight)}>
                    {factor.weight}
                  </Badge>
                </div>
                <span className="text-sm font-semibold">{factor.score}/100</span>
              </div>
              
              <Progress value={factor.score} className="h-2" />
              
              <p className="text-xs text-muted-foreground">
                {factor.description}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>AI-Generated Action Plan</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {aiAnalysis.recommendations.map((rec, index) => (
            <div key={index} className="p-4 border rounded-lg bg-card/50">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Badge className={getPriorityColor(rec.priority)}>
                    {rec.priority}
                  </Badge>
                  <h4 className="font-semibold text-sm">{rec.action}</h4>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <div>{rec.estimatedCost}</div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{rec.timeline}</span>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                <strong>Reasoning:</strong> {rec.reasoning}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Real-time Insights */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Bot className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm">AI Insight</h4>
              <p className="text-xs text-muted-foreground mt-1">
                This issue has been flagged as <strong>high priority</strong> due to its location in a 
                commercial area with heavy pedestrian traffic. Similar issues in this zone have led to 
                3 accident reports in the past month. Immediate action is recommended to prevent 
                potential liability and ensure public safety.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIIssueAnalyzer;
