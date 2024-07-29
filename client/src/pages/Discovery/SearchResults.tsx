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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";

const SearchResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const term = searchParams.get("q") || "";
    const cat = searchParams.get("category") || "";
    const sortBy = searchParams.get("sort") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);

    setSearchTerm(term);
    setCategory(cat);
    setSort(sortBy);
    setCurrentPage(page);

    fetchSearchResults(term, cat, sortBy, page);
  }, [location.search]);

  const fetchSearchResults = async (
    term: string,
    category: string,
    sort: string,
    page: number
  ) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/auctions/search?q=${term}&category=${category}&sort=${sort}&page=${page}&limit=12`
      );
      setSearchResults(response.data.auctions);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    navigate(
      `/search?q=${searchTerm}&category=${category}&sort=${sort}&page=1`
    );
  };

  const handlePageChange = (page: number) => {
    navigate(
      `/search?q=${searchTerm}&category=${category}&sort=${sort}&page=${page}`
    );
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

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisible, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    if (startPage > 1) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(<PaginationEllipsis key="ellipsis-start" />);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<PaginationEllipsis key="ellipsis-end" />);
      }
      items.push(
        <PaginationItem key="last">
          <PaginationLink onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

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
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="end_time">Ending Soon</SelectItem>
              <SelectItem value="start_time">Starting Soon</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSearch}>
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {searchResults.map((auction) => (
              <Card
                key={auction._id}
                className="hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-3">
                  <img
                    src={"http://localhost:3000/uploads/" + auction.images[0]}
                    alt={auction.title}
                    className="w-full h-32 object-cover mb-2 rounded"
                  />
                  <h3 className="text-sm font-semibold mb-1 truncate">
                    {auction.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">
                    ${auction.currentPrice.toLocaleString()}
                  </p>
                  <div className="flex justify-between items-center mb-2">
                    <Badge variant="outline" className="text-xs">
                      {auction.watchedBy?.length || 0} 👀
                    </Badge>
                    <CountdownTimer
                      endTime={auction.endTime}
                      size="sm"
                      shortLabels
                    />
                  </div>
                  <Button
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => navigate(`/auction/${auction._id}`)}
                  >
                    View Auction
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {searchResults.length === 0 && (
            <p className="text-center text-gray-500 mt-8">No results found.</p>
          )}

          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
                {renderPaginationItems()}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}

      <Footer />
    </div>
  );
};

export default SearchResults;
