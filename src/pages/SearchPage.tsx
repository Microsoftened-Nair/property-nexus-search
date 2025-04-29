
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EntitySearch from "@/components/search/EntitySearch";
import PropertySearch from "@/components/search/PropertySearch";
import TransactionSearch from "@/components/search/TransactionSearch";
import DocumentSearch from "@/components/search/DocumentSearch";

const SearchPage = () => {
  const [activeTab, setActiveTab] = useState("entity");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-800">Advanced Search</h1>
        <p className="text-muted-foreground">
          Choose a search category below to begin your advanced search
        </p>
      </div>
      
      <Tabs defaultValue="entity" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full md:w-fit grid grid-cols-2 md:grid-cols-4 mb-8">
          <TabsTrigger value="entity">Entity Search</TabsTrigger>
          <TabsTrigger value="property">Property Search</TabsTrigger>
          <TabsTrigger value="transaction">Transaction Search</TabsTrigger>
          <TabsTrigger value="document">Document Search</TabsTrigger>
        </TabsList>
        
        <TabsContent value="entity">
          <EntitySearch />
        </TabsContent>
        
        <TabsContent value="property">
          <PropertySearch />
        </TabsContent>
        
        <TabsContent value="transaction">
          <TransactionSearch />
        </TabsContent>
        
        <TabsContent value="document">
          <DocumentSearch />
        </TabsContent>
      </Tabs>
      
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-navy-800">Search Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Use specific identification numbers (CIN, PAN, Registration number) when available for more accurate results.</li>
              <li>For property searches, providing the complete address will yield better results.</li>
              <li>Entity searches can be performed using either individual names or company details.</li>
              <li>Use wildcards (*) for partial matches when you're unsure of complete information.</li>
              <li>Results are sourced from multiple government databases and may have varying update frequencies.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SearchPage;
