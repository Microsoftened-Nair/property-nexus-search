
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import QuickSearch from "@/components/search/QuickSearch";

const HomePage = () => {
  // Statistics for the dashboard
  const stats = [
    { label: "Integrated Databases", value: "3" },
    { label: "Searchable Records", value: "50M+" },
    { label: "Daily Searches", value: "10K+" },
  ];

  // Database cards
  const databases = [
    {
      name: "Ministry of Corporate Affairs (MCA)",
      description: "Access company registrations, director information, financial filings, and corporate details.",
      icon: "🏢"
    },
    {
      name: "Central Registry (CERSAI)",
      description: "Search for security interests, charges, and encumbrances registered against properties.",
      icon: "🔐"
    },
    {
      name: "Digital Registry of Properties (DORIS)",
      description: "Find property ownership records, transaction history, and property registration details.",
      icon: "🏠"
    }
  ];

  return (
    <div>
      {/* Hero section with search */}
      <section className="bg-gradient-to-b from-navy-800 to-navy-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Unified Property Search Portal
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-navy-100">
              Search across multiple government databases in a single interface. Find property records, company information, and security interests.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <QuickSearch />
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-navy-700/50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-navy-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-navy-800">
            Integrated Database Access
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {databases.map((db, index) => (
              <Card key={index} className="transition-all hover:shadow-md">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{db.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-navy-800">{db.name}</h3>
                  <p className="text-muted-foreground">{db.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/search">
              <Button size="lg" className="bg-navy-800 hover:bg-navy-700">
                Explore Advanced Search Options
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* How it works section */}
      <section className="bg-muted py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-navy-800">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-2xl font-bold text-navy-800">1</span>
              </div>
              <h3 className="font-medium mb-2">Select Search Category</h3>
              <p className="text-sm text-muted-foreground">Choose from entity, property, transaction, or document search</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-2xl font-bold text-navy-800">2</span>
              </div>
              <h3 className="font-medium mb-2">Enter Search Parameters</h3>
              <p className="text-sm text-muted-foreground">Provide relevant details for your search query</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-2xl font-bold text-navy-800">3</span>
              </div>
              <h3 className="font-medium mb-2">Get Unified Results</h3>
              <p className="text-sm text-muted-foreground">View standardized results from multiple databases</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-2xl font-bold text-navy-800">4</span>
              </div>
              <h3 className="font-medium mb-2">Export or Share</h3>
              <p className="text-sm text-muted-foreground">Download, print, or share search results</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
