import { XMLParser } from "npm:fast-xml-parser@4.3.5";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

interface URDFLink {
  name: string;
  mass: number;
  inertia: {
    ixx: number;
    ixy: number;
    ixz: number;
    iyy: number;
    iyz: number;
    izz: number;
  };
  has_visual: boolean;
  has_collision: boolean;
}

interface URDFJoint {
  name: string;
  type: string;
  parent: string;
  child: string;
  limits?: {
    lower: number;
    upper: number;
    effort: number;
    velocity: number;
  };
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      throw new Error("Method not allowed");
    }

    const { urdfContent } = await req.json();

    if (!urdfContent) {
      throw new Error("No URDF content provided");
    }

    // Parse URDF XML using fast-xml-parser
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "",
      parseAttributeValue: true,
    });

    const doc = parser.parse(urdfContent);

    if (!doc || !doc.robot) {
      throw new Error("No robot element found in URDF");
    }

    // Extract robot data
    const robotElement = doc.robot;
    const name = robotElement.name || "unnamed_robot";
    const version = robotElement.version;
    const links: URDFLink[] = [];
    const joints: URDFJoint[] = [];
    let total_mass = 0;

    // Parse links
    if (robotElement.link) {
      const linkElements = Array.isArray(robotElement.link)
        ? robotElement.link
        : [robotElement.link];
      linkElements.forEach((link: any) => {
        const linkName = link.name || "";
        const inertial = link.inertial;
        const mass = inertial?.mass?.value || 0;
        total_mass += mass;

        const linkData: URDFLink = {
          name: linkName,
          mass,
          inertia: {
            ixx: 0,
            ixy: 0,
            ixz: 0,
            iyy: 0,
            iyz: 0,
            izz: 0,
          },
          has_visual: !!link.visual,
          has_collision: !!link.collision,
        };

        // Parse inertia
        if (inertial?.inertia) {
          const inertiaEl = inertial.inertia;
          linkData.inertia = {
            ixx: inertiaEl.ixx || 0,
            ixy: inertiaEl.ixy || 0,
            ixz: inertiaEl.ixz || 0,
            iyy: inertiaEl.iyy || 0,
            iyz: inertiaEl.iyz || 0,
            izz: inertiaEl.izz || 0,
          };
        }

        links.push(linkData);
      });
    }

    // Parse joints
    if (robotElement.joint) {
      const jointElements = Array.isArray(robotElement.joint)
        ? robotElement.joint
        : [robotElement.joint];
      jointElements.forEach((joint: any) => {
        const jointData: URDFJoint = {
          name: joint.name || "",
          type: joint.type || "",
          parent: joint.parent?.link || "",
          child: joint.child?.link || "",
        };

        // Parse limits
        if (joint.limit) {
          jointData.limits = {
            lower: joint.limit.lower || 0,
            upper: joint.limit.upper || 0,
            effort: joint.limit.effort || 0,
            velocity: joint.limit.velocity || 0,
          };
        }

        joints.push(jointData);
      });
    }

    const response = {
      success: true,
      data: {
        name,
        version,
        links,
        joints,
        total_mass,
        num_links: links.length,
        num_joints: joints.length,
      },
    };

    return new Response(JSON.stringify(response), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error parsing URDF:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
