
import React, { useEffect, useState } from "react";
import {
  loadCaptchaEnginge,
  LoadCanvasTemplate,
  validateCaptcha,
} from "react-simple-captcha";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { RefreshCw } from "lucide-react";

interface CaptchaFieldProps {
  onValidated: (isValid: boolean) => void;
}

const CaptchaField: React.FC<CaptchaFieldProps> = ({ onValidated }) => {
  const [userCaptcha, setUserCaptcha] = useState("");
  const [isValid, setIsValid] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadCaptchaEnginge(6); // Load captcha with 6 characters
  }, []);

  const handleValidateCaptcha = () => {
    if (!validateCaptcha(userCaptcha)) {
      toast({
        variant: "destructive",
        title: "Invalid CAPTCHA",
        description: "Please try again with the correct code",
      });
      setIsValid(false);
      onValidated(false);
      loadCaptchaEnginge(6); // Reload with new captcha
      setUserCaptcha("");
    } else {
      toast({
        title: "CAPTCHA verified",
        description: "You can now submit the form",
      });
      setIsValid(true);
      onValidated(true);
    }
  };

  const refreshCaptcha = () => {
    loadCaptchaEnginge(6);
    setUserCaptcha("");
    setIsValid(false);
    onValidated(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="captcha">Verification Code</Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={refreshCaptcha}
          type="button"
          className="h-8"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </Button>
      </div>
      
      <div className="border rounded-md p-2 mb-2 bg-white">
        <LoadCanvasTemplate />
      </div>
      
      <div className="flex gap-2">
        <Input
          id="captcha"
          value={userCaptcha}
          onChange={(e) => setUserCaptcha(e.target.value)}
          placeholder="Enter the code shown above"
          className={isValid ? "border-green-500" : ""}
        />
        <Button 
          onClick={handleValidateCaptcha} 
          type="button"
          variant="outline"
        >
          Verify
        </Button>
      </div>
    </div>
  );
};

export default CaptchaField;
