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
import { Search, Filter, X } from "lucide-react";
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
import { motion } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet";

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
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const term = searchParams.get("q") || "";
    const cat = searchParams.get("category") || "";
    const sortBy = searchParams.get("sort") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const min = parseInt(searchParams.get("minPrice") || "0", 10);
    const max = parseInt(searchParams.get("maxPrice") || "10000", 10);
    const statusParam = searchParams.get("status") || "";

    setSearchTerm(term);
    setCategory(cat);
    setSort(sortBy);
    setCurrentPage(page);
    setMinPrice(min);
    setMaxPrice(max);
    setStatus(statusParam);

    fetchSearchResults(term, cat, sortBy, page, min, max, statusParam);
  }, [location.search]);

  const fetchSearchResults = async (
    term: string,
    category: string,
    sort: string,
    page: number,
    minPrice: number,
    maxPrice: number,
    status: string
  ) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/auctions/search?q=${term}&category=${category}&sort=${sort}&page=${page}&limit=12&minPrice=${minPrice}&maxPrice=${maxPrice}&status=${status}`
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
      `/search?q=${searchTerm}&category=${category}&sort=${sort}&page=1&minPrice=${minPrice}&maxPrice=${maxPrice}&status=${status}`
    );
  };

  const handlePageChange = (page: number) => {
    navigate(
      `/search?q=${searchTerm}&category=${category}&sort=${sort}&page=${page}&minPrice=${minPrice}&maxPrice=${maxPrice}&status=${status}`
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

  const renderPaginationItems = (): React.ReactNode[] => {
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
    <div className="w-full min-h-screen bg-gray-950 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 text-center">
            Search Results
          </h1>
          <div className="max-w-3xl mx-auto bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 shadow-lg">
            <div className="relative flex-grow">
              <Input
                type="text"
                placeholder="Search auctions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full mb-4 bg-gray-800/50 border-gray-700 focus:border-purple-500 text-base py-5 pl-10 pr-4"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
            <div className="flex flex-col justify-between md:flex-row items-center gap-4">
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
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filter Options</SheetTitle>
                    <SheetDescription>
                      Refine your search results
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-4 space-y-4">
                    <div>
                      <h3 className="mb-2 text-sm font-medium">Price Range</h3>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={minPrice}
                          onChange={(e) => setMinPrice(Number(e.target.value))}
                          className="w-20"
                        />
                        <span>to</span>
                        <Input
                          type="number"
                          placeholder="Max"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(Number(e.target.value))}
                          className="w-20"
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="mb-2 text-sm font-medium">Status</h3>
                      <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="upcoming">Upcoming</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="ended">Ended</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              <Button onClick={handleSearch}>
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 min-h-[14rem]">
              {searchResults.map((auction) => (
                <Card
                  key={auction._id}
                  className="overflow-hidden bg-gray-800/30 hover:shadow-lg transition-all duration-300"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardContent className="p-0">
                      <img
                        src={`http://localhost:3000/uploads/${auction.images[0]}`}
                        alt={auction.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2 truncate">
                          {auction.title}
                        </h3>
                        <p className="text-sm text-gray-400 mb-2">
                          ${auction.currentPrice.toLocaleString()}
                        </p>
                        <div className="flex justify-between items-center mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {auction.category}
                          </Badge>
                          <CountdownTimer
                            endTime={auction.endTime}
                            size="sm"
                            shortLabels
                          />
                        </div>
                        <Button
                          size="sm"
                          className="w-full bg-purple-600 hover:bg-purple-700"
                          onClick={() => navigate(`/auction/${auction._id}`)}
                        >
                          View Auction
                        </Button>
                      </div>
                    </CardContent>
                  </motion.div>
                </Card>
              ))}
            </div>

            {searchResults.length === 0 && (
              <p className="text-center text-xl text-gray-500 mt-8">
                No results found.
              </p>
            )}

            {totalPages > 1 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
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
      </div>
      <Footer />
    </div>
  );
};

export default SearchResults;
