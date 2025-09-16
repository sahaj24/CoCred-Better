"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AUTHORITY_ROLES } from "@/lib/authority-roles";
import type { AuthorityRole } from "@/lib/types";
import { Shield, Users, Calendar, Award } from "lucide-react";

interface AuthorityRoleSelectionProps {
  selectedRole: string;
  onRoleChange: (roleType: string) => void;
  organization: string;
  onOrganizationChange: (org: string) => void;
}

const roleIcons = {
  admin: Shield,
  faculty: Users,
  club_organizer: Calendar,
  event_organizer: Award
};

export function AuthorityRoleSelection({
  selectedRole,
  onRoleChange,
  organization,
  onOrganizationChange
}: AuthorityRoleSelectionProps) {
  const roles = Object.values(AUTHORITY_ROLES);

  const getOrganizationLabel = (roleType: string) => {
    switch (roleType) {
      case 'faculty':
        return 'Department';
      case 'club_organizer':
        return 'Club Name';
      case 'event_organizer':
        return 'Organization';
      case 'admin':
        return 'Institution';
      default:
        return 'Organization';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium">Select Your Authority Role</Label>
        <p className="text-sm text-muted-foreground mt-1">
          Choose the role that best describes your position and responsibilities
        </p>
      </div>

      <RadioGroup value={selectedRole} onValueChange={onRoleChange}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map((role) => {
            const IconComponent = roleIcons[role.type as keyof typeof roleIcons];
            return (
              <div key={role.type} className="relative">
                <RadioGroupItem 
                  value={role.type} 
                  id={role.type}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={role.type}
                  className="flex cursor-pointer"
                >
                  <Card className="w-full transition-all hover:shadow-md peer-checked:ring-2 peer-checked:ring-primary peer-checked:border-primary">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-medium">{role.label}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-sm mb-3">
                        {role.description}
                      </CardDescription>
                      
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">Permissions:</p>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(role.permissions)
                            .filter(([_, value]) => value)
                            .map(([key, _]) => (
                              <Badge 
                                key={key} 
                                variant="secondary" 
                                className="text-xs px-2 py-0.5"
                              >
                                {key.replace('can_', '').replace(/_/g, ' ')}
                              </Badge>
                            ))
                          }
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Label>
              </div>
            );
          })}
        </div>
      </RadioGroup>

      {selectedRole && (
        <div className="space-y-2">
          <Label htmlFor="organization" className="text-sm font-medium">
            {getOrganizationLabel(selectedRole)}
          </Label>
          <Input
            id="organization"
            value={organization}
            onChange={(e) => onOrganizationChange(e.target.value)}
            placeholder={`Enter your ${getOrganizationLabel(selectedRole).toLowerCase()}`}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            This helps identify your scope of authority and manage permissions appropriately.
          </p>
        </div>
      )}
    </div>
  );
}