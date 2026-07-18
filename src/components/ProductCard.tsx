import Link from "next/link";
import { mvr, stockStatus } from "@/lib/format";

type P = {
  slug: string;
  title: string;
  priceMvr: number;
  genre: string;
  coverImage: string;
  stock: number;
  lowStockAt: number;
  featured?: boolean;
};

export function ProductCard(p: P) {
  const st = stockStatus(p.stock, p.lowStockAt);
  return (
    <Link href={`/shop/${p.slug}`} className="card">
      <div className="cover">
        {p.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.coverImage} alt={p.title} />
        ) : (
          <div className="ph">🎮</div>
        )}
      </div>
      <div className="body">
        <div className="row between">
          <span className={`badge ${st.tone} dot`}>{st.label}</span>
          {p.featured && <span className="badge featured">★ Featured</span>}
        </div>
        <div className="title">{p.title}</div>
        <div className="genre">{p.genre || "PS5"}</div>
        <div className="price">{mvr(p.priceMvr)}</div>
      </div>
    </Link>
  );
}
