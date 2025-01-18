import { WifiForm } from "@/components/WifiForm";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-center text-slate-800 mb-6">
            WiFi Settings Manager
          </h1>
          <WifiForm />
        </div>
      </div>
    </div>
  );
};

export default Index;