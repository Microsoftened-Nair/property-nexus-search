
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Textarea } from "@/components/ui/textarea";

const TransactionSearch = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    transactionId: "",
    partyName: "",
    transactionType: "",
    dateRange: "",
    amount: "",
    description: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would dispatch the search action here
    // For now, just navigate to the results page
    navigate("/results?type=transaction");
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-navy-800">Transaction-Based Search</CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="transactionId">Transaction ID/Reference Number</Label>
              <Input
                id="transactionId"
                name="transactionId"
                placeholder="Enter transaction ID"
                value={formData.transactionId}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="partyName">Party Name</Label>
              <Input
                id="partyName"
                name="partyName"
                placeholder="Enter party name"
                value={formData.partyName}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="transactionType">Transaction Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="sale">Sale Deed</SelectItem>
                    <SelectItem value="mortgage">Mortgage</SelectItem>
                    <SelectItem value="lease">Lease Agreement</SelectItem>
                    <SelectItem value="gift">Gift Deed</SelectItem>
                    <SelectItem value="partition">Partition Deed</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Transaction Amount Range</Label>
              <Input
                id="amount"
                name="amount"
                placeholder="E.g., 100000-500000"
                value={formData.amount}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Transaction Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter any additional transaction details"
                className="resize-none h-20"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end">
            <Button type="submit" className="bg-navy-800 hover:bg-navy-700">
              Search
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransactionSearch;
