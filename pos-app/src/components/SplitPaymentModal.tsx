import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SplitPaymentModal({ isOpen, onClose, total }: { isOpen: boolean, onClose: () => void, total: number }) {
  const [cashAmount, setCashAmount] = useState<number | string>(0);
  const [mpesaAmount, setMpesaAmount] = useState<number | string>(total);

  const handleCashChange = (val: string) => {
    const num = Number(val);
    setCashAmount(num);
    setMpesaAmount(total - num > 0 ? total - num : 0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-gray-100 text-[#0D1117] sm:max-w-[425px] shadow-xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Split Payment</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-between items-center mb-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <span className="text-gray-500 font-medium">Total Due</span>
            <span className="text-2xl font-black text-[#2563EB]">KES {total.toLocaleString()}</span>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-gray-600 font-medium">Cash (KES)</Label>
            <Input 
              type="number"
              value={cashAmount} 
              onChange={(e) => handleCashChange(e.target.value)}
              className="col-span-3 bg-white border-gray-200 text-[#0D1117] focus:ring-[#2563EB] h-12 text-lg font-bold" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-gray-600 font-medium">M-Pesa (KES)</Label>
            <Input 
              type="number"
              value={mpesaAmount} 
              readOnly
              className="col-span-3 bg-gray-50 border-gray-200 text-gray-500 h-12 text-lg font-bold" 
            />
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button variant="outline" onClick={onClose} className="bg-white border-gray-200 text-gray-600 hover:bg-gray-50 font-bold rounded-xl h-11">Cancel</Button>
          <Button onClick={onClose} className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold shadow-md shadow-blue-500/20 rounded-xl h-11">Confirm Split Payment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
