import Image from 'next/image';
import Link from 'next/link';

function validarUrl(src: string): string {
  try {
    const url = new URL(src);
    return url.toString();
  } catch {
    console.warn("URL inválida en ProductCard:", src);
    return "/placeholder.webp";
  }
}

export function ProductCard({ product }: { product: any }) {
  const imageSrc =
    product.images && product.images.length > 0
      ? validarUrl(product.images[0])
      : "/placeholder.webp";

  return (
    <Link href={`/productos/${product.slug}`} className="block">
      <div className="border border-gray-200 p-4 rounded-2xl shadow-md hover:shadow-pink-300 hover:shadow-lg transition-transform duration-200 hover:-translate-y-1 bg-white">
        <div className="w-full aspect-[4/3] relative mb-3 rounded-xl overflow-hidden bg-gray-50">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            style={{ objectFit: 'contain' }}
            sizes="(max-width: 768px) 100vw, 300px"
            className="transition-opacity duration-300"
            priority={false}
            unoptimized
          />
        </div>
        <h4 className="text-lg font-semibold text-gray-800 text-center">{product.name}</h4>
      </div>
    </Link>
  );
}