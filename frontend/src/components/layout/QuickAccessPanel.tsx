import { Shield, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

export function QuickAccessPanel() {
  return (
    <div className="fixed bottom-4 right-4 z-50 hidden lg:block">
      <Card className="w-64 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Quick Access</CardTitle>
          <CardDescription className="text-xs">
            For development and testing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button asChild variant="outline" size="sm" className="w-full justify-start gap-2">
            <Link to="/signin">
              <UserIcon className="h-4 w-4" />
              User Login
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="w-full justify-start gap-2">
            <Link to="/admin/login">
              <Shield className="h-4 w-4" />
              Admin Login
            </Link>
          </Button>
          <div className="mt-3 rounded-md bg-muted p-2 text-xs">
            <p className="font-medium">Admin Credentials:</p>
            <p className="text-muted-foreground">admin@diasporabiz.com</p>
            <p className="text-muted-foreground">admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
