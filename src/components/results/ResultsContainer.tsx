import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchSearchResults } from "@/api";
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

const sourceOptions = ["MCA", "CERSAI", "DORIS"];
const typeOptions = ["entity", "property", "transaction", "document"];
const dateOptions = ["last-month", "last-quarter", "last-year", "custom"];

const ResultsContainer = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const type = searchParams.get("type") || "all";

  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [filtersApplied, setFiltersApplied] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchSearchResults(query, activeTab)
      .then(setResults)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [query, activeTab]);

  // Checkbox handlers
  const handleSourceChange = (source: string) => {
    setSelectedSources((prev) =>
      prev.includes(source) ? prev.filter((s) => s !== source) : [...prev, source]
    );
  };
  const handleTypeChange = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };
  const handleDateChange = (date: string) => {
    setSelectedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
  };

  // Date filter logic (simple demo, can be improved)
  function filterByDate(result: any) {
    if (selectedDates.length === 0) return true;
    if (!result.date) return false;
    const dateStr = result.date.match(/\d{1,2} \w{3} \d{4}/)?.[0];
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const now = new Date();
    for (const d of selectedDates) {
      if (d === "last-month") {
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        if (date > lastMonth) return true;
      } else if (d === "last-quarter") {
        const lastQuarter = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        if (date > lastQuarter) return true;
      } else if (d === "last-year") {
        const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        if (date > lastYear) return true;
      } else if (d === "custom") {
        // Custom range logic can be added here
        return true;
      }
    }
    return false;
  }

  // Apply filters
  const applyFilters = () => {
    setFiltersApplied(true);
  };

  // Filtered results
  const filteredResults = results.filter((result) => {
    if (!filtersApplied) return true;
    const sourceMatch = selectedSources.length === 0 || selectedSources.includes(result.source);
    const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(result.type);
    const dateMatch = filterByDate(result);
    return sourceMatch && typeMatch && dateMatch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-navy-800">Search Results</h2>
        <p className="text-muted-foreground">
          {query ? `Showing results for "${query}"` : `Showing ${type} search results`} • {filteredResults.length} results found
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
                {sourceOptions.map((source) => (
                  <div className="flex items-center space-x-2" key={source}>
                    <Checkbox id={source.toLowerCase()} checked={selectedSources.includes(source)} onCheckedChange={() => handleSourceChange(source)} />
                    <Label htmlFor={source.toLowerCase()}>{source}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />
            
            {/* Type filter */}
            <div>
              <h4 className="font-medium mb-3">Result Type</h4>
              <div className="space-y-2">
                {typeOptions.map((type) => (
                  <div className="flex items-center space-x-2" key={type}>
                    <Checkbox id={type} checked={selectedTypes.includes(type)} onCheckedChange={() => handleTypeChange(type)} />
                    <Label htmlFor={type}>{type.charAt(0).toUpperCase() + type.slice(1)}s</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />
            
            {/* Date filter */}
            <div>
              <h4 className="font-medium mb-3">Last Updated</h4>
              <div className="space-y-2">
                {dateOptions.map((date) => (
                  <div className="flex items-center space-x-2" key={date}>
                    <Checkbox id={date} checked={selectedDates.includes(date)} onCheckedChange={() => handleDateChange(date)} />
                    <Label htmlFor={date}>
                      {date === "last-month" && "Last month"}
                      {date === "last-quarter" && "Last 3 months"}
                      {date === "last-year" && "Last year"}
                      {date === "custom" && "Custom range"}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-2">
              <Button variant="outline" className="w-full" onClick={applyFilters}>Apply Filters</Button>
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
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">{error}</div>
              ) : (
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
                  
                  {filteredResults.length === 0 && !loading && !error && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No results found. Try adjusting your filters.</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResultsContainer;
