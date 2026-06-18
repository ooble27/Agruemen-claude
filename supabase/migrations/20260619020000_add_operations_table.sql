-- Operations table for internal business tracking
CREATE TABLE public.operations (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  operation_number   INTEGER,
  product_name       TEXT        NOT NULL,
  product_emoji      TEXT        NOT NULL DEFAULT '📦',
  location           TEXT,
  operation_date     DATE,
  quantity           DECIMAL,
  quantity_unit      TEXT        NOT NULL DEFAULT 'KG',
  purchase_amount    INTEGER     NOT NULL DEFAULT 0,
  transport_amount   INTEGER     NOT NULL DEFAULT 0,
  total_sale         INTEGER     NOT NULL DEFAULT 0,
  collected_amount   INTEGER     NOT NULL DEFAULT 0,
  to_collect_amount  INTEGER     NOT NULL DEFAULT 0,
  net_profit         INTEGER     NOT NULL DEFAULT 0,
  notes              TEXT,
  status             TEXT        NOT NULL DEFAULT 'completed',
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.operations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users full access to operations" ON public.operations
  FOR ALL
  USING  (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Allow public read for the PIN-protected gestion page (no Supabase auth required)
CREATE POLICY "Public can read operations" ON public.operations
  FOR SELECT USING (true);

CREATE POLICY "Public can insert operations" ON public.operations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can update operations" ON public.operations
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Public can delete operations" ON public.operations
  FOR DELETE USING (true);

CREATE TRIGGER set_operations_updated_at
  BEFORE UPDATE ON public.operations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_operations_number ON public.operations (operation_number ASC NULLS LAST);
CREATE INDEX idx_operations_date   ON public.operations (operation_date DESC NULLS LAST);

-- ─── Seed : 4 real operations ───────────────────────────────────────────────

INSERT INTO public.operations
  (operation_number, product_name, product_emoji, location, operation_date,
   quantity, quantity_unit,
   purchase_amount, transport_amount,
   total_sale, collected_amount, to_collect_amount,
   net_profit, status, notes)
VALUES
  (
    1, 'Mangue', '🥭', 'DIOUROU (Tabaski)', NULL,
    300, 'KG',
    48000, 22000,
    90000, 90000, 0,
    30000, 'completed',
    '12 bassines × 4 000 FCFA = 48 000 FCFA achat • 300 FCFA/KG × 300 KG = 90 000 FCFA vente'
  ),
  (
    2, 'Mangue', '🥭', 'DIOUROU', NULL,
    315, 'KG',
    22000, 18000,
    55900, 30000, 25900,
    15900, 'partial',
    '9 sacs de mangue = 22 000 FCFA achat • Vente : 270 FCFA/KG → 38 800 FCFA + 100 FCFA/KG → 17 100 FCFA'
  ),
  (
    3, 'Oignons verts', '🧅', NULL, NULL,
    NULL, 'KG',
    75000, 40000,
    130000, 91500, 38500,
    15000, 'partial',
    '10 balles = 75 000 FCFA achat • Transport : 16 000 + 21 000 + 3 000 = 40 000 FCFA • Encaissé : 91 500 FCFA • Reste : 16 500 + 10 000 + 12 000 = 38 500 FCFA'
  ),
  (
    4, 'Madd', '🍈', NULL, '2026-06-14',
    NULL, 'KG',
    32000, 0,
    56000, 56000, 0,
    24000, 'completed',
    '4 sacs × 8 000 FCFA = 32 000 FCFA achat • 4 sacs × 14 000 FCFA = 56 000 FCFA vente'
  );
