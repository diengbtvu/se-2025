import Image from "next/image";
import { motion } from "framer-motion";

interface ProductCard3DProps {
  product: {
    id: number;
    name: string;
    description: string;
    features?: string[];
    image?: string;
    price: number;
    category?: string;
    inStock?: boolean;
  };
  isActive: boolean;
}

export function ProductCard3D({ product, isActive }: ProductCard3DProps) {
  return (
    <div className="relative h-64 overflow-hidden">
      <motion.div
        initial={false}
        animate={{ 
          scale: isActive ? 1.1 : 1,
          filter: isActive ? 'brightness(0.8)' : 'brightness(1)'
        }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0"
      >
        <Image
          src={product.image || "/images/default-product.jpg"}
          alt={product.name}
          fill
          className="object-cover"
        />
        {isActive && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white/90 backdrop-blur-sm rounded-lg p-4 text-center"
            >
              <div className="text-2xl mb-2">🔍</div>
              <p className="text-sm font-semibold text-gray-800">Xem chi tiết</p>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default ProductCard3D; 