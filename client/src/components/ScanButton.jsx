// src/components/ScanButton.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Scan, Loader2 } from "lucide-react";

export function ScanButton({ onClick, isLoading, disabled }) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || isLoading}
      size="lg"
      className="px-8 py-3 text-lg"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          <Scan className="mr-2 h-5 w-5" />
          Scan Resume
        </>
      )}
    </Button>
  );
}
