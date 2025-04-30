import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CaptchaField from "@/components/common/CaptchaField";
import { useToast } from "@/components/ui/use-toast";

const EntitySearch = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("individual");
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const { toast } = useToast();
  
  const [individualData, setIndividualData] = useState({
    name: "",
    idType: "",
    identificationNumber: "",
    contactInfo: ""
  });

  const [corporateData, setCorporateData] = useState({
    companyName: "",
    cinNumber: "",
    directorDetails: "",
    companyStatus: ""
  });

  const handleIndividualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIndividualData({
      ...individualData,
      [e.target.name]: e.target.value
    });
  };

  const handleCorporateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCorporateData({
      ...corporateData,
      [e.target.name]: e.target.value
    });
  };

  // Add handler for idType select
  const handleIdTypeChange = (value: string) => {
    setIndividualData((prev) => ({ ...prev, idType: value }));
  };
  // Add handler for companyStatus select
  const handleCompanyStatusChange = (value: string) => {
    setCorporateData((prev) => ({ ...prev, companyStatus: value }));
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
    
    // Build query params for advanced search
    let params = new URLSearchParams();
    if (activeTab === "individual") {
      if (individualData.name) params.append("name", individualData.name);
      // ID Type is a select, needs to be tracked in state
      if ((individualData as any).idType) params.append("idType", (individualData as any).idType);
      if (individualData.identificationNumber) params.append("identificationNumber", individualData.identificationNumber);
      if (individualData.contactInfo) params.append("contactInfo", individualData.contactInfo);
    } else if (activeTab === "corporate") {
      if (corporateData.companyName) params.append("companyName", corporateData.companyName);
      if (corporateData.cinNumber) params.append("cinNumber", corporateData.cinNumber);
      if (corporateData.directorDetails) params.append("directorDetails", corporateData.directorDetails);
      // Company status is a select, needs to be tracked in state
      if ((corporateData as any).companyStatus && (corporateData as any).companyStatus !== 'any') params.append("companyStatus", (corporateData as any).companyStatus);
    }
    // Navigate to results with type=entity and all params
    const paramString = params.toString();
    navigate(`/results?type=entity${paramString ? `&${paramString}` : ''}`);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-navy-800">Entity-Based Search</CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="individual" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="individual">Individual Owner</TabsTrigger>
            <TabsTrigger value="corporate">Corporate Entity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="individual">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Person Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter full name"
                    value={individualData.name}
                    onChange={handleIndividualChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="idType">ID Type</Label>
                  <Select value={individualData.idType} onValueChange={handleIdTypeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ID type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="aadhaar">Aadhaar Number</SelectItem>
                        <SelectItem value="pan">PAN Card</SelectItem>
                        <SelectItem value="voter">Voter ID</SelectItem>
                        <SelectItem value="passport">Passport</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="identificationNumber">Identification Number</Label>
                  <Input
                    id="identificationNumber"
                    name="identificationNumber"
                    placeholder="Enter ID number"
                    value={individualData.identificationNumber}
                    onChange={handleIndividualChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactInfo">Contact Information</Label>
                  <Input
                    id="contactInfo"
                    name="contactInfo"
                    placeholder="Phone or email"
                    value={individualData.contactInfo}
                    onChange={handleIndividualChange}
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
          </TabsContent>
          
          <TabsContent value="corporate">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company/LLP Name</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    placeholder="Enter company name"
                    value={corporateData.companyName}
                    onChange={handleCorporateChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cinNumber">CIN/LLPIN Number</Label>
                  <Input
                    id="cinNumber"
                    name="cinNumber"
                    placeholder="Enter CIN/LLPIN number"
                    value={corporateData.cinNumber}
                    onChange={handleCorporateChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="directorDetails">Director Details (DIN/DPIN)</Label>
                  <Input
                    id="directorDetails"
                    name="directorDetails"
                    placeholder="Enter director's DIN/DPIN"
                    value={corporateData.directorDetails}
                    onChange={handleCorporateChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="companyStatus">Company Status</Label>
                  <Select value={corporateData.companyStatus} onValueChange={handleCompanyStatusChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive/Struck Off</SelectItem>
                        <SelectItem value="any">Any</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EntitySearch;
