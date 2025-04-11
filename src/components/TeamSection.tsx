
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
    name: "Alex Johnson",
    role: "Lead Engineer",
    imageUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=300&h=300&auto=format&fit=crop",
    bio: "Alex leads our engineering team with over 10 years of robotics experience."
  },
  {
    id: "2",
    name: "Sarah Williams",
    role: "Robotics Specialist",
    imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=300&h=300&auto=format&fit=crop",
    bio: "Sarah specializes in bipedal robot movement and stability systems."
  },
  {
    id: "3",
    name: "Michael Chen",
    role: "AI Researcher",
    imageUrl: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=300&h=300&auto=format&fit=crop",
    bio: "Michael focuses on developing advanced AI systems for autonomous robots."
  },
  {
    id: "4",
    name: "Priya Patel",
    role: "UX Designer",
    imageUrl: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?q=80&w=300&h=300&auto=format&fit=crop",
    bio: "Priya designs intuitive interfaces for human-robot interaction."
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
