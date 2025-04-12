import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  Agency,
  TravelPackage,
  TravelPreference,
  Destination,
  User
} from "@shared/schema";
import { Loader2, Package, Plus, Settings, MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

// Agency profile form schema
const agencyProfileSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  description: z.string().optional(),
  websiteUrl: z.string().url("Please enter a valid URL").or(z.string().length(0)),
  phoneNumber: z.string().optional(),
});

// Travel package form schema
const travelPackageSchema = z.object({
  preferenceId: z.number().positive("Please select a travel request"),
  title: z.string().min(1, "Package title is required"),
  description: z.string().optional(),
  price: z.coerce.number().positive("Price must be greater than 0"),
  pricePerPerson: z.boolean().default(true),
  accommodation: z.string().optional(),
  transportation: z.string().optional(),
  meals: z.string().optional(),
  activities: z.string().optional(),
  additionalInfo: z.string().optional(),
  packageType: z.enum(["standard", "premium", "budget"]),
});

type AgencyProfileFormValues = z.infer<typeof agencyProfileSchema>;
type TravelPackageFormValues = z.infer<typeof travelPackageSchema>;

export default function AgencyDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [showPackageForm, setShowPackageForm] = useState(false);

  // Fetch agency profile
  const { data: agency, isLoading: isLoadingAgency } = useQuery<Agency>({
    queryKey: ["/api/my-agency"],
    enabled: user?.role === "agency",
  });

  // Fetch travel preference requests
  const { data: preferences, isLoading: isLoadingPreferences } = useQuery<TravelPreference[]>({
    queryKey: ["/api/travel-preferences"],
    enabled: user?.role === "agency",
  });

  // Fetch agency packages
  const { data: packages, isLoading: isLoadingPackages } = useQuery<TravelPackage[]>({
    queryKey: ["/api/agency-packages"],
    enabled: user?.role === "agency",
  });

  // Fetch all destinations
  const { data: destinations } = useQuery<Destination[]>({
    queryKey: ["/api/destinations"],
  });
  
  // Fetch all users (for agency to see requester info)
  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/users"],
    enabled: user?.role === "agency",
  });

  // Agency profile form
  const profileForm = useForm<AgencyProfileFormValues>({
    resolver: zodResolver(agencyProfileSchema),
    defaultValues: {
      companyName: agency?.companyName || "",
      description: agency?.description || "",
      websiteUrl: agency?.websiteUrl || "",
      phoneNumber: agency?.phoneNumber || "",
    },
  });

  // Update agency profile when data is loaded
  useEffect(() => {
    if (agency) {
      profileForm.reset({
        companyName: agency.companyName,
        description: agency.description || "",
        websiteUrl: agency.websiteUrl || "",
        phoneNumber: agency.phoneNumber || "",
      });
    }
  }, [agency, profileForm]);

  // Travel package form
  const packageForm = useForm<TravelPackageFormValues>({
    resolver: zodResolver(travelPackageSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      pricePerPerson: true,
      accommodation: "",
      transportation: "",
      meals: "",
      activities: "",
      additionalInfo: "",
      packageType: "standard",
    },
  });

  // Update agency profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: AgencyProfileFormValues) => {
      const res = await apiRequest("PATCH", "/api/my-agency", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/my-agency"] });
      toast({
        title: "Profile updated",
        description: "Your agency profile has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Create travel package mutation
  const createPackageMutation = useMutation({
    mutationFn: async (data: TravelPackageFormValues) => {
      const res = await apiRequest("POST", "/api/travel-packages", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agency-packages"] });
      setShowPackageForm(false);
      packageForm.reset();
      toast({
        title: "Package created",
        description: "Your travel package has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Creation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Submit handlers
  const onProfileSubmit = (data: AgencyProfileFormValues) => {
    updateProfileMutation.mutate(data);
  };

  const onPackageSubmit = (data: TravelPackageFormValues) => {
    createPackageMutation.mutate(data);
  };

  // Get destination name by ID
  const getDestinationName = (id: number | null | undefined) => {
    if (!id) return "Custom Trip";
    const destination = destinations?.find(d => d.id === id);
    return destination ? `${destination.name}, ${destination.country}` : "Unknown Destination";
  };
  
  // Get username by user ID
  const getUserName = (userId: number) => {
    if (!users) return "Unknown User";
    const user = users.find(u => u.id === userId);
    return user ? (user.username || user.email) : "Unknown User";
  };

  if (user?.role !== "agency") {
    return (
      <div className="container mx-auto px-4 py-16 pt-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Agency Dashboard</h1>
        <p className="text-gray-600 mb-6">This page is only accessible to travel agency accounts.</p>
        <Button onClick={() => window.location.href = "/"}>Return to Home</Button>
      </div>
    );
  }
  
  // Show agency profile creation form if agency profile doesn't exist
  if (!agency && !isLoadingAgency) {
    return (
      <div className="container mx-auto px-4 py-16 pt-24">
        <h1 className="text-3xl font-bold mb-4">Complete Your Agency Profile</h1>
        <p className="text-gray-600 mb-6">Please complete your agency profile to access the dashboard features.</p>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Agency Profile</CardTitle>
            <CardDescription>Enter your travel agency details to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                <FormField
                  control={profileForm.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={profileForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your agency and the services you offer" 
                          className="resize-none min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={profileForm.control}
                    name="websiteUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://yourwebsite.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+91 1234567890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={updateProfileMutation.isPending}>
                  {updateProfileMutation.isPending ? "Saving..." : "Save Profile"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-3xl font-bold mb-2">Agency Dashboard</h1>
      <p className="text-gray-600 mb-8">Manage your travel agency profile and packages</p>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="packages">Packages</TabsTrigger>
          <TabsTrigger value="requests">Travel Requests</TabsTrigger>
          <TabsTrigger value="profile">Agency Profile</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Packages</CardTitle>
                <CardDescription>All your created packages</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{packages?.length || 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Open Requests</CardTitle>
                <CardDescription>Travel requests awaiting packages</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {preferences?.filter(p => p.status === "pending").length || 0}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Messages</CardTitle>
                <CardDescription>Unread traveler messages</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">0</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Travel Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingPreferences ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : preferences && preferences.length > 0 ? (
                  <div className="space-y-4">
                    {preferences.slice(0, 5).map(preference => (
                      <div key={preference.id} className="flex justify-between items-center border-b pb-3">
                        <div>
                          <h4 className="font-medium">{getDestinationName(preference.destinationId)}</h4>
                          <p className="text-sm text-gray-500">
                            From: {getUserName(preference.userId)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {preference.travelers} travelers, {preference.budget ? `₹${preference.budget}` : "No budget specified"}
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            packageForm.reset({
                              preferenceId: preference.id,
                              packageType: "standard",
                              title: `${getDestinationName(preference.destinationId)} Trip`,
                              price: preference.budget || 0,
                              pricePerPerson: true,
                              description: "",
                              accommodation: "",
                              transportation: "",
                              meals: "",
                              activities: "",
                              additionalInfo: ""
                            });
                            setShowPackageForm(true);
                            setActiveTab("packages");
                          }}
                        >
                          Create Package
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No travel requests available</p>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => setActiveTab("requests")}>
                  View All Requests
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Packages</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingPackages ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : packages && packages.length > 0 ? (
                  <div className="space-y-4">
                    {packages.slice(0, 5).map(pkg => (
                      <div key={pkg.id} className="flex justify-between items-center border-b pb-3">
                        <div>
                          <h4 className="font-medium">{pkg.title}</h4>
                          <p className="text-sm text-gray-500">
                            ₹{pkg.price} {pkg.pricePerPerson ? "per person" : "total"}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No packages created yet</p>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => setActiveTab("packages")}>
                  View All Packages
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Packages Tab */}
        <TabsContent value="packages">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Your Travel Packages</h2>
            <Button onClick={() => setShowPackageForm(true)}>
              <Plus className="h-4 w-4 mr-2" /> Create Package
            </Button>
          </div>

          {showPackageForm && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Create New Travel Package</CardTitle>
                <CardDescription>Fill in the details for your new travel package</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...packageForm}>
                  <form onSubmit={packageForm.handleSubmit(onPackageSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={packageForm.control}
                        name="preferenceId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Travel Request</FormLabel>
                            <Select
                              onValueChange={(value) => field.onChange(parseInt(value))}
                              defaultValue={field.value?.toString()}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a travel request" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {preferences?.map((preference) => (
                                  <SelectItem key={preference.id} value={preference.id.toString()}>
                                    {getDestinationName(preference.destinationId)} - {preference.travelers} travelers
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Select the travel request you're creating this package for
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={packageForm.control}
                        name="packageType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Package Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select package type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="standard">Standard</SelectItem>
                                <SelectItem value="premium">Premium</SelectItem>
                                <SelectItem value="budget">Budget</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Categorize your package to help travelers compare options
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={packageForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Package Title</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Bali Explorer" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={packageForm.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" placeholder="e.g. 1500" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={packageForm.control}
                          name="pricePerPerson"
                          render={({ field }) => (
                            <FormItem className="flex flex-col items-start mt-8">
                              <div className="flex items-center space-x-2">
                                <FormControl>
                                  <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={field.onChange}
                                    className="h-4 w-4"
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">Price per person</FormLabel>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <FormField
                      control={packageForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your travel package in detail"
                              className="resize-none min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={packageForm.control}
                        name="accommodation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Accommodation</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="e.g. 4-star hotel, beach resort, etc."
                                className="resize-none min-h-[80px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={packageForm.control}
                        name="transportation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Transportation</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="e.g. Flights, airport transfers, etc."
                                className="resize-none min-h-[80px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={packageForm.control}
                        name="meals"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meals</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="e.g. Breakfast included, welcome dinner, etc."
                                className="resize-none min-h-[80px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={packageForm.control}
                        name="activities"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Activities</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="e.g. Guided tours, beach activities, etc."
                                className="resize-none min-h-[80px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={packageForm.control}
                      name="additionalInfo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Information</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any other details about your package"
                              className="resize-none min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowPackageForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createPackageMutation.isPending}>
                        {createPackageMutation.isPending ? "Creating..." : "Create Package"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {isLoadingPackages ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : packages?.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent className="pt-6">
                <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium">No packages created yet</h3>
                <p className="text-gray-500 mt-2">
                  Start by creating your first travel package to offer to travelers.
                </p>
                <Button className="mt-6" onClick={() => setShowPackageForm(true)}>
                  Create Your First Package
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages?.map((pkg) => (
                <Card key={pkg.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{pkg.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {pkg.packageType ? `${pkg.packageType.charAt(0).toUpperCase() + pkg.packageType.slice(1)} Package` : "Standard Package"}
                        </CardDescription>
                      </div>
                      <div className="text-lg font-bold">
                        ₹{pkg.price}
                        <span className="text-xs text-gray-500 ml-1">
                          {pkg.pricePerPerson ? "/person" : "total"}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pkg.description && (
                        <p className="text-sm text-gray-600">{pkg.description}</p>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {pkg.accommodation && (
                          <div>
                            <p className="font-medium">Accommodation</p>
                            <p className="text-gray-600">{pkg.accommodation}</p>
                          </div>
                        )}
                        
                        {pkg.transportation && (
                          <div>
                            <p className="font-medium">Transportation</p>
                            <p className="text-gray-600">{pkg.transportation}</p>
                          </div>
                        )}
                        
                        {pkg.meals && (
                          <div>
                            <p className="font-medium">Meals</p>
                            <p className="text-gray-600">{pkg.meals}</p>
                          </div>
                        )}
                        
                        {pkg.activities && (
                          <div>
                            <p className="font-medium">Activities</p>
                            <p className="text-gray-600">{pkg.activities}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Created on {pkg.createdAt ? format(new Date(pkg.createdAt), "MMM d, yyyy") : "Unknown date"}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex space-x-2 w-full">
                      <Button variant="outline" className="flex-1">
                        <Settings className="h-4 w-4 mr-2" /> Edit
                      </Button>
                      <Button className="flex-1">
                        <MessageSquare className="h-4 w-4 mr-2" /> Message Traveler
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Travel Requests Tab */}
        <TabsContent value="requests">
          <h2 className="text-xl font-semibold mb-6">Travel Requests</h2>
          
          {isLoadingPreferences ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : preferences?.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium">No travel requests available</h3>
                <p className="text-gray-500 mt-2">
                  Travel requests will appear here when travelers create them.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {preferences?.map((preference) => (
                <Card key={preference.id}>
                  <CardHeader>
                    <CardTitle>{getDestinationName(preference.destinationId)}</CardTitle>
                    <CardDescription>
                      Requested by: {getUserName(preference.userId)}
                    </CardDescription>
                    <CardDescription>
                      Status: <span className="capitalize">{preference.status}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="font-medium text-sm">Travel Dates</p>
                        <p className="text-sm text-gray-600">
                          {preference.startDate && preference.endDate
                            ? `${format(new Date(preference.startDate), "MMM d, yyyy")} - ${format(new Date(preference.endDate), "MMM d, yyyy")}`
                            : "Not specified"}
                        </p>
                      </div>
                      
                      <div>
                        <p className="font-medium text-sm">Travelers</p>
                        <p className="text-sm text-gray-600">{preference.travelers} people</p>
                      </div>
                      
                      <div>
                        <p className="font-medium text-sm">Budget</p>
                        <p className="text-sm text-gray-600">
                          {preference.budget ? `₹${preference.budget}` : "Not specified"}
                        </p>
                      </div>
                      
                      {'additionalDestination' in preference && preference.additionalDestination && (
                        <div>
                          <p className="font-medium text-sm">Additional Destination</p>
                          <p className="text-sm text-gray-600">{String(preference.additionalDestination)}</p>
                        </div>
                      )}
                      
                      {'specialRequests' in preference && preference.specialRequests && (
                        <div>
                          <p className="font-medium text-sm">Special Requests</p>
                          <p className="text-sm text-gray-600">{String(preference.specialRequests)}</p>
                        </div>
                      )}
                      
                      {'preferences' in preference && preference.preferences ? (
                        <div>
                          <p className="font-medium text-sm">Additional Preferences</p>
                          <p className="text-sm text-gray-600">
                            {(() => {
                              if (typeof preference.preferences === 'string') return preference.preferences;
                              if (typeof preference.preferences === 'object') return JSON.stringify(preference.preferences);
                              return String(preference.preferences);
                            })()}
                          </p>
                        </div>
                      ) : null}
                      
                      <div className="text-xs text-gray-500">
                        Requested on {preference.createdAt ? format(new Date(preference.createdAt), "MMM d, yyyy") : "Unknown date"}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="space-x-2 w-full">
                      <Button 
                        className="w-full"
                        onClick={() => {
                          // Pre-populate form with request details
                          packageForm.reset({
                            preferenceId: preference.id,
                            packageType: "standard",
                            title: `${getDestinationName(preference.destinationId)} Trip`,
                            price: preference.budget || 0,
                            pricePerPerson: true,
                            description: "",
                            accommodation: "",
                            transportation: "",
                            meals: "",
                            activities: "",
                            additionalInfo: preference.specialRequests || ""
                          });
                          setShowPackageForm(true);
                          setActiveTab("packages");
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" /> Create Custom Package
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Agency Profile Tab */}
        <TabsContent value="profile">
          <h2 className="text-xl font-semibold mb-6">Agency Profile</h2>
          
          {isLoadingAgency ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>
                  Update your agency information visible to travelers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <FormField
                      control={profileForm.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your travel agency name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your travel agency and the services you offer"
                              className="resize-none min-h-[150px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            This description will be shown to travelers to help them choose your agency
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={profileForm.control}
                        name="websiteUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://youragency.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 (555) 123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={updateProfileMutation.isPending || !profileForm.formState.isDirty}
                      >
                        {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
