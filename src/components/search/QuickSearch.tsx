
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const QuickSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const recentSearches = [
    "ABC Corporation",
    "123 Main Street",
    "PAN ABCDE1234F",
    "CIN L12345MH2000PLC123456",
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In a real app, we would dispatch the search action here
      // For now, just navigate to the results page
      navigate(`/results?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <input
            type="text"
            className="search-input pl-12"
            placeholder="Search by name, company, property, registration number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            size={20}
          />
        </div>
        
        <Button
          type="submit"
          className="mt-4 search-button w-full md:w-auto"
        >
          Search Across All Databases
        </Button>
      </form>

      {recentSearches.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Recent searches:</span>
            {recentSearches.map((search, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-muted"
                onClick={() => {
                  setSearchQuery(search);
                  navigate(`/results?q=${encodeURIComponent(search)}`);
                }}
              >
                {search}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button
          variant="outline"
          className="border-navy-300 hover:bg-navy-50"
          onClick={() => navigate("/search/entity")}
        >
          Entity Search
        </Button>
        <Button
          variant="outline"
          className="border-navy-300 hover:bg-navy-50"
          onClick={() => navigate("/search/property")}
        >
          Property Search
        </Button>
        <Button
          variant="outline"
          className="border-navy-300 hover:bg-navy-50"
          onClick={() => navigate("/search/transaction")}
        >
          Transaction Search
        </Button>
        <Button
          variant="outline"
          className="border-navy-300 hover:bg-navy-50"
          onClick={() => navigate("/search/document")}
        >
          Document Search
        </Button>
      </div>
    </div>
  );
};

export default QuickSearch;
