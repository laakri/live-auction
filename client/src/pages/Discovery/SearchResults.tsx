import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import CountdownTimer from "../../components/CountdownTimer";
import { Search } from "lucide-react";
import Footer from "../../pagesComponents/Footer";

const SearchResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const term = searchParams.get("term") || "";
    const cat = searchParams.get("category") || "";
    const sortBy = searchParams.get("sort") || "";

    setSearchTerm(term);
    setCategory(cat);
    setSort(sortBy);

    fetchSearchResults(term, cat, sortBy);
  }, [location.search]);

  const fetchSearchResults = async (
    term: string,
    category: string,
    sort: string
  ) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/auctions/search?term=${term}&category=${category}&sort=${sort}`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleSearch = () => {
    navigate(`/search?term=${searchTerm}&category=${category}&sort=${sort}`);
  };

  const categories = [
    { name: "All", icon: "🔍" },
    { name: "Art", icon: "🎨" },
    { name: "Collectibles", icon: "🏺" },
    { name: "Electronics", icon: "📱" },
    { name: "Fashion", icon: "👗" },
    { name: "Home & Garden", icon: "🏡" },
    { name: "Jewelry", icon: "💍" },
    { name: "Sports", icon: "⚽" },
    { name: "Vehicles", icon: "🚗" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Results</h1>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <Input
            type="text"
            placeholder="Search auctions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.name} value={cat.name.toLowerCase()}>
                  {cat.icon} {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="ending_soon">Ending Soon</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSearch}>
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {searchResults.map((auction) => (
          <Card
            key={auction._id}
            className="hover:shadow-lg transition-all duration-300"
          >
            <CardContent className="p-4">
              <img
                src={"http://localhost:3000/uploads/" + auction.images[0]}
                alt={auction.title}
                className="w-full h-48 object-cover mb-4 rounded"
              />
              <h3 className="text-lg font-semibold mb-2">{auction.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Current bid: ${auction.currentPrice.toLocaleString()}
              </p>
              <div className="flex justify-between items-center">
                <Badge variant="outline">
                  {auction.watchedBy?.length || 0} watchers
                </Badge>
                <CountdownTimer
                  endTime={auction.endTime}
                  size="sm"
                  shortLabels
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {searchResults.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No results found.</p>
      )}

      <Footer />
    </div>
  );
};

export default SearchResults;
