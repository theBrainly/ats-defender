// src/components/ScanButton.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Scan, Loader2 } from "lucide-react";

export /**
 * Active: 2026-01-01
 * Function: ScanButton
 */
/**
 * Active: 2026-01-04
 * Function: ScanButton
 */
function ScanButton({ onClick, isLoading, disabled }) {
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
