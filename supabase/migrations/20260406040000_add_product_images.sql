-- Product images table (missing from original schema)
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Product images viewable by everyone" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Sellers can manage product images" ON public.product_images FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.products p JOIN public.shops s ON p.shop_id = s.id WHERE p.id = product_id AND s.seller_id = auth.uid()));
CREATE POLICY "Sellers can delete product images" ON public.product_images FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.products p JOIN public.shops s ON p.shop_id = s.id WHERE p.id = product_id AND s.seller_id = auth.uid()));

CREATE INDEX IF NOT EXISTS idx_product_images_product ON public.product_images(product_id);
