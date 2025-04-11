import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UrdfData } from "@/lib/types";
import { toast } from "sonner";

export const useUrdfParser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<UrdfData | null>(null);

  const parseUrdf = async (urdfContent: string) => {
    const requestId = `urdf-${Date.now()}`; // Generate unique ID for tracking this request
    console.log(`[${requestId}] 🚀 URDF Parser: Starting parse request`);
    console.log(`[${requestId}] 📋 Content type:`, typeof urdfContent);
    console.log(`[${requestId}] 📏 Content length:`, urdfContent?.length || 0);
    console.log(
      `[${requestId}] 🔍 Content preview:`,
      urdfContent?.substring(0, 100) + "..."
    );

    // Check if the URDF content is too large
    const MAX_SIZE = 4 * 1024 * 1024; // 4MB limit
    if (urdfContent.length > MAX_SIZE) {
      const errorMessage = `URDF content too large (${(
        urdfContent.length /
        1024 /
        1024
      ).toFixed(2)}MB). Maximum size is ${MAX_SIZE / 1024 / 1024}MB.`;
      console.error(`[${requestId}] ❌ ${errorMessage}`);
      setError(errorMessage);
      toast.error("File too large", {
        description: errorMessage,
        duration: 5000,
      });
      return null;
    }

    setIsLoading(true);
    setError(null);

    const startTime = performance.now();

    try {
      // Make sure the urdfContent is a string
      if (typeof urdfContent !== "string") {
        throw new Error("URDF content must be a string");
      }

      console.log(
        `[${requestId}] 📡 Calling Supabase edge function "urdf-parser"...`
      );

      const { data, error } = await supabase.functions.invoke("urdf-parser", {
        body: { urdfContent },
      });

      if (error) {
        console.error(`[${requestId}] ❌ Supabase function error:`, error);

        // Handle different error cases
        if (error.message.includes("non-2xx status code")) {
          // Server error from edge function
          const serverErrorMsg =
            "The URDF parser encountered a server error. It might be due to the complexity of your URDF file or temporary server issues.";
          console.error(`[${requestId}] 🔥 Server error in edge function`);

          // Check if we got fallback data despite the error
          if (data && data.fallback) {
            console.log(`[${requestId}] 🛟 Using fallback data from server`);
            toast.warning("Reduced URDF Data", {
              description:
                "Limited information extracted from your URDF file due to parsing limitations.",
              duration: 5000,
            });

            // Use the fallback data
            setData(data.fallback);
            return data.fallback;
          }

          toast.error("URDF Parser Error", {
            description: serverErrorMsg,
            duration: 5000,
          });

          setError(serverErrorMsg);
        } else if (error.message.includes("timeout")) {
          // Timeout error
          const timeoutMsg =
            "The URDF parser timed out. Your file might be too complex to process within the allowed time.";
          console.error(`[${requestId}] ⏱️ Edge function timed out`);

          toast.error("Processing Timeout", {
            description: timeoutMsg,
            duration: 5000,
          });

          setError(timeoutMsg);
        } else {
          // Generic error
          setError(error.message);

          toast.error("Error Parsing URDF", {
            description: error.message,
            duration: 5000,
          });
        }

        throw error;
      }

      const endTime = performance.now();
      console.log(
        `[${requestId}] ✅ Edge function responded in ${(
          endTime - startTime
        ).toFixed(2)}ms`
      );
      console.log(
        `[${requestId}] 📊 Response data structure:`,
        Object.keys(data || {})
      );
      console.log(`[${requestId}] 📦 Full response:`, data);

      setData(data);
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      const endTime = performance.now();

      console.error(
        `[${requestId}] ❌ Error parsing URDF after ${(
          endTime - startTime
        ).toFixed(2)}ms:`,
        err
      );
      console.error(`[${requestId}] 🧩 Error details:`, {
        message: errorMessage,
        type: err instanceof Error ? err.constructor.name : typeof err,
        stack: err instanceof Error ? err.stack : undefined,
      });

      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
      console.log(
        `[${requestId}] 🏁 URDF parsing request completed, isLoading set to false`
      );
    }
  };

  return {
    parseUrdf,
    data,
    isLoading,
    error,
  };
};
