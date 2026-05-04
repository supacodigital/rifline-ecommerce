-- Migration 002 : Ajout du système de variantes produits
-- Une variante = une déclinaison d'un produit (goût, senteur, couleur…)
-- Le stock et le prix sont gérés au niveau de la variante

CREATE TABLE IF NOT EXISTS product_variants (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id    INT UNSIGNED NOT NULL,
  name          VARCHAR(255) NOT NULL,        -- ex: "Rose", "Vanille", "Bleu nuit"
  sku           VARCHAR(100) NULL,            -- surcharge le SKU parent si renseigné
  price         DECIMAL(10,2) NULL,           -- NULL = hérite du prix parent
  stock         INT NOT NULL DEFAULT 0,
  sort_order    INT NOT NULL DEFAULT 0,
  is_active     TINYINT(1) NOT NULL DEFAULT 1,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY uq_variant_sku (sku)
);

-- Snapshot de la variante choisie dans la ligne de commande
ALTER TABLE order_items
  ADD COLUMN variant_id   INT UNSIGNED NULL AFTER product_id,
  ADD COLUMN variant_name VARCHAR(255) NULL AFTER variant_id;
