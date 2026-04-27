-- Table pour les tokens de réinitialisation de mot de passe
-- Le token brut est envoyé par email ; seul son hash SHA-256 est stocké en base

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id         INT          NOT NULL AUTO_INCREMENT,
  user_id    INT UNSIGNED NOT NULL,
  token_hash VARCHAR(64)  NOT NULL,
  expires_at DATETIME     NOT NULL,
  used_at    DATETIME     NULL DEFAULT NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_token_hash (token_hash),
  KEY idx_user_id (user_id),
  CONSTRAINT fk_prt_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
