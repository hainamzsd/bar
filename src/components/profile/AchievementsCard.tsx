import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

const achievements = [
  { title: "5 Year Milestone", description: "Celebrating 5 years with the company" },
  { title: "Top Contributor", description: "Recognized for outstanding contributions" },
  { title: "Innovation Award", description: "For developing a groundbreaking feature" },
  { title: "Mentor of the Year", description: "Acknowledged for exceptional mentorship" },
];

const AchievementsCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {achievements.map((achievement, index) => (
            <Card key={index}>
              <CardContent className="flex items-center p-4">
                <Trophy className="h-8 w-8 text-yellow-500 mr-4" />
                <div>
                  <h3 className="font-semibold">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementsCard;
