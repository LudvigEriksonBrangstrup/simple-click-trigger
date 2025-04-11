import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface JointAnimation {
  jointName: string;
  keyframes: {
    time: number;
    position: number;
  }[];
}

interface AnimationRequest {
  robotName: string;
  joints: {
    name: string;
    type: string;
    limits?: {
      lower: number;
      upper: number;
    };
  }[];
  description: string;
}

interface AnimationResponse {
  name: string;
  duration: number;
  jointAnimations: JointAnimation[];
}

export const useAnimationGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [animation, setAnimation] = useState<AnimationResponse | null>(null);

  const generateAnimation = async (request: AnimationRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Calling create-animation function with request:", request);

      const { data, error } = await supabase.functions.invoke(
        "create-animation",
        {
          body: request,
        }
      );

      if (error) {
        console.error("Supabase function error:", error);
        throw error;
      }

      console.log("Received response from create-animation:", data);

      setAnimation(data);
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      console.error("Error generating animation:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateAnimation,
    animation,
    isLoading,
    error,
  };
};
