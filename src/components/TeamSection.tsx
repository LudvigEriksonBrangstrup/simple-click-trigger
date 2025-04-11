
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  bio?: string;
}

const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Max",
    role: "Lead Engineer",
    imageUrl: "/lovable-uploads/07251c16-3e3c-4c40-8450-c6c17f291e00.png",
    bio: "Max leads our engineering team with expertise in robotics and AI integration."
  },
  {
    id: "2",
    name: "Ludvig",
    role: "Robotics Specialist",
    imageUrl: "/lovable-uploads/e6811f8e-3c1e-4a80-80e5-4b82f4704aec.png",
    bio: "Ludvig specializes in bipedal robot movement and stability systems."
  },
  {
    id: "3",
    name: "Victor",
    role: "AI Researcher",
    imageUrl: "/lovable-uploads/21f0e012-4ef0-4db0-a1e2-aa5205c8400e.png",
    bio: "Victor focuses on developing advanced AI systems for autonomous robots."
  },
  {
    id: "4",
    name: "Fabian",
    role: "UX Designer",
    imageUrl: "/lovable-uploads/e6f4bf50-ed44-4ce7-9fab-ff8a9476b584.png",
    bio: "Fabian designs intuitive interfaces for human-robot interaction."
  }
];

const TeamSection: React.FC = () => {
  return (
    <section className="py-16 relative z-10">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-bold mb-12 text-center text-netflix-text text-glow">
          Our Team
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <Card key={member.id} className="glass-panel hover:shadow-glow transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="pt-6 text-center">
                <Avatar className="h-32 w-32 mx-auto mb-4 border-2 border-white/20">
                  <AvatarImage src={member.imageUrl} alt={member.name} />
                  <AvatarFallback className="text-2xl">{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-netflix-lightText mb-3">{member.role}</p>
                {member.bio && <p className="text-sm text-netflix-text2">{member.bio}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
