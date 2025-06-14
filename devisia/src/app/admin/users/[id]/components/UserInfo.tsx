import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

interface UserInfoProps {
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    companyName: string | null;
    createdAt: string;
    subscription: {
      status: string;
      plan: string;
      startDate: string;
      endDate: string | null;
      isActive: boolean;
      nextBillingDate: string | null;
      price: number;
    };
  };
}

const getSubscriptionStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "trial":
      return "bg-blue-100 text-blue-800";
    case "expired":
      return "bg-red-100 text-red-800";
    case "canceled":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function UserInfo({ user }: UserInfoProps) {
  const initials = 
    (user.firstName ? user.firstName[0] : '') + 
    (user.lastName ? user.lastName[0] : '');
  
  const fullName = [user.firstName, user.lastName]
    .filter(Boolean)
    .join(' ') || 'Utilisateur sans nom';
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Informations utilisateur</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="" />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">{fullName}</h2>
            <p className="text-gray-500">{user.email}</p>
            {user.companyName && (
              <p className="text-sm text-gray-500">Entreprise: {user.companyName}</p>
            )}
            <p className="text-sm text-gray-500">
              Inscrit le: {formatDate(user.createdAt)}
            </p>
          </div>
        </div>
        
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-medium mb-2">Abonnement</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Plan</span>
              <span className="font-medium capitalize">{user.subscription.plan}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-500">Statut</span>
              <Badge className={getSubscriptionStatusColor(user.subscription.status)}>
                {user.subscription.status === "active" ? "Actif" : 
                 user.subscription.status === "trial" ? "Essai" :
                 user.subscription.status === "expired" ? "Expiré" : "Annulé"}
              </Badge>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-500">Date de début</span>
              <span>{formatDate(user.subscription.startDate)}</span>
            </div>
            
            {user.subscription.endDate && (
              <div className="flex justify-between">
                <span className="text-gray-500">Date de fin</span>
                <span>{formatDate(user.subscription.endDate)}</span>
              </div>
            )}
            
            {user.subscription.nextBillingDate && (
              <div className="flex justify-between">
                <span className="text-gray-500">Prochaine facturation</span>
                <span>{formatDate(user.subscription.nextBillingDate)}</span>
              </div>
            )}
            
            {user.subscription.price > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">Prix mensuel</span>
                <span>{user.subscription.price} €</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
