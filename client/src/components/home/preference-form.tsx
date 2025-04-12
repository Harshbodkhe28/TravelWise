import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { insertTravelPreferenceSchema } from '@shared/schema';
import { DESTINATIONS } from '@/lib/constants';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Users, IndianRupee } from 'lucide-react';

// Extend the schema for client-side validation
const preferenceFormSchema = z.object({
  destinationId: z.coerce.number().min(1, 'Please select a destination'),
  additionalDestination: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  travelers: z.coerce.number().min(1, 'At least 1 traveler required'),
  budget: z.coerce.number().min(0).optional(),
  specialRequests: z.string().optional(),
});

type PreferenceFormValues = z.infer<typeof preferenceFormSchema>;

export default function PreferenceForm() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const form = useForm<PreferenceFormValues>({
    resolver: zodResolver(preferenceFormSchema),
    defaultValues: {
      travelers: 2,
      budget: undefined,
      additionalDestination: "",
      specialRequests: "",
    },
  });

  const submitPreference = useMutation({
    mutationFn: async (data: PreferenceFormValues) => {
      // Convert dates to ISO strings for proper serialization
      const formattedData = {
        ...data,
        userId: user?.id,
        startDate: data.startDate ? (data.startDate instanceof Date ? data.startDate.toISOString() : undefined) : undefined,
        endDate: data.endDate ? (data.endDate instanceof Date ? data.endDate.toISOString() : undefined) : undefined,
      };
      return await apiRequest('POST', '/api/travel-preferences', formattedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/travel-preferences'] });
      toast({
        title: 'Success!',
        description: 'Your request has been submitted. A travel agency will get back to you soon with your preferred destination itinerary.',
      });
      navigate('/my-trips');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit preferences',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (values: PreferenceFormValues) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in or sign up to continue',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    // Make sure dates are proper Date objects (not strings)
    const formattedValues = {
      ...values,
      startDate: values.startDate instanceof Date ? values.startDate : undefined,
      endDate: values.endDate instanceof Date ? values.endDate : undefined
    };

    submitPreference.mutate(formattedValues);
  };

  // Update date range in form when calendar selection changes
  const onCalendarSelect = (range: { from: Date; to?: Date }) => {
    setDateRange({
      from: range.from,
      to: range.to,
    });
    
    form.setValue('startDate', range.from);
    if (range.to) form.setValue('endDate', range.to);
  };

  return (
    <section id="preference-form" className="relative -mt-8 md:-mt-14 container mx-auto px-4">
      <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
        <h2 className="text-xl font-semibold mb-6">Customize your travel plan according to your preferences</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FormField
                control={form.control}
                name="destinationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Destination</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white border border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                          <SelectValue placeholder="Select destination" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DESTINATIONS.map((destination, index) => (
                          <SelectItem key={destination.value} value={(index + 17).toString()}>
                            {destination.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="additionalDestination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Additional Destination</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Any other places you'd like to visit"
                        className="bg-white border border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Travel Dates</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal border border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        {dateRange.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "MMM d, yyyy")} - {format(dateRange.to, "MMM d, yyyy")}
                            </>
                          ) : (
                            format(dateRange.from, "MMM d, yyyy")
                          )
                        ) : (
                          <span className="text-gray-500">Select travel dates</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={(range: any) => {
                        if (range?.from) onCalendarSelect(range);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
              
              <FormField
                control={form.control}
                name="travelers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Travelers</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          className="bg-white border border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary pl-3 pr-9"
                          {...field}
                        />
                      </FormControl>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                        <Users className="h-4 w-4" />
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Budget (₹)</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="100"
                          placeholder="Your budget"
                          className="bg-white border border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary pl-3 pr-9"
                          {...field}
                        />
                      </FormControl>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                        <IndianRupee className="h-4 w-4" />
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="specialRequests"
                render={({ field }) => (
                  <FormItem className="lg:col-span-2">
                    <FormLabel className="text-sm font-medium text-gray-700">Special Requests</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Any special requirements or preferences"
                        className="bg-white border border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button 
                type="submit" 
                className="bg-secondary hover:bg-opacity-90 text-white px-6 py-2 rounded-md font-medium transition duration-200"
                disabled={submitPreference.isPending}
              >
                {submitPreference.isPending ? "Submitting..." : (
                  <>
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Submit to Travel Agencies
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
}
