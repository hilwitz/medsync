
import React from "react";
import { Link } from "react-router-dom";
import { Search, Menu, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export const AppHeader: React.FC = () => {
  const { user, signOut } = useAuth();
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="lg:hidden" size="icon">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>MedNote</SheetTitle>
                  <SheetDescription>Clinical documentation made simple</SheetDescription>
                </SheetHeader>
                <nav className="mt-6 flex flex-col space-y-3">
                  <MobileNavLink to="/" label="Patients" />
                  <MobileNavLink to="/notes" label="Recent Notes" />
                </nav>
              </SheetContent>
            </Sheet>
            
            <Link to="/" className="flex items-center">
              <span className="text-medblue-600 text-xl font-bold">MedNote</span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center space-x-6">
            <NavLink to="/" label="Patients" />
            <NavLink to="/notes" label="Recent Notes" />
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {user?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  label: string;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, label, className }) => {
  // Use window.location to determine if the link is active
  const isActive = window.location.pathname === to;
  
  return (
    <Link
      to={to}
      className={cn(
        "text-sm font-medium transition-colors",
        isActive ? "text-medblue-600" : "text-gray-600 hover:text-medblue-600",
        className
      )}
    >
      {label}
    </Link>
  );
};

const MobileNavLink: React.FC<NavLinkProps> = ({ to, label }) => {
  const isActive = window.location.pathname === to;
  
  return (
    <Link
      to={to}
      className={cn(
        "px-3 py-2 text-sm font-medium rounded-md transition-colors",
        isActive 
          ? "bg-medblue-50 text-medblue-600" 
          : "text-gray-600 hover:bg-gray-50 hover:text-medblue-600"
      )}
    >
      {label}
    </Link>
  );
};
