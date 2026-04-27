import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { feeApi } from '@/api/fee.api';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { PAYMENT_MODES } from '@/lib/constants';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RecordPaymentPage() {
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const { register, handleSubmit, watch, reset } = useForm({
    defaultValues: { paymentMode: 'CASH', paymentDate: new Date().toISOString().split('T')[0] },
  });

  const paymentMode = watch('paymentMode');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await feeApi.recordPayment({
        ...data,
        amountPaid: parseFloat(data.amountPaid),
      });
      setReceipt(res.data.data);
      toast.success(`Payment recorded. Receipt: ${res.data.data.receiptNo}`);
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Record Payment" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Ledger Entry ID *</Label>
              <Input {...register('ledgerId')} placeholder="Paste ledger UUID" className="mt-1" />
            </div>
            <div>
              <Label>Amount *</Label>
              <Input type="number" step="0.01" {...register('amountPaid')} className="mt-1" />
            </div>
            <div>
              <Label>Payment Mode *</Label>
              <select {...register('paymentMode')} className="mt-1 w-full border rounded-md p-2">
                {PAYMENT_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <Label>Payment Date *</Label>
              <Input type="date" {...register('paymentDate')} className="mt-1" />
            </div>
            {paymentMode === 'CHEQUE' && (
              <>
                <div>
                  <Label>Cheque No</Label>
                  <Input {...register('chequeNo')} className="mt-1" />
                </div>
                <div>
                  <Label>Bank Name</Label>
                  <Input {...register('bankName')} className="mt-1" />
                </div>
              </>
            )}
            <div>
              <Label>Remarks</Label>
              <Input {...register('remarks')} className="mt-1" />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : 'Record Payment'}
            </Button>
          </form>
        </Card>

        {receipt && (
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Receipt Generated</h3>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-muted-foreground">Receipt No</span><span className="font-bold">{receipt.receiptNo}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Student</span><span>{receipt.studentName}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="font-bold text-green-600">₹{receipt.amountPaid}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Mode</span><span>{receipt.paymentMode}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span>{receipt.paymentDate}</span></div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}