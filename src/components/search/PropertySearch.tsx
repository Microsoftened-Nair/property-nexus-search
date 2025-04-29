import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CaptchaField from "@/components/common/CaptchaField";
import { useToast } from "@/components/ui/use-toast";

const PropertySearch = () => {
  const navigate = useNavigate();
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    propertyAddress: "",
    registrationNumber: "",
    surveyNumber: "",
    district: "",
    state: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    navigate("/results?type=property");
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-navy-800">Property-Based Search</CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="propertyAddress">Property Address</Label>
              <Textarea
                id="propertyAddress"
                name="propertyAddress"
                placeholder="Enter complete property address"
                className="resize-none h-24"
                value={formData.propertyAddress}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="registrationNumber">Registration Number</Label>
              <Input
                id="registrationNumber"
                name="registrationNumber"
                placeholder="Property registration number"
                value={formData.registrationNumber}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="surveyNumber">Survey/Khasra Number</Label>
              <Input
                id="surveyNumber"
                name="surveyNumber"
                placeholder="Survey/Khasra number"
                value={formData.surveyNumber}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="karnataka">Karnataka</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                    <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="district">District</Label>
              <Input
                id="district"
                name="district"
                placeholder="Enter district"
                value={formData.district}
                onChange={handleChange}
              />
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

export default PropertySearch;
