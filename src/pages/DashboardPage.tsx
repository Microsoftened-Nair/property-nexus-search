
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Search, Filter } from "lucide-react";

const DashboardPage = () => {
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
            <p className="text-3xl font-bold">12</p>
            <p className="text-sm text-muted-foreground">
              in the last 7 days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Saved Results</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">8</p>
            <p className="text-sm text-muted-foreground">
              across all categories
            </p>
          </CardContent>
        </Card>
        
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
          <TabsTrigger value="saved">Saved Items</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent" className="pt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Your Recent Search Activity</CardTitle>
                <Button variant="outline" size="sm">
                  <Filter size={14} className="mr-1" /> Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((idx) => (
                  <Card key={idx} className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <Search size={16} className="text-muted-foreground" />
                            <h4 className="font-medium">
                              {idx % 2 === 0 
                                ? "Entity Search" 
                                : idx % 3 === 0 
                                  ? "Property Search" 
                                  : "Document Search"
                              }
                            </h4>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {idx % 2 === 0 
                              ? "ABC Corporation, CIN: L12345MH2000PLC123456" 
                              : idx % 3 === 0 
                                ? "Property in Mumbai, Registration #: PROP12345" 
                                : "Sale Deed, Document #: DOC45678"
                            }
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            {`${idx} ${idx === 1 ? 'hour' : 'hours'} ago`}
                          </p>
                          <Button variant="link" size="sm" className="h-6 px-0">
                            Run again
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
