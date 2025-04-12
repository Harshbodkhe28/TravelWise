import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import PackageComparisonSection from "@/components/packages/package-comparison-section";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link } from "wouter";

export default function PackageComparison() {
  const { preferenceId } = useParams();
  const [validId, setValidId] = useState<number | null>(null);
  
  useEffect(() => {
    const id = parseInt(preferenceId);
    if (!isNaN(id)) {
      setValidId(id);
    }
  }, [preferenceId]);
  
  if (!validId) {
    return (
      <div className="container mx-auto px-4 py-16 pt-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Invalid Request</h1>
        <p className="text-gray-600 mb-6">The package comparison request is invalid.</p>
        <Link href="/my-trips">
          <Button>Return to My Trips</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="pt-24">
      <div className="container mx-auto px-4">
        <Link href="/my-trips">
          <a className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-4">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to My Trips
          </a>
        </Link>
      </div>
      <PackageComparisonSection preferenceId={validId} />
    </div>
  );
}
