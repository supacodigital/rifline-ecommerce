-- Migration 003 : Ajout du champ image par variante
ALTER TABLE product_variants
  ADD COLUMN image_url VARCHAR(500) NULL AFTER name;
