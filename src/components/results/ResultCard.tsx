import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface ResultCardProps {
  type: "entity" | "property" | "transaction" | "document";
  title: string;
  subtitle?: string;
  description: string;
  source: "MCA" | "CERSAI" | "DORIS";
  date?: string;
  id: string;
}

const ResultCard = ({ 
  type, 
  title, 
  subtitle, 
  description, 
  source, 
  date, 
  id 
}: ResultCardProps) => {
  const getSourceColor = (source: string) => {
    switch(source) {
      case "MCA":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "CERSAI":
        return "bg-green-100 text-green-800 border-green-200";
      case "DORIS":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch(type) {
      case "entity":
        return "🏢";
      case "property":
        return "🏠";
      case "transaction":
        return "💸";
      case "document":
        return "📄";
      default:
        return "📋";
    }
  };

  return (
    <Card className="result-card mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl" aria-hidden="true">
                {getTypeIcon(type)}
              </span>
              <h3 className="text-lg font-semibold text-navy-800">{title}</h3>
            </div>
            
            {subtitle && (
              <p className="text-sm text-muted-foreground mb-1">{subtitle}</p>
            )}
            
            <p className="text-sm text-gray-600 mt-2">{description}</p>
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            <Badge variant="outline" className={getSourceColor(source)}>
              {source}
            </Badge>
            
            {date && (
              <span className="text-xs text-muted-foreground">
                {date}
              </span>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 px-4 pb-2 flex justify-end">
        <Link to={`/details/${type}/${id}`}>
          <Button variant="outline" size="sm" className="text-navy-800 hover:bg-gray-500">
            <Eye size={16} className="mr-1" />
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ResultCard;
