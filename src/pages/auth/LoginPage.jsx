import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/auth.api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card } from '../../components/ui/card';
import { GraduationCap, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or mobile is required'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await authApi.staffLogin(data);
      const { accessToken, refreshToken, user } = response.data.data;
      login(accessToken, refreshToken, user);
      toast.success('Login successful');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">School Management</h1>
          <p className="text-muted-foreground mt-1">Staff Login</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="identifier">Email or Mobile</Label>
            <Input
              id="identifier"
              placeholder="admin@school.edu"
              {...register('identifier')}
              className="mt-1"
            />
            {errors.identifier && (
              <p className="text-sm text-red-500 mt-1">{errors.identifier.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              {...register('password')}
              className="mt-1"
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/parent-login')}
            className="text-sm text-primary hover:underline"
          >
            Parent Login (OTP)
          </button>
        </div>
      </Card>
    </div>
  );
}