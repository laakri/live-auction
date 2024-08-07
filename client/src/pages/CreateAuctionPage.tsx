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
import { useToast } from "../components/ui/use-toast";
import { format } from "date-fns";

interface AuctionFormData {
  title: string;
  description: string;
  startingPrice: number;
  currentPrice: number;
  incrementAmount: number;
  startDate: Date;
  startTime: Date;
  endDate: Date;
  endTime: Date;
  durationType: "custom" | "hours" | "days";
  durationValue: number;
  category: string;
  tags: string;
  isPrivate: boolean;
  isChatOpen: boolean;
  allowEarlyEnd: boolean;
  charity?: {
    organization: string;
    percentage: number;
  };
}

export default function CreateAuctionPage() {
  const { control, handleSubmit, watch } = useForm<AuctionFormData>({
    defaultValues: {
      startingPrice: 0,
      incrementAmount: 0,
      isPrivate: false,
      isChatOpen: true,
      allowEarlyEnd: false,
      startDate: new Date(),
      startTime: new Date(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      endTime: new Date(),
      durationType: "hours",
      durationValue: 24,
      charity: {
        organization: "",
        percentage: 0,
      },
    },
  });
  const [images, setImages] = useState<File[]>([]);
  const charityPercentage = watch("charity.percentage");
  const durationType = watch("durationType");
  const { token } = useAuthStore();
  const { toast } = useToast();

  const onSubmit = async (data: AuctionFormData) => {
    try {
      const formData = new FormData();

      // Calculate start and end times
      const startDateTime = new Date(data.startDate);
      startDateTime.setHours(
        data.startTime.getHours(),
        data.startTime.getMinutes()
      );

      let endDateTime;
      if (data.durationType === "custom") {
        endDateTime = new Date(data.endDate);
        endDateTime.setHours(
          data.endTime.getHours(),
          data.endTime.getMinutes()
        );
      } else {
        endDateTime = new Date(startDateTime.getTime());
        if (data.durationType === "hours") {
          endDateTime.setHours(endDateTime.getHours() + data.durationValue);
        } else if (data.durationType === "days") {
          endDateTime.setDate(endDateTime.getDate() + data.durationValue);
        }
      }

      // Append auction data
      Object.entries(data).forEach(([key, value]) => {
        if (
          key === "startDate" ||
          key === "endDate" ||
          key === "startTime" ||
          key === "endTime"
        ) {
          // Skip these as we're using calculated startDateTime and endDateTime
        } else if (key === "charity") {
          formData.append(key, JSON.stringify(value));
        } else if (key === "tags") {
          formData.append(
            key,
            JSON.stringify(value.split(",").map((tag: string) => tag.trim()))
          );
        } else {
          formData.append(key, value.toString());
        }
      });

      formData.append("startTime", startDateTime.toISOString());
      formData.append("endTime", endDateTime.toISOString());

      // Append images
      images.forEach((image) => {
        formData.append(`images`, image);
      });

      formData.append("currentPrice", data.startingPrice.toString());

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
      toast({
        title: "Success",
        description: "Auction created successfully",
      });
      // router.push(`/auctions/${response.data._id}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Error creating auction",
        });
        console.log(token);
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
    <div className="min-h-screen py-4 px-4 ">
      <div className="mb-2 bg-gray-800/60 p-4 rounded-xl">
        <div className="flex justify-between items-center ">
          <h2 className="text-xl font-bold">Create Your Exclusive Auction</h2>
        </div>
      </div>
      <div className="bg-gradient-to-t from-transparent to-gray-600/30 p-4 rounded-xl min-h-[calc(100vh-10rem)]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
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
              <div className="space-y-2">
                <Label>Start Time</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    name="startDate"
                    control={control}
                    rules={{ required: "Start date is required" }}
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
                  <Controller
                    name="startTime"
                    control={control}
                    rules={{ required: "Start time is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <Input
                          type="time"
                          value={format(field.value, "HH:mm")}
                          onChange={(e) => {
                            const [hours, minutes] = e.target.value
                              .split(":")
                              .map(Number);
                            const newDate = new Date(field.value);
                            newDate.setHours(hours);
                            newDate.setMinutes(minutes);
                            field.onChange(newDate);
                          }}
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
                <Label>Duration</Label>
                <Controller
                  name="durationType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hours">Hours</SelectItem>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="custom">Custom End Time</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {durationType !== "custom" && (
                  <Controller
                    name="durationValue"
                    control={control}
                    rules={{ required: "Duration is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <Input
                          type="number"
                          placeholder={`Number of ${durationType}`}
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
                )}
                {durationType === "custom" && (
                  <div className="grid grid-cols-2 gap-4">
                    <Controller
                      name="endDate"
                      control={control}
                      rules={{ required: "End date is required" }}
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
                    <Controller
                      name="endTime"
                      control={control}
                      rules={{ required: "End time is required" }}
                      render={({ field, fieldState: { error } }) => (
                        <>
                          <Input
                            type="time"
                            value={format(field.value, "HH:mm")}
                            onChange={(e) => {
                              const [hours, minutes] = e.target.value
                                .split(":")
                                .map(Number);
                              const newDate = new Date(field.value);
                              newDate.setHours(hours);
                              newDate.setMinutes(minutes);
                              field.onChange(newDate);
                            }}
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
                )}
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
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="isChatOpen">Open Chat</Label>
                  <p className="text-sm text-gray-500">
                    Allow bidders to chat during the auction
                  </p>
                </div>
                <Controller
                  name="isChatOpen"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="allowEarlyEnd">Allow Early End</Label>
                  <p className="text-sm text-gray-500">
                    Option to end the auction before the set time
                  </p>
                </div>
                <Controller
                  name="allowEarlyEnd"
                  control={control}
                  render={({ field }) => (
                    <Switch
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
                  <Controller
                    name="charity.percentage"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <Slider
                          min={0}
                          max={100}
                          step={1}
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                        />
                        <div className="text-center">{charityPercentage}%</div>
                      </div>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end mt-6">
            <Button type="submit">Create Auction</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
