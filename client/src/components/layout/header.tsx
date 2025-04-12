import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Globe, Menu, User, LogOut, Package, MessageSquare, Settings } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className={`bg-white fixed w-full z-50 transition-shadow ${isScrolled ? "shadow-md" : "shadow-sm"}`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-1">
          <Globe className="text-primary text-2xl" />
          <Link href="/">
            <span className="text-xl font-semibold cursor-pointer">TravelWise</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex space-x-8 text-sm">
          <Link href="/" className={`font-medium ${location === "/" ? "text-gray-900" : "text-gray-500"} hover:text-primary`}>
            Home
          </Link>
          <Link href="/explore" className={`font-medium ${location === "/explore" ? "text-gray-900" : "text-gray-500"} hover:text-primary`}>
            Explore
          </Link>
          {user && (
            <>
              <Link href="/my-trips" className={`font-medium ${location === "/my-trips" ? "text-gray-900" : "text-gray-500"} hover:text-primary`}>
                My Trips
              </Link>
              <Link href="/messages" className={`font-medium ${location === "/messages" ? "text-gray-900" : "text-gray-500"} hover:text-primary`}>
                Messages
              </Link>
            </>
          )}
          {user?.role === "agency" && (
            <Link href="/agency-dashboard" className={`font-medium ${location === "/agency-dashboard" ? "text-gray-900" : "text-gray-500"} hover:text-primary`}>
              Dashboard
            </Link>
          )}
        </nav>
        
        <div className="flex items-center space-x-4">
          {/* User menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.fullName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user.role === "agency" && (
                  <DropdownMenuItem asChild>
                    <Link href="/agency-dashboard">
                      <div className="flex items-center cursor-pointer w-full">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Agency Dashboard</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/my-trips">
                    <div className="flex items-center cursor-pointer w-full">
                      <Package className="mr-2 h-4 w-4" />
                      <span>My Trips</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/messages">
                    <div className="flex items-center cursor-pointer w-full">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      <span>Messages</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{logoutMutation.isPending ? "Logging out..." : "Log out"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:block">
              <Link href="/auth">
                <Button variant="ghost" className="text-sm font-medium text-gray-500 hover:text-primary">
                  Log in
                </Button>
              </Link>
              <span className="mx-2 text-gray-300">|</span>
              <Link href="/auth?tab=register">
                <Button variant="ghost" className="text-sm font-medium text-gray-500 hover:text-primary">
                  Sign up
                </Button>
              </Link>
            </div>
          )}
          
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>
                  <div className="flex items-center space-x-1">
                    <Globe className="text-primary text-xl" />
                    <span className="font-semibold">TravelWise</span>
                  </div>
                </SheetTitle>
              </SheetHeader>
              <div className="py-6 flex flex-col gap-4">
                <Link href="/" className={`px-2 py-2 font-medium ${location === "/" ? "text-primary" : "text-gray-700"}`}>
                  Home
                </Link>
                <Link href="/explore" className={`px-2 py-2 font-medium ${location === "/explore" ? "text-primary" : "text-gray-700"}`}>
                  Explore
                </Link>
                
                {user ? (
                  <>
                    <Link href="/my-trips" className={`px-2 py-2 font-medium ${location === "/my-trips" ? "text-primary" : "text-gray-700"}`}>
                      My Trips
                    </Link>
                    <Link href="/messages" className={`px-2 py-2 font-medium ${location === "/messages" ? "text-primary" : "text-gray-700"}`}>
                      Messages
                    </Link>
                    {user.role === "agency" && (
                      <Link href="/agency-dashboard" className={`px-2 py-2 font-medium ${location === "/agency-dashboard" ? "text-primary" : "text-gray-700"}`}>
                        Agency Dashboard
                      </Link>
                    )}
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => logoutMutation.mutate()}
                      disabled={logoutMutation.isPending}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {logoutMutation.isPending ? "Logging out..." : "Log out"}
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 mt-2">
                    <Link href="/auth">
                      <Button variant="outline" className="w-full">Log in</Button>
                    </Link>
                    <Link href="/auth?tab=register">
                      <Button className="w-full">Sign up</Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
