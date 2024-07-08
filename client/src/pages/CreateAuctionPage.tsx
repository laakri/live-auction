import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { DollarSign, Tag } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Switch } from "../components/ui/switch";
import { Slider } from "../components/ui/slider";
import { ImageUpload } from "../components/image-upload";
import { DatePicker } from "../components/ui/date-picker";
import axios from "axios";
import useAuthStore from "../stores/authStore";

interface AuctionFormData {
  title: string;
  description: string;
  startingPrice: number;
  currentPrice: number;
  incrementAmount: number;
  startTime: Date;
  endTime: Date;
  category: string;
  tags: string;
  isPrivate: boolean;
  charity?: {
    organization: string;
    percentage: number;
  };
}

export default function CreateAuctionPage() {
  const { control, handleSubmit, watch } = useForm<AuctionFormData>({
    defaultValues: {
      startingPrice: 0,
      currentPrice: 0,
      incrementAmount: 0,
      isPrivate: false,
      charity: {
        organization: "",
        percentage: 0,
      },
    },
  });
  const [images, setImages] = useState<File[]>([]);
  const charityPercentage = watch("charity.percentage");
  const { token } = useAuthStore();

  const onSubmit = async (data: AuctionFormData) => {
    try {
      const formData = new FormData();

      // Append auction data
      Object.entries(data).forEach(([key, value]) => {
        if (key === "charity") {
          formData.append(key, JSON.stringify(value));
        } else if (key === "tags") {
          formData.append(
            key,
            JSON.stringify(value.split(",").map((tag: string) => tag.trim()))
          );
        } else if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else {
          formData.append(key, value.toString());
        }
      });

      // Append images
      images.forEach((image) => {
        formData.append(`images`, image);
      });

      const response = await axios.post(
        "http://localhost:3000/api/auctions/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,

            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Auction created:", response.data);
      console.log("Mriguel");
      // router.push(`/auctions/${response.data._id}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error creating auction:",
          error.response?.data || error.message
        );
      } else {
        console.error("Error creating auction:", error);
      }
    }
  };
  const categories = [
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
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-center">
          Create Your Exclusive Auction
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Auction Details</CardTitle>
              <CardDescription>
                Provide the essential information for your auction
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: "Title is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Input
                        id="title"
                        placeholder="Enter auction title"
                        {...field}
                      />
                      {error && (
                        <p className="text-red-500 text-sm">{error.message}</p>
                      )}
                    </>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Controller
                  name="description"
                  control={control}
                  rules={{ required: "Description is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Textarea
                        id="description"
                        placeholder="Describe your auction item"
                        className="min-h-[100px]"
                        {...field}
                      />
                      {error && (
                        <p className="text-red-500 text-sm">{error.message}</p>
                      )}
                    </>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startingPrice">Starting Price</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Controller
                      name="startingPrice"
                      control={control}
                      rules={{ required: "Starting price is required" }}
                      render={({ field, fieldState: { error } }) => (
                        <>
                          <Input
                            id="startingPrice"
                            type="number"
                            placeholder="0.00"
                            className="pl-10"
                            {...field}
                          />
                          {error && (
                            <p className="text-red-500 text-sm">
                              {error.message}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentPrice">Current Price</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Controller
                      name="currentPrice"
                      control={control}
                      rules={{ required: "Current price is required" }}
                      render={({ field, fieldState: { error } }) => (
                        <>
                          <Input
                            id="currentPrice"
                            type="number"
                            placeholder="0.00"
                            className="pl-10"
                            {...field}
                          />
                          {error && (
                            <p className="text-red-500 text-sm">
                              {error.message}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="incrementAmount">Bid Increment</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Controller
                      name="incrementAmount"
                      control={control}
                      rules={{ required: "Bid increment is required" }}
                      render={({ field, fieldState: { error } }) => (
                        <>
                          <Input
                            id="incrementAmount"
                            type="number"
                            placeholder="0.00"
                            className="pl-10"
                            {...field}
                          />
                          {error && (
                            <p className="text-red-500 text-sm">
                              {error.message}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Auction Timeline</CardTitle>
              <CardDescription>
                Set the duration of your auction
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Controller
                    name="startTime"
                    control={control}
                    rules={{ required: "Start time is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <DatePicker
                          value={field.value}
                          onChange={(date) => field.onChange(date)}
                        />
                        {error && (
                          <p className="text-red-500 text-sm">
                            {error.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Controller
                    name="endTime"
                    control={control}
                    rules={{ required: "End time is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <DatePicker
                          value={field.value}
                          onChange={(date) => field.onChange(date)}
                        />
                        {error && (
                          <p className="text-red-500 text-sm">
                            {error.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Category and Tags</CardTitle>
              <CardDescription>
                Classify your auction for better visibility
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: "Category is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map((cat) => (
                            <SelectItem
                              key={cat.name}
                              value={cat.name.toLowerCase()}
                            >
                              {cat.icon} {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {error && (
                        <p className="text-red-500 text-sm">{error.message}</p>
                      )}
                    </>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Controller
                    name="tags"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="tags"
                        placeholder="Enter tags separated by commas"
                        className="pl-10"
                        {...field}
                      />
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
              <CardDescription>
                Showcase your item with high-quality images
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload
                onChange={(files) => setImages(files)}
                maxImages={5}
                className="border-2 border-dashed rounded-lg p-4"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Options</CardTitle>
              <CardDescription>Fine-tune your auction settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="isPrivate">Private Auction</Label>
                  <p className="text-sm text-gray-500">
                    Only invited users can participate
                  </p>
                </div>
                <Controller
                  name="isPrivate"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="isPrivate"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label>Charity Contribution</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Controller
                    name="charity.organization"
                    control={control}
                    render={({ field }) => (
                      <Input placeholder="Charity organization" {...field} />
                    )}
                  />
                  <div className="space-y-2">
                    <Controller
                      name="charity.percentage"
                      control={control}
                      render={({ field }) => (
                        <Slider
                          min={0}
                          max={100}
                          step={1}
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                        />
                      )}
                    />
                    <p className="text-sm text-right">
                      {charityPercentage || 0}% to charity
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              Create Auction
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
