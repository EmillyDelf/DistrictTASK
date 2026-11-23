import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="mb-4 h-8 w-8 animate-spin text-gray-700" />

          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            Carregando...
          </h2>

          <p className="text-center text-sm text-gray-500">
            Por favor, aguarde enquanto preparamos tudo para você.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
