type P = {
  action: (formData: FormData) => void;
  product?: {
    title: string;
    slug: string;
    sku: string;
    description: string;
    priceMvr: number;
    genre: string;
    condition: string;
    coverImage: string;
    stock: number;
    lowStockAt: number;
    published: boolean;
    featured: boolean;
  };
  error?: string;
};

export function ProductForm({ action, product, error }: P) {
  const isEdit = !!product;
  return (
    <form action={action} className="stack" style={{ maxWidth: 620 }}>
      {error && <div className="flash err">{error}</div>}

      <div className="panel">
        <div className="field">
          <label>Title *</label>
          <input name="title" required defaultValue={product?.title} placeholder="EA Sports FC 25" />
        </div>
        <div className="row" style={{ gap: 14 }}>
          <div className="field grow">
            <label>Slug (URL)</label>
            <input name="slug" defaultValue={product?.slug} placeholder={product ? "" : "auto from title"} />
          </div>
          <div className="field grow">
            <label>SKU</label>
            <input name="sku" defaultValue={product?.sku} placeholder="auto if blank" />
          </div>
        </div>
        <div className="field">
          <label>Description</label>
          <textarea name="description" defaultValue={product?.description} placeholder="About the game…" />
        </div>
        <div className="field">
          <label>Cover image URL</label>
          <input name="coverImage" defaultValue={product?.coverImage} placeholder="https://…/cover.jpg" />
        </div>
      </div>

      <div className="panel">
        <div className="row" style={{ gap: 14 }}>
          <div className="field grow">
            <label>Price (MVR) *</label>
            <input name="priceMvr" type="number" min="0" required defaultValue={product?.priceMvr} placeholder="1200" />
          </div>
          <div className="field grow">
            <label>Genre / Category</label>
            <input name="genre" defaultValue={product?.genre} placeholder="Sports, Action…" />
          </div>
          <div className="field grow">
            <label>Condition</label>
            <select name="condition" defaultValue={product?.condition || "New"}>
              <option value="New">New</option>
              <option value="Pre-owned">Pre-owned</option>
            </select>
          </div>
        </div>
        <div className="row" style={{ gap: 14 }}>
          {!isEdit && (
            <div className="field grow">
              <label>Initial stock</label>
              <input name="stock" type="number" min="0" defaultValue={0} />
            </div>
          )}
          <div className="field grow">
            <label>Low-stock alert at</label>
            <input name="lowStockAt" type="number" min="0" defaultValue={product?.lowStockAt ?? 3} />
          </div>
        </div>
        {isEdit && (
          <p className="muted" style={{ fontSize: 13, margin: 0 }}>
            Adjust stock quantity below the form after saving.
          </p>
        )}
      </div>

      <div className="panel">
        <label className="row" style={{ gap: 10, marginBottom: 12 }}>
          <input type="checkbox" name="published" defaultChecked={product ? product.published : true} style={{ width: "auto" }} />
          <span>Published (visible in store)</span>
        </label>
        <label className="row" style={{ gap: 10 }}>
          <input type="checkbox" name="featured" defaultChecked={product?.featured} style={{ width: "auto" }} />
          <span>Featured on homepage</span>
        </label>
      </div>

      <div className="row" style={{ gap: 12 }}>
        <button className="btn" type="submit">{isEdit ? "Save changes" : "Create game"}</button>
      </div>
    </form>
  );
}
