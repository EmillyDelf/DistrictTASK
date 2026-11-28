import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-[85vh] flex-col items-center justify-center px-4 py-12 text-center">
      {/* Contentor da Imagem Temática */}
      <div className="relative mb-8 overflow-hidden rounded-xl border border-border shadow-xl max-w-lg w-full bg-card">
        <Image
          src="/not-found-cat.jpg"
          alt="Distrito 404 - Tributo não encontrado"
          width={600}
          height={400}
          className="w-full h-auto object-cover"
          priority
        />
      </div>

      {/* Textos Temáticos */}
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-3 text-foreground">
        Distrito 404: Página Não Encontrada
      </h1>
      
      <p className="text-muted-foreground max-w-md mb-8 text-base leading-relaxed">
        Parece que ultrapassou os limites do DistrictTASK. Que a sorte esteja a seu favor para regressar.
      </p>

      {/* Ação de Retorno */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg" className="font-medium">
          <Link href="/dashboard">
            Regressar ao DistrictTASK (Dashboard)
          </Link>
        </Button>
      </div>
    </div>
  )
}