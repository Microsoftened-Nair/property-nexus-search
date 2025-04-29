import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import CaptchaField from "@/components/common/CaptchaField";
import { useToast } from "@/components/ui/use-toast";

const DocumentSearch = () => {
  const navigate = useNavigate();
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    documentId: "",
    documentType: "",
    registrationOffice: "",
    filedBy: "",
    yearFiled: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCaptchaValidated = (isValid: boolean) => {
    setIsCaptchaValid(isValid);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isCaptchaValid) {
      toast({
        variant: "destructive",
        title: "CAPTCHA verification required",
        description: "Please verify the CAPTCHA before searching",
      });
      return;
    }
    
    // In a real app, we would dispatch the search action here
    // For now, just navigate to the results page
    navigate("/results?type=document");
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-navy-800">Document-Based Search</CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="documentId">Document Number</Label>
              <Input
                id="documentId"
                name="documentId"
                placeholder="Enter document ID/number"
                value={formData.documentId}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="documentType">Document Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="deed">Property Deed</SelectItem>
                    <SelectItem value="agreement">Sale Agreement</SelectItem>
                    <SelectItem value="certificate">Ownership Certificate</SelectItem>
                    <SelectItem value="filing">Regulatory Filing</SelectItem>
                    <SelectItem value="notice">Legal Notice</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="registrationOffice">Registration Office</Label>
              <Input
                id="registrationOffice"
                name="registrationOffice"
                placeholder="Enter registration office"
                value={formData.registrationOffice}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="filedBy">Filed By</Label>
              <Input
                id="filedBy"
                name="filedBy"
                placeholder="Name of filing party"
                value={formData.filedBy}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="yearFiled">Year Filed</Label>
              <Input
                id="yearFiled"
                name="yearFiled"
                placeholder="YYYY"
                value={formData.yearFiled}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2 flex items-center">
              <div className="flex items-center space-x-2">
                <Checkbox id="includeExpired" />
                <Label htmlFor="includeExpired" className="text-sm font-normal">
                  Include expired documents
                </Label>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <CaptchaField onValidated={handleCaptchaValidated} />
          </div>
          
          <div className="pt-4 flex justify-end">
            <Button 
              type="submit" 
              className="bg-navy-800 hover:bg-navy-700"
              disabled={!isCaptchaValid}
            >
              Search
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DocumentSearch;
