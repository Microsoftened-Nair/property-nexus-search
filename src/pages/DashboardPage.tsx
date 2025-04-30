import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Search, Filter } from "lucide-react";
import { fetchRecentSearches } from "@/services/dashboard";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const [recentSearches, setRecentSearches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchRecentSearches(5)
      .then(setRecentSearches)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Helper to build a search URL from a recent search
  function getSearchUrl(search: any) {
    if (!search) return "/results";
    // If query is a string, treat as general search
    if (typeof search.query === "string") {
      return `/results?q=${encodeURIComponent(search.query)}`;
    }
    // If query is an object, try to build a type-specific search
    if (search.type && search.query) {
      // Try to extract a main value for display/search
      const q = search.query.q || search.query.name || search.query.address || search.query.cin || search.query.pan || "";
      return `/results?q=${encodeURIComponent(q)}&type=${encodeURIComponent(search.type)}`;
    }
    return "/results";
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-800">Dashboard</h1>
        <p className="text-muted-foreground">
          View your recent searches and saved items
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recent Searches</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{recentSearches.length}</p>
            <p className="text-sm text-muted-foreground">
              in the last 7 days
            </p>
          </CardContent>
        </Card>
        
        {/* <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Saved Results</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">8</p>
            <p className="text-sm text-muted-foreground">
              across all categories
            </p>
          </CardContent>
        </Card> */}
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Data Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">3</p>
            <p className="text-sm text-muted-foreground">
              MCA, CERSAI, DORIS
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="recent">
        <TabsList>
          <TabsTrigger value="recent">Recent Searches</TabsTrigger>
          {/* <TabsTrigger value="saved">Saved Items</TabsTrigger> */}
          {/* <TabsTrigger value="alerts">Alerts</TabsTrigger> */}
        </TabsList>
        
        <TabsContent value="recent" className="pt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Your Recent Search Activity</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">{error}</div>
              ) : (
                <div className="space-y-4">
                  {recentSearches.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">No recent searches found.</div>
                  )}
                  {recentSearches.map((search) => (
                    <Card key={search.id} className="bg-muted/50">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <Search size={16} className="text-muted-foreground" />
                              <h4 className="font-medium">
                                {search.type ? `${search.type.charAt(0).toUpperCase() + search.type.slice(1)} Search` : "Search"}
                              </h4>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {typeof search.query === "string"
                                ? search.query
                                : JSON.stringify(search.query)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">
                              {search.created_at ? new Date(search.created_at).toLocaleString() : ""}
                            </p>
                            <Button 
                              variant="link" 
                              size="sm" 
                              className="h-6 px-0" 
                              onClick={() => navigate(getSearchUrl(search))}
                            >
                              Run again
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="saved" className="pt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Your Saved Items</CardTitle>
                <Button variant="outline" size="sm">
                  <Download size={14} className="mr-1" /> Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  This functionality is under development. Check back later.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="alerts" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  This functionality is under development. Check back later.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage;
