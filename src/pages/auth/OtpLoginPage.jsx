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
import { GraduationCap, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const otpRequestSchema = z.object({
  identifier: z.string().min(1, 'Email or mobile is required'),
});

const otpVerifySchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export default function OtpLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState('request'); // 'request' | 'verify'
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);

  const requestForm = useForm({
    resolver: zodResolver(otpRequestSchema),
  });

  const verifyForm = useForm({
    resolver: zodResolver(otpVerifySchema),
  });

  const onRequestOtp = async (data) => {
    setLoading(true);
    try {
      await authApi.requestOtp({ identifier: data.identifier });
      setIdentifier(data.identifier);
      setStep('verify');
      toast.success('OTP sent to your email/mobile');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const onVerifyOtp = async (data) => {
    setLoading(true);
    try {
      const response = await authApi.verifyOtp({
        identifier,
        otp: data.otp,
      });
      const { accessToken, refreshToken, user } = response.data.data;
      login(accessToken, refreshToken, user);
      toast.success('Login successful');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
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
          <h1 className="text-2xl font-bold">Parent Login</h1>
          <p className="text-muted-foreground mt-1">
            {step === 'request' ? 'Enter your email or mobile' : 'Enter the OTP sent to you'}
          </p>
        </div>

        {step === 'request' ? (
          <form onSubmit={requestForm.handleSubmit(onRequestOtp)} className="space-y-4">
            <div>
              <Label htmlFor="identifier">Email or Mobile</Label>
              <Input
                id="identifier"
                placeholder="parent@email.com or 9876543210"
                {...requestForm.register('identifier')}
                className="mt-1"
              />
              {requestForm.formState.errors.identifier && (
                <p className="text-sm text-red-500 mt-1">
                  {requestForm.formState.errors.identifier.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                'Send OTP'
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={verifyForm.handleSubmit(onVerifyOtp)} className="space-y-4">
            <div>
              <Label htmlFor="otp">Enter OTP</Label>
              <Input
                id="otp"
                placeholder="123456"
                maxLength={6}
                {...verifyForm.register('otp')}
                className="mt-1 text-center text-2xl tracking-widest"
              />
              {verifyForm.formState.errors.otp && (
                <p className="text-sm text-red-500 mt-1">
                  {verifyForm.formState.errors.otp.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                OTP sent to {identifier}
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify OTP'
              )}
            </Button>

            <button
              type="button"
              onClick={() => setStep('request')}
              className="w-full text-sm text-muted-foreground hover:text-primary flex items-center justify-center gap-1"
            >
              <ArrowLeft className="h-3 w-3" /> Back
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-primary hover:underline"
          >
            Staff Login (Password)
          </button>
        </div>
      </Card>
    </div>
  );
}