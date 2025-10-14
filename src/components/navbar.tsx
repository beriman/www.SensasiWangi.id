import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, ChevronDown } from "lucide-react";
import { NAV_ITEMS } from "../constants/menu";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { SearchBar } from "./search-bar";
import { LanguageToggle } from "./language-toggle";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useToast } from "./ui/use-toast";
import { useAuthContext } from "@/providers/auth-provider";

export function Navbar() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoading, signOut } = useAuthContext();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      toast({ title: "Berhasil keluar" });
      navigate("/");
    } finally {
      setIsSigningOut(false);
    }
  };

  const initials = user?.email?.[0]?.toUpperCase() ?? "U";

  return (
    <nav className="sticky top-0 w-full neumorphic-card border-0 z-50 mx-4 mt-4 rounded-3xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-base font-medium text-[#1D1D1F]">
              SensasiWangi.id
            </span>
          </Link>

          <div className="hidden md:flex flex-1 justify-center items-center space-x-6">
            {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="neumorphic-button-sm inline-flex items-center px-4 py-2 text-sm font-medium text-[#1D1D1F] transition-all duration-200 border-0 shadow-none hover:scale-105 active:scale-95"
              >
                <Icon className="w-4 h-4 mr-1.5" />
                {label}
              </Link>
            ))}
            <Button
              onClick={handleDashboard}
              className="neumorphic-button-sm inline-flex items-center px-4 py-2 text-sm font-medium text-[#1D1D1F] transition-all duration-200 border-0 shadow-none hover:scale-105 active:scale-95"
            >
              Dashboard
            </Button>
          </div>

          <div className="md:hidden flex-1 flex justify-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button className="neumorphic-button-sm inline-flex items-center px-4 py-2 text-sm font-medium text-[#1D1D1F] transition-all duration-200 border-0 shadow-none hover:scale-105 active:scale-95">
                  <Menu className="w-4 h-4 mr-2" />
                  Menu
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pt-10 flex flex-col space-y-4 neumorphic-bg">
                {NAV_ITEMS.map(({ label, to }) => (
                  <Link key={to} to={to} className="neumorphic-button-sm w-full text-left">
                    {label}
                  </Link>
                ))}
                <Button onClick={handleDashboard} className="neumorphic-button-sm w-full text-left">
                  Dashboard
                </Button>
                {user ? (
                  <Button onClick={handleSignOut} className="neumorphic-button-sm w-full text-left" disabled={isSigningOut}>
                    Keluar
                  </Button>
                ) : (
                  <Link to="/auth/signin" className="neumorphic-button-sm w-full text-left">
                    Masuk
                  </Link>
                )}
              </SheetContent>
            </Sheet>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <SearchBar />
            <LanguageToggle />
            {!isLoading && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{user.email}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="neumorphic-card border-0 shadow-none min-w-[200px]" align="end">
                  <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[#E5E5E7]" />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#E5E5E7]" />
                  <DropdownMenuItem onSelect={handleSignOut} disabled={isSigningOut}>
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth/signin">
                <Button>Masuk</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
