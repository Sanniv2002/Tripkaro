'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { fetchUserDetails, updateUser } from '@/app/actions/user';
import { useCallback, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: 'Username must be at least 2 characters.',
    })
    .max(30, {
      message: 'Username must not be longer than 30 characters.',
    }),
});

interface User {
  id: string;
  name: string | null;
  email: string | null;
  avatar: string | null;
  viewName: string | null;
}

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false); // State for loading
  const { toast } = useToast()

  const fetchUser = useCallback(async () => {
    const { success, user } = await fetchUserDetails();
    if (success && user) {
      setUser(user);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, []);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: user?.viewName || '', // Default value if user data is not yet available
    },
  });

  useEffect(() => {
    if (user) {
      form.setValue('username', user.viewName || ''); // Dynamically update form values
    }
  }, [user, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (user) {
      setLoading(true); // Set loading to true when starting the request
      const updatedUser = await updateUser(data.username);
      if (updatedUser.success) {
        toast({
          title: 'Profile updated successfully',
          description: 'Your profile has been updated.',
        })
      }
      setLoading(false); // Set loading to false when request completes
    }
  };

  // Show loading state or form if user data is fetched
  if (!user) {
    return <div className="flex justify-center"><svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("animate-spin")}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg></div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your profile information.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Profile'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
