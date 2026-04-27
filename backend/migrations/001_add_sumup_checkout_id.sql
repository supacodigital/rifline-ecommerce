-- Migration 001 : ajout de sumup_checkout_id sur la table orders
-- La colonne stripe_payment_intent_id est conservée pour ne pas casser l'historique.
-- Elle sera supprimée dans une migration ultérieure après validation complète.

ALTER TABLE orders
  ADD COLUMN sumup_checkout_id VARCHAR(64) NULL DEFAULT NULL AFTER stripe_payment_intent_id;

CREATE INDEX idx_orders_sumup_checkout_id ON orders (sumup_checkout_id);
