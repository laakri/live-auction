import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Calendar, Clock, DollarSign, Tag, Users } from "lucide-react";
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
  images: string[];
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
  const [images, setImages] = useState<string[]>([]);
  const charityPercentage = watch("charity.percentage");

  const onSubmit = (data: AuctionFormData) => {
    const formData = {
      ...data,
      images,
      tags: data.tags.split(",").map((tag) => tag.trim()),
    };
    console.log("Form Data:", formData);
  };

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
                          <SelectItem value="art">Fine Art</SelectItem>
                          <SelectItem value="jewelry">
                            Luxury Jewelry
                          </SelectItem>
                          <SelectItem value="watches">Timepieces</SelectItem>
                          <SelectItem value="cars">Classic Cars</SelectItem>
                          <SelectItem value="wine">Fine Wine</SelectItem>
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
                onChange={(urls) => setImages(urls)}
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
