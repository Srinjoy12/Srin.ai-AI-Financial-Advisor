'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";

export default function QuestionnairePage() {
  const [user, setUser] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    status: '',
    salary: '',
    goal: '',
    goalPrice: '',
    goalYear: '',
    hasInvestments: '',
  });
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setUser(user);
      }
    };
    getUser();
  }, [router]);

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from('users')
        .update({
          name: formData.status, // Using status as a placeholder for name
          salary: parseFloat(formData.salary),
          // You'll need to create tables for goals and investments
          // and link them to the user.
        }, { returning: 'minimal' })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating user data:', error);
      } else {
        router.push('/dashboard');
      }
    }
  };

  const steps = [
    { title: "Status", description: "Tell us about yourself" },
    { title: "Income", description: "Your monthly earnings" },
    { title: "Goals", description: "What you want to achieve" },
    { title: "Budget", description: "Goal price estimation" },
    { title: "Timeline", description: "When to achieve it" },
    { title: "Investments", description: "Current portfolio status" }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-medium bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Your Financial Profile
            </h1>
            <span className="text-gray-400 text-sm">{step}/6</span>
          </div>
          <div className="w-full bg-black/30 rounded-full h-2 border border-white/10">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 6) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((s, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  index + 1 < step 
                    ? 'bg-blue-500 text-white' 
                    : index + 1 === step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white/10 text-gray-400'
                }`}>
                  {index + 1 < step ? <CheckCircle className="w-4 h-4" /> : index + 1}
                </div>
                <span className="text-xs text-gray-400 mt-1 hidden sm:block">{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Card */}
        <Card className="bg-black/30 border border-white/10 backdrop-blur-md">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl text-center text-white">
              {steps[step - 1].title}
            </CardTitle>
            <p className="text-center text-gray-400">
              {steps[step - 1].description}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-white text-lg mb-3 block">
                    Are you a working individual, student, or senior citizen?
                  </Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger className="bg-black/50 border border-white/20 text-white placeholder-gray-400 focus:border-blue-500">
                      <SelectValue placeholder="Select your status" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border border-white/20">
                      <SelectItem value="working" className="text-white hover:bg-blue-500/20">Working Individual</SelectItem>
                      <SelectItem value="student" className="text-white hover:bg-blue-500/20">Student</SelectItem>
                      <SelectItem value="senior" className="text-white hover:bg-blue-500/20">Senior Citizen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleNextStep} 
                  disabled={!formData.status}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="salary" className="text-white text-lg mb-3 block">
                    What is your monthly salary?
                  </Label>
                  <Input 
                    id="salary" 
                    type="number" 
                    value={formData.salary} 
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    className="bg-black/50 border border-white/20 text-white placeholder-gray-400 focus:border-blue-500"
                    placeholder="Enter your monthly salary in ₹"
                  />
                </div>
                <div className="flex justify-between gap-4">
                  <Button 
                    onClick={handlePreviousStep} 
                    variant="outline" 
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                  >
                    <ChevronLeft className="mr-2 w-4 h-4" /> Previous
                  </Button>
                  <Button 
                    onClick={handleNextStep} 
                    disabled={!formData.salary}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="goal" className="text-white text-lg mb-3 block">
                    What is your financial goal?
                  </Label>
                  <Input 
                    id="goal" 
                    type="text" 
                    value={formData.goal} 
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    className="bg-black/50 border border-white/20 text-white placeholder-gray-400 focus:border-blue-500"
                    placeholder="e.g., Buy a house, Start a business, Save for retirement"
                  />
                </div>
                <div className="flex justify-between gap-4">
                  <Button 
                    onClick={handlePreviousStep} 
                    variant="outline" 
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                  >
                    <ChevronLeft className="mr-2 w-4 h-4" /> Previous
                  </Button>
                  <Button 
                    onClick={handleNextStep} 
                    disabled={!formData.goal}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="goalPrice" className="text-white text-lg mb-3 block">
                    What is the estimated price of your goal?
                  </Label>
                  <Input 
                    id="goalPrice" 
                    type="number" 
                    value={formData.goalPrice} 
                    onChange={(e) => setFormData({ ...formData, goalPrice: e.target.value })}
                    className="bg-black/50 border border-white/20 text-white placeholder-gray-400 focus:border-blue-500"
                    placeholder="Enter the estimated cost in ₹"
                  />
                </div>
                <div className="flex justify-between gap-4">
                  <Button 
                    onClick={handlePreviousStep} 
                    variant="outline" 
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                  >
                    <ChevronLeft className="mr-2 w-4 h-4" /> Previous
                  </Button>
                  <Button 
                    onClick={handleNextStep} 
                    disabled={!formData.goalPrice}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="goalYear" className="text-white text-lg mb-3 block">
                    In which year do you want to achieve your goal?
                  </Label>
                  <Input 
                    id="goalYear" 
                    type="number" 
                    value={formData.goalYear} 
                    onChange={(e) => setFormData({ ...formData, goalYear: e.target.value })}
                    className="bg-black/50 border border-white/20 text-white placeholder-gray-400 focus:border-blue-500"
                    placeholder="e.g., 2025, 2030"
                  />
                </div>
                <div className="flex justify-between gap-4">
                  <Button 
                    onClick={handlePreviousStep} 
                    variant="outline" 
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                  >
                    <ChevronLeft className="mr-2 w-4 h-4" /> Previous
                  </Button>
                  <Button 
                    onClick={handleNextStep} 
                    disabled={!formData.goalYear}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-white text-lg mb-3 block">
                    Do you have any existing investments or a stock portfolio?
                  </Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, hasInvestments: value })}>
                    <SelectTrigger className="bg-black/50 border border-white/20 text-white placeholder-gray-400 focus:border-blue-500">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border border-white/20">
                      <SelectItem value="yes" className="text-white hover:bg-blue-500/20">Yes</SelectItem>
                      <SelectItem value="no" className="text-white hover:bg-blue-500/20">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-between gap-4">
                  <Button 
                    onClick={handlePreviousStep} 
                    variant="outline" 
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                  >
                    <ChevronLeft className="mr-2 w-4 h-4" /> Previous
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={!formData.hasInvestments}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Complete Setup
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 