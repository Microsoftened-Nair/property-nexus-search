import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Download, Printer, Share } from "lucide-react";
// @ts-ignore
import html2pdf from "html2pdf.js/dist/html2pdf.min.js";

const DetailPage = () => {
  const { type, id } = useParams();
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!type || !id) return;
    setLoading(true);
    setError(null);
    let url = "";
    switch (type) {
      case "entity":
        url = `/api/entities/${id}`;
        break;
      case "property":
        url = `/api/properties/${id}`;
        break;
      case "transaction":
        url = `/api/transactions/${id}`;
        break;
      case "document":
        url = `/api/documents/${id}`;
        break;
      default:
        setError("Invalid type");
        setLoading(false);
        return;
    }
    // Fix: Use full backend URL if running in browser (Vite dev server)
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      url = `http://localhost:5000${url}`;
    }
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => setDetail(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [type, id]);

  const handleExport = () => {
    const element = document.getElementById("detail-content");
    if (element) {
      // html2pdf is a default export when imported from dist
      html2pdf().from(element).save(`${type || "detail"}_${detail.id}.pdf`);
    }
  };

  const handlePrint = () => {
    const element = document.getElementById("detail-content");
    if (element) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`<html><head><title>Print</title></head><body>${element.innerHTML}</body></html>`);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          text: `Check out this detail page:`,
          url,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-lg">Loading...</div>
    );
  }
  if (error || !detail) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Detail Not Found</h2>
            <p className="text-muted-foreground mb-6">
              {error || "The requested detail could not be found."}
            </p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render the specific detail page based on type
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-navy-800">
              {type === "entity" && detail.name}
              {type === "property" && "Property Details"}
              {type === "transaction" && `${detail.type} Transaction`}
              {type === "document" && detail.title}
            </h1>
            <p className="text-muted-foreground">
              {type === "entity" && `CIN: ${detail.cin}`}
              {type === "property" && `Registration #: ${detail.registrationNumber}`}
              {type === "transaction" && `Registration #: ${detail.registrationNumber}`}
              {type === "document" && `Document #: ${detail.number}`}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download size={16} className="mr-1" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer size={16} className="mr-1" />
              Print
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share size={16} className="mr-1" />
              Share
            </Button>
          </div>
        </div>
      </div>
      <div id="detail-content">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              {type === "entity" && (
                <>
                  <CardHeader>
                    <CardTitle className="text-navy-800">Entity Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="overview">
                      <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="directors">Directors</TabsTrigger>
                        <TabsTrigger value="filings">Filings</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="overview" className="pt-4">
                        {/* ENTITY: map backend fields */}
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <dt className="text-sm text-muted-foreground">Name</dt>
                            <dd>{detail.name}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">Type</dt>
                            <dd>{detail.type}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">CIN</dt>
                            <dd>{detail.cin || '-'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">PAN</dt>
                            <dd>{detail.pan || '-'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">Registration Number</dt>
                            <dd>{detail.registration_number || '-'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">ID Type</dt>
                            <dd>{detail.id_type || '-'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">Identification Number</dt>
                            <dd>{detail.identification_number || '-'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">Director Details</dt>
                            <dd>{detail.director_details || '-'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">Company Status</dt>
                            <dd>{detail.company_status || '-'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">Address</dt>
                            <dd>{detail.address || '-'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">Contact Info</dt>
                            <dd>{detail.contact_info || '-'}</dd>
                          </div>
                        </dl>
                      </TabsContent>
                      
                      <TabsContent value="directors" className="pt-4">
                        <div className="space-y-4">
                          {detail.directors?.map((director, index) => (
                            <Card key={index}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">{director.name}</h4>
                                    <p className="text-sm text-muted-foreground">DIN: {director.din}</p>
                                  </div>
                                  <Badge>{director.designation}</Badge>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="filings" className="pt-4">
                        <div className="space-y-4">
                          {detail.filings?.map((filing, index) => (
                            <Card key={index}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">{filing.document}</h4>
                                    <p className="text-sm text-muted-foreground">Financial Year: {filing.year}</p>
                                  </div>
                                  <div className="text-right">
                                    <Badge className="bg-green-100 text-green-800 border-green-200">
                                      {filing.status}
                                    </Badge>
                                    <p className="text-xs text-muted-foreground mt-1">{filing.date}</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </>
              )}
              
              {type === "property" && (
                <>
                  <CardHeader>
                    <CardTitle className="text-navy-800">Property Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="overview">
                      <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="ownership">Ownership History</TabsTrigger>
                        <TabsTrigger value="encumbrances">Encumbrances</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="overview" className="pt-4">
                        {/* PROPERTY: map backend fields */}
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <dt className="text-sm text-muted-foreground">Address</dt>
                            <dd>{detail.address}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">City</dt>
                            <dd>{detail.city || '-'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">State</dt>
                            <dd>{detail.state || '-'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">Pincode</dt>
                            <dd>{detail.pincode || '-'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">Type</dt>
                            <dd>{detail.property_type || '-'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">Registration Number</dt>
                            <dd>{detail.registration_number || '-'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">Survey/Khasra Number</dt>
                            <dd>{detail.survey_number || '-'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">District</dt>
                            <dd>{detail.district || '-'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">Owner</dt>
                            <dd>{detail.owner_name || '-'}</dd>
                          </div>
                        </dl>
                      </TabsContent>
                      
                      <TabsContent value="ownership" className="pt-4">
                        <div className="space-y-4">
                          {detail.previousOwners?.map((owner, index) => (
                            <Card key={index}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">{owner.name}</h4>
                                  </div>
                                  <Badge variant="outline">{owner.period}</Badge>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="encumbrances" className="pt-4">
                        <div className="space-y-4">
                          {detail.encumbrances?.map((encumbrance, index) => (
                            <Card key={index}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">{encumbrance.type}</h4>
                                    <p className="text-sm text-muted-foreground">In favor of: {encumbrance.holder}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">{encumbrance.amount}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{encumbrance.date}</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </>
              )}
              
              {type === "transaction" && (
                <>
                  <CardHeader>
                    <CardTitle className="text-navy-800">Transaction Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="overview">
                      <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="property">Property</TabsTrigger>
                        <TabsTrigger value="documents">Documents</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="overview" className="pt-4">
                        {/* TRANSACTION: map backend fields */}
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <dt className="text-sm text-muted-foreground">Type</dt>
                            <dd>{detail.type}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">Amount</dt>
                            <dd>{detail.amount || '-'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">Date</dt>
                            <dd>{detail.date ? new Date(detail.date).toLocaleDateString() : '-'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">Description</dt>
                            <dd>{detail.description || '-'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">Party Name</dt>
                            <dd>{detail.party_name || detail.entity_name || '-'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">Property Address</dt>
                            <dd>{detail.property_address || '-'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">Property City</dt>
                            <dd>{detail.property_city || '-'}</dd>
                          </div>
                        </dl>
                      </TabsContent>
                      
                      <TabsContent value="property" className="pt-4">
                        <Card>
                          <CardContent className="p-4">
                            <dl className="space-y-2">
                              <div>
                                <dt className="text-sm text-muted-foreground">Address</dt>
                                <dd>{detail.property?.address || '-'}</dd>
                              </div>
                              <div>
                                <dt className="text-sm text-muted-foreground">Type</dt>
                                <dd>{detail.property?.type || '-'}</dd>
                              </div>
                              <div>
                                <dt className="text-sm text-muted-foreground">Area</dt>
                                <dd>{detail.property?.area || '-'}</dd>
                              </div>
                            </dl>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      
                      <TabsContent value="documents" className="pt-4">
                        <div className="space-y-4">
                          {detail.documents?.map((document, index) => (
                            <Card key={index}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">{document.name}</h4>
                                    <p className="text-sm text-muted-foreground">Number: {document.number}</p>
                                  </div>
                                  <p className="text-xs text-muted-foreground">{document.date}</p>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </>
              )}
              
              {type === "document" && (
                <>
                  <CardHeader>
                    <CardTitle className="text-navy-800">Document Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="overview">
                      <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="property">Property</TabsTrigger>
                        <TabsTrigger value="parties">Parties</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="overview" className="pt-4">
                        {/* DOCUMENT: map backend fields */}
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <dt className="text-sm text-muted-foreground">Document Title</dt>
                            <dd>{detail.title}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">Document Number</dt>
                            <dd>{detail.number}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">Execution Date</dt>
                            <dd>{detail.executionDate}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">Registration Date</dt>
                            <dd>{detail.registrationDate}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">Consideration</dt>
                            <dd>{detail.consideration}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">Stamp Duty</dt>
                            <dd>{detail.stampDuty}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">Registration Fee</dt>
                            <dd>{detail.registrationFee}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">Registration Office</dt>
                            <dd>{detail.registration_office || '-'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">Filed By</dt>
                            <dd>{detail.filed_by || detail.entity_name || '-'}</dd>
                          </div>
                        </dl>
                      </TabsContent>
                      
                      <TabsContent value="property" className="pt-4">
                        <Card>
                          <CardContent className="p-4">
                            <dl className="space-y-2">
                              <div>
                                <dt className="text-sm text-muted-foreground">Address</dt>
                                <dd>{detail.property?.address || '-'}</dd>
                              </div>
                              <div>
                                <dt className="text-sm text-muted-foreground">Type</dt>
                                <dd>{detail.property?.type || '-'}</dd>
                              </div>
                              <div>
                                <dt className="text-sm text-muted-foreground">Area</dt>
                                <dd>{detail.property?.area || '-'}</dd>
                              </div>
                            </dl>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      
                      <TabsContent value="parties" className="pt-4">
                        <div className="space-y-4">
                          <Card>
                            <CardContent className="p-4">
                              <h4 className="font-medium mb-2">Seller / Executant</h4>
                              <p>{detail.parties?.seller || '-'}</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4">
                              <h4 className="font-medium mb-2">Buyer / Claimant</h4>
                              <p>{detail.parties?.buyer || '-'}</p>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </>
              )}
            </Card>
          </div>
          
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Source Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h3 className="text-md font-medium mb-2">Data Source</h3>
                  <Badge
                    variant="outline"
                    className={`
                      ${detail.source === "MCA" ? "bg-blue-100 text-blue-800 border-blue-200" : ""}
                      ${detail.source === "CERSAI" ? "bg-green-100 text-green-800 border-green-200" : ""}
                      ${detail.source === "DORIS" ? "bg-purple-100 text-purple-800 border-purple-200" : ""}
                    `}
                  >
                    {detail.source}
                  </Badge>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-md font-medium mb-2">Last Updated</h3>
                  <p className="text-sm">
                    {type === "entity" && "12 March 2025"}
                    {type === "property" && "5 December 2022"}
                    {type === "transaction" && "23 June 2024"}
                    {type === "document" && "20 April 2023"}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-2">Reference ID</h3>
                  <p className="text-sm font-mono bg-muted p-1 rounded">{detail.id}</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Related items card */}
            {/* <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Related Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {type === "entity" && (
                    <>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        View Properties Owned
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        View Director Details
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        View Financial Records
                      </Button>
                    </>
                  )}
                  
                  {type === "property" && (
                    <>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        View Owner Details
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        View Transaction History
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        View Similar Properties
                      </Button>
                    </>
                  )}
                  
                  {type === "transaction" && (
                    <>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        View Borrower Details
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        View Lender Details
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        View Property Details
                      </Button>
                    </>
                  )}
                  
                  {type === "document" && (
                    <>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        View Seller Details
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        View Buyer Details
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        View Property Details
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
