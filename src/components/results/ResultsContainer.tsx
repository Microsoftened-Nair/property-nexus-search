
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Filter, Search, Grid, List } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import ResultCard from "./ResultCard";

// Mock data for demonstration
const mockResults = [
  {
    id: "1",
    type: "entity",
    title: "ABC Corporation Ltd.",
    subtitle: "CIN: L12345MH2000PLC123456",
    description: "Incorporated on January 15, 2000. Active status with authorized capital of ₹10,00,000.",
    source: "MCA",
    date: "Updated on 12 Mar 2025"
  },
  {
    id: "2",
    type: "property",
    title: "Commercial Property - Mumbai",
    subtitle: "Registration #: PROP12345",
    description: "Commercial property located in Andheri East, Mumbai. Total area 1,500 sq.ft. Registered on December 5, 2022.",
    source: "DORIS",
    date: "Updated on 5 Dec 2022"
  },
  {
    id: "3",
    type: "transaction",
    title: "Mortgage Registration",
    subtitle: "Security Interest ID: SEC98765",
    description: "Mortgage created in favor of XYZ Bank Ltd. on property located at 123, Main Street, Pune.",
    source: "CERSAI",
    date: "Updated on 23 Jun 2024"
  },
  {
    id: "4",
    type: "document",
    title: "Sale Deed",
    subtitle: "Document #: DOC45678",
    description: "Sale deed executed between Mr. John Doe and Ms. Jane Smith for residential property in Bangalore.",
    source: "DORIS",
    date: "Updated on 18 Apr 2023"
  },
  {
    id: "5",
    type: "entity",
    title: "XYZ Enterprises LLP",
    subtitle: "LLPIN: AAA-0000",
    description: "Limited Liability Partnership established in 2019. Active status with 3 partners.",
    source: "MCA",
    date: "Updated on 2 Feb 2025"
  },
];

const ResultsContainer = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const type = searchParams.get("type") || "all";
  
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [activeTab, setActiveTab] = useState<string>("all");
  
  const filteredResults = activeTab === "all" 
    ? mockResults 
    : mockResults.filter(result => result.type === activeTab);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-navy-800">Search Results</h2>
        <p className="text-muted-foreground">
          {query ? `Showing results for "${query}"` : `Showing ${type} search results`} • {mockResults.length} results found
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters sidebar */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Filter size={18} className="mr-2" /> Filters
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-5">
            {/* Search within results */}
            <div>
              <div className="relative mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search within results..." 
                  className="pl-8"
                />
              </div>
            </div>
            
            <Separator />
            
            {/* Source filter */}
            <div>
              <h4 className="font-medium mb-3">Data Source</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="mca" />
                  <Label htmlFor="mca">MCA (3)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="cersai" />
                  <Label htmlFor="cersai">CERSAI (1)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="doris" />
                  <Label htmlFor="doris">DORIS (2)</Label>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Type filter */}
            <div>
              <h4 className="font-medium mb-3">Result Type</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="entity" />
                  <Label htmlFor="entity">Entities (2)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="property" />
                  <Label htmlFor="property">Properties (1)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="transaction" />
                  <Label htmlFor="transaction">Transactions (1)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="document" />
                  <Label htmlFor="document">Documents (1)</Label>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Date filter */}
            <div>
              <h4 className="font-medium mb-3">Last Updated</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="last-month" />
                  <Label htmlFor="last-month">Last month</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="last-quarter" />
                  <Label htmlFor="last-quarter">Last 3 months</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="last-year" />
                  <Label htmlFor="last-year">Last year</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="custom" />
                  <Label htmlFor="custom">Custom range</Label>
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <Button variant="outline" className="w-full">Apply Filters</Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Results container */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">Results</CardTitle>
                  <Badge variant="outline" className="font-normal">
                    {filteredResults.length} items
                  </Badge>
                </div>
                
                <div className="flex space-x-1">
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                    <span className="sr-only">List view</span>
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                    <span className="sr-only">Grid view</span>
                  </Button>
                </div>
              </div>
              
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="entity">Entities</TabsTrigger>
                  <TabsTrigger value="property">Properties</TabsTrigger>
                  <TabsTrigger value="transaction">Transactions</TabsTrigger>
                  <TabsTrigger value="document">Documents</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            
            <CardContent>
              <div className={`${viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-2"}`}>
                {filteredResults.map((result) => (
                  <ResultCard
                    key={result.id}
                    id={result.id}
                    type={result.type as any}
                    title={result.title}
                    subtitle={result.subtitle}
                    description={result.description}
                    source={result.source as any}
                    date={result.date}
                  />
                ))}
                
                {filteredResults.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No results found. Try adjusting your filters.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResultsContainer;
