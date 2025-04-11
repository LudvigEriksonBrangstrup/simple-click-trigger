
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

interface JointAnimation {
  jointName: string;
  keyframes: {
    time: number;  // Time in seconds
    position: number; // Position in radians
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
  description: string; // Natural language description of the desired animation
}

interface AnimationResponse {
  name: string;
  duration: number; // Total duration in seconds
  jointAnimations: JointAnimation[];
}

// Function to generate animation parameters based on natural language description
const generateAnimation = (request: AnimationRequest): AnimationResponse => {
  console.log("Generating animation for:", request.robotName);
  console.log("Animation description:", request.description);
  
  const description = request.description.toLowerCase();
  
  // Create some example animations based on the description
  let animations: JointAnimation[] = [];
  let duration = 3.0; // Default duration
  
  if (description.includes("walk") || description.includes("walking")) {
    animations = createWalkingAnimation(request.joints);
    duration = 5.0;
  } else if (description.includes("wave") || description.includes("greeting")) {
    animations = createWavingAnimation(request.joints);
    duration = 3.0;
  } else if (description.includes("jump") || description.includes("jumping")) {
    animations = createJumpingAnimation(request.joints);
    duration = 2.0;
  } else {
    // Default animation - gentle movement of all joints
    animations = createDefaultAnimation(request.joints);
    duration = 4.0;
  }
  
  return {
    name: `${request.robotName} - ${request.description}`,
    duration: duration,
    jointAnimations: animations
  };
};

// Example animation creation functions
const createWalkingAnimation = (joints: any[]): JointAnimation[] => {
  const walkingJoints = joints.filter(j => 
    j.name.includes("hip") || j.name.includes("knee") || j.name.includes("ankle")
  );
  
  return walkingJoints.map((joint, index) => {
    const phaseOffset = (index % 4) * (Math.PI / 2); // Stagger the legs
    
    return {
      jointName: joint.name,
      keyframes: [
        { time: 0.0, position: 0 },
        { time: 1.0, position: Math.sin(phaseOffset) * 0.5 },
        { time: 2.0, position: Math.sin(phaseOffset + Math.PI/2) * 0.5 },
        { time: 3.0, position: Math.sin(phaseOffset + Math.PI) * 0.5 },
        { time: 4.0, position: Math.sin(phaseOffset + 3*Math.PI/2) * 0.5 },
        { time: 5.0, position: 0 }
      ]
    };
  });
};

const createWavingAnimation = (joints: any[]): JointAnimation[] => {
  // Find a joint that could be used for waving (e.g., a front leg or arm)
  const waveJoint = joints.find(j => j.name.includes("hip_1") || j.name.includes("shoulder"));
  
  if (!waveJoint) return createDefaultAnimation(joints);
  
  return [
    {
      jointName: waveJoint.name,
      keyframes: [
        { time: 0.0, position: 0 },
        { time: 0.5, position: 0.8 },
        { time: 1.0, position: 0.4 },
        { time: 1.5, position: 0.8 },
        { time: 2.0, position: 0.4 },
        { time: 2.5, position: 0.8 },
        { time: 3.0, position: 0 }
      ]
    }
  ];
};

const createJumpingAnimation = (joints: any[]): JointAnimation[] => {
  const legJoints = joints.filter(j => 
    j.name.includes("knee") || j.name.includes("ankle")
  );
  
  return legJoints.map(joint => ({
    jointName: joint.name,
    keyframes: [
      { time: 0.0, position: 0 },
      { time: 0.5, position: -0.6 }, // Crouch
      { time: 1.0, position: 0.8 },  // Extend
      { time: 1.5, position: 0 },    // Land
      { time: 2.0, position: 0 }
    ]
  }));
};

const createDefaultAnimation = (joints: any[]): JointAnimation[] => {
  return joints.slice(0, 6).map((joint, index) => ({
    jointName: joint.name,
    keyframes: [
      { time: 0.0, position: 0 },
      { time: 1.0, position: 0.3 * Math.sin(index) },
      { time: 2.0, position: -0.3 * Math.sin(index) },
      { time: 3.0, position: 0.2 * Math.sin(index) },
      { time: 4.0, position: 0 }
    ]
  }));
};

serve(async (req) => {
  try {
    // Get the request body
    const animationRequest: AnimationRequest = await req.json();
    
    if (!animationRequest.robotName || !animationRequest.joints || !animationRequest.description) {
      return new Response(
        JSON.stringify({ error: "Robot name, joints, and animation description are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Generate the animation based on the request
    const animation = generateAnimation(animationRequest);
    
    // Return the animation data
    return new Response(
      JSON.stringify(animation),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in animation generator:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
})
