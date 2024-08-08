import React, { useState, useEffect } from "react";
import { Search, History, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../components/ui/dialog";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
} from "../components/ui/command";
import { ScrollArea } from "../components/ui/scroll-area";
import { Input } from "../components/ui/input";

const SearchComponent: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingSearches] = useState([
    { name: "Art", icon: "🎨", value: "art" },
    { name: "Collectibles", icon: "🏺", value: "collectibles" },
    { name: "Electronics", icon: "📱", value: "electronics" },
    { name: "Fashion", icon: "👗", value: "fashion" },
    { name: "Home & Garden", icon: "🏡", value: "home-and-garden" },
    { name: "Jewelry", icon: "💍", value: "jewelry" },
    { name: "Sports", icon: "⚽", value: "sports" },
    { name: "Vehicles", icon: "🚗", value: "vehicles" },
  ]);

  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  const handleSearch = (term: string, isCategory: boolean = false) => {
    if (term.trim()) {
      if (isCategory) {
        navigate(`/search?category=${encodeURIComponent(term.toLowerCase())}`);
      } else {
        navigate(`/search?q=${encodeURIComponent(term)}`);
      }
      addToRecentSearches(term);
      setOpen(false);
    }
  };

  const addToRecentSearches = (term: string) => {
    const updatedSearches = [
      term,
      ...recentSearches.filter((t) => t !== term),
    ].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="relative w-full px-2">
          <div className="flex items-center ">
            <Input
              className="flex-grow bg-transparent border-none focus:ring-0 placeholder-muted-foreground/70 text-sm"
              placeholder="Search auctions..."
            />
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full hover:bg-secondary/80 ml-2"
            >
              <Search className="h-4 w-4 text-muted-foreground ml-2 mr-3" />
            </Button>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] p-0">
        <Command className="rounded-lg border shadow-md">
          <div className="flex items-center border-b px-3 py-2">
            <CommandInput
              placeholder="Search auctions..."
              value={searchTerm}
              onValueChange={setSearchTerm}
              className="flex-1 outline-none bg-transparent"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchTerm("")}
                className="h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <ScrollArea className="h-[300px]">
            <CommandList>
              {searchTerm && (
                <CommandItem onSelect={() => handleSearch(searchTerm)}>
                  <Search className="mr-2 h-4 w-4" />
                  <span>Search for "{searchTerm}"</span>
                </CommandItem>
              )}
              {recentSearches.length > 0 && (
                <CommandGroup heading="Recent Searches">
                  {recentSearches.map((term, index) => (
                    <CommandItem
                      key={index}
                      onSelect={() => handleSearch(term)}
                    >
                      <History className="mr-2 h-4 w-4" />
                      <span>{term}</span>
                    </CommandItem>
                  ))}
                  <CommandItem onSelect={clearRecentSearches}>
                    <X className="mr-2 h-4 w-4" />
                    <span className="text-sm text-muted-foreground">
                      Clear recent searches
                    </span>
                  </CommandItem>
                </CommandGroup>
              )}
              <CommandGroup heading="Categories">
                {trendingSearches.map((term, index) => (
                  <CommandItem
                    key={index}
                    onSelect={() => handleSearch(term.value, true)}
                  >
                    <span className="mr-2">{term.icon}</span>
                    <span>{term.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </ScrollArea>
        </Command>
        <div className="flex justify-end mt-4 px-4 pb-4">
          <Button
            onClick={() => handleSearch(searchTerm)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Search
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchComponent;
