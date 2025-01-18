import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Code = () => {
  return (
    <div className="container py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Redeem Code</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            Coming soon! You'll be able to redeem content creator codes here.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Code;