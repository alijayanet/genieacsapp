import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateWifiSettings } from "@/services/genieacs";

export const WifiForm = () => {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Attempting to update WiFi settings...");
      await updateWifiSettings(ssid, password);
      
      toast({
        title: "Success",
        description: "WiFi settings updated successfully",
        variant: "default",
      });
      
      // Reset form
      setSsid("");
      setPassword("");
    } catch (error) {
      console.error("Failed to update WiFi settings:", error);
      toast({
        title: "Error",
        description: "Failed to update WiFi settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="ssid">WiFi Name (SSID)</Label>
        <Input
          id="ssid"
          type="text"
          value={ssid}
          onChange={(e) => setSsid(e.target.value)}
          placeholder="Enter new WiFi name"
          required
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
          required
          minLength={8}
          className="w-full"
        />
        <p className="text-sm text-slate-500">
          Password must be at least 8 characters long
        </p>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? "Updating..." : "Update WiFi Settings"}
      </Button>
    </form>
  );
};