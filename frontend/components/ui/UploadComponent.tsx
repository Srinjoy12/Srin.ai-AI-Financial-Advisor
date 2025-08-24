'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { UploadCloud, FileText, DollarSign } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function UploadComponent() {
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUploading(true);
    setMessage('');
    
    const formData = new FormData(event.currentTarget);

    try {
      // Get the current user's session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setMessage('Please log in to upload documents.');
        return;
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: formData,
      });

      const result = await response.json();
      
      if (result.success) {
        setMessage(result.message);
        // You can store the analysis data in state or context for display
        console.log('Analysis data:', result.data);
      } else {
        setMessage(result.message || 'Upload failed. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred while uploading. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-medium text-white mb-2">Upload Documents</h1>
        <p className="text-gray-400">Upload your financial documents for AI analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Form */}
        <Card className="bg-black/30 border border-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-blue-400" />
              Upload Your Financial Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bank-statement" className="text-white text-sm font-medium flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-blue-400" />
                    Bank Statement (CSV, PDF)
                  </Label>
                  <Input 
                    id="bank-statement" 
                    name="bank-statement" 
                    type="file" 
                    accept=".pdf,.csv"
                    className="bg-black/50 border border-white/20 text-white placeholder-gray-400 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  />
                </div>
                <div>
                  <Label htmlFor="salary-slip" className="text-white text-sm font-medium flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-blue-400" />
                    Salary Slip
                  </Label>
                  <Input 
                    id="salary-slip" 
                    name="salary-slip" 
                    type="file" 
                    accept=".pdf,.csv"
                    className="bg-black/50 border border-white/20 text-white placeholder-gray-400 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                disabled={isUploading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing Documents...
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4 mr-2" />
                    Analyze Documents
                  </>
                )}
              </Button>
            </form>
            {message && (
              <div className={`mt-4 p-3 rounded-lg ${
                message.includes('successfully') 
                  ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
                  : 'bg-red-500/20 border border-red-500/30 text-red-400'
              }`}>
                {message}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Information Panel */}
        <Card className="bg-black/30 border border-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl text-white">Document Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <FileText className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Bank Statement Analysis</h3>
                  <p className="text-gray-400 text-sm">Extract spending patterns, income sources, and financial insights from your bank statements.</p>
                </div>
              </div>
              
                             <div className="flex items-start gap-3">
                 <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                   <DollarSign className="w-4 h-4 text-green-400" />
                 </div>
                 <div>
                   <h3 className="text-white font-medium">Salary Analysis</h3>
                   <p className="text-gray-400 text-sm">Understand your income structure and optimize your financial planning in ₹.</p>
                 </div>
               </div>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-6">
              <h4 className="text-blue-400 font-medium mb-2">What happens next?</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• AI analyzes your financial patterns</li>
                <li>• Generates personalized recommendations</li>
                <li>• Updates your dashboard with insights</li>
                <li>• Provides investment and savings advice</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 