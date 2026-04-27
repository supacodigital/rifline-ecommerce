-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:8889
-- Généré le : dim. 12 avr. 2026 à 14:13
-- Version du serveur : 8.0.40
-- Version de PHP : 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `ecommerce_dev`
--

-- --------------------------------------------------------

--
-- Structure de la table `addresses`
--

CREATE TABLE `addresses` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED NOT NULL,
  `label` varchar(100) DEFAULT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `address_line1` varchar(255) NOT NULL,
  `address_line2` varchar(255) DEFAULT NULL,
  `city` varchar(100) NOT NULL,
  `postal_code` varchar(20) NOT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country_code` char(2) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

CREATE TABLE `categories` (
  `id` int UNSIGNED NOT NULL,
  `name_fr` varchar(150) NOT NULL,
  `name_en` varchar(150) NOT NULL,
  `slug` varchar(150) NOT NULL,
  `description_fr` text,
  `description_en` text,
  `image_url` varchar(500) DEFAULT NULL,
  `sort_order` int UNSIGNED NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `categories`
--

INSERT INTO `categories` (`id`, `name_fr`, `name_en`, `slug`, `description_fr`, `description_en`, `image_url`, `sort_order`, `is_active`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Parfums', 'Parfums', 'parfums', '', '', NULL, 0, 1, '2026-04-10 14:54:37', '2026-04-10 23:15:09', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `coupons`
--

CREATE TABLE `coupons` (
  `id` int UNSIGNED NOT NULL,
  `code` varchar(50) NOT NULL,
  `type` enum('percent','fixed') NOT NULL,
  `value` decimal(10,2) NOT NULL,
  `min_order_amount` decimal(10,2) DEFAULT NULL,
  `max_uses` int UNSIGNED DEFAULT NULL,
  `used_count` int UNSIGNED NOT NULL DEFAULT '0',
  `starts_at` datetime DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `currencies`
--

CREATE TABLE `currencies` (
  `id` int UNSIGNED NOT NULL,
  `code` char(3) NOT NULL,
  `name` varchar(100) NOT NULL,
  `symbol` varchar(10) NOT NULL,
  `rate_vs_eur` decimal(10,6) NOT NULL DEFAULT '1.000000',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `currencies`
--

INSERT INTO `currencies` (`id`, `code`, `name`, `symbol`, `rate_vs_eur`, `is_active`, `updated_at`) VALUES
(1, 'EUR', 'Euro', '€', 1.000000, 1, '2026-04-11 13:25:12'),
(2, 'USD', 'Dollar américain', '$', 1.080000, 1, '2026-04-11 13:25:19'),
(3, 'CHF', 'Franc suisse', 'CHF', 0.960000, 1, '2026-04-11 13:25:29');

-- --------------------------------------------------------

--
-- Structure de la table `orders`
--

CREATE TABLE `orders` (
  `id` int UNSIGNED NOT NULL,
  `order_number` varchar(50) NOT NULL,
  `user_id` int UNSIGNED NOT NULL,
  `shipping_first_name` varchar(100) NOT NULL,
  `shipping_last_name` varchar(100) NOT NULL,
  `shipping_address1` varchar(255) NOT NULL,
  `shipping_address2` varchar(255) DEFAULT NULL,
  `shipping_city` varchar(100) NOT NULL,
  `shipping_postal` varchar(20) NOT NULL,
  `shipping_state` varchar(100) DEFAULT NULL,
  `shipping_country` char(2) NOT NULL,
  `shipping_phone` varchar(30) DEFAULT NULL,
  `subtotal_eur` decimal(10,2) NOT NULL,
  `discount_eur` decimal(10,2) NOT NULL DEFAULT '0.00',
  `shipping_cost_eur` decimal(10,2) NOT NULL DEFAULT '0.00',
  `total_eur` decimal(10,2) NOT NULL,
  `currency_code` char(3) NOT NULL DEFAULT 'EUR',
  `currency_rate` decimal(10,6) NOT NULL DEFAULT '1.000000',
  `coupon_code` varchar(50) DEFAULT NULL,
  `shipping_method_id` varchar(100) DEFAULT NULL,
  `service_point_id` varchar(100) DEFAULT NULL,
  `service_point_name` varchar(255) DEFAULT NULL,
  `service_point_address` varchar(255) DEFAULT NULL,
  `status` enum('pending','paid','processing','shipped','delivered','cancelled','refunded') NOT NULL DEFAULT 'pending',
  `stripe_payment_intent_id` varchar(255) DEFAULT NULL,
  `sumup_checkout_id` varchar(64) DEFAULT NULL,
  `shipengine_shipment_id` varchar(255) DEFAULT NULL,
  `tracking_number` varchar(255) DEFAULT NULL,
  `carrier` varchar(100) DEFAULT NULL,
  `label_url` varchar(500) DEFAULT NULL,
  `shipped_at` datetime DEFAULT NULL,
  `delivered_at` datetime DEFAULT NULL,
  `notes` text,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `orders`
--

INSERT INTO `orders` (`id`, `order_number`, `user_id`, `shipping_first_name`, `shipping_last_name`, `shipping_address1`, `shipping_address2`, `shipping_city`, `shipping_postal`, `shipping_state`, `shipping_country`, `shipping_phone`, `subtotal_eur`, `discount_eur`, `shipping_cost_eur`, `total_eur`, `currency_code`, `currency_rate`, `coupon_code`, `shipping_method_id`, `service_point_id`, `service_point_name`, `service_point_address`, `status`, `stripe_payment_intent_id`, `sumup_checkout_id`, `shipengine_shipment_id`, `tracking_number`, `carrier`, `label_url`, `shipped_at`, `delivered_at`, `notes`, `created_at`, `updated_at`) VALUES
(1, 'ORD-1775906108423-0D66EF', 1, 'Supaco', 'Digital', '1b Rue de la Prairie', NULL, 'Saint-Genis-Pouilly', '01630', NULL, 'FR', '0783052412', 60.00, 0.00, 4.90, 64.90, 'EUR', 1.000000, NULL, NULL, NULL, NULL, NULL, 'pending', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-11 13:15:08', '2026-04-11 13:15:08'),
(2, 'ORD-1775906168541-01DCF5', 1, 'Supaco', 'Digital', '1b Rue de la Prairie', NULL, 'Saint-Genis-Pouilly', '01630', NULL, 'FR', '0783052412', 60.00, 0.00, 4.90, 64.90, 'EUR', 1.000000, NULL, NULL, NULL, NULL, NULL, 'pending', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-11 13:16:08', '2026-04-11 13:16:08'),
(3, 'ORD-1775906191402-576B71', 1, 'Supaco', 'Digital', '1b Rue de la Prairie', NULL, 'Saint-Genis-Pouilly', '01630', NULL, 'FR', '0783052412', 60.00, 0.00, 9.90, 69.90, 'EUR', 1.000000, NULL, NULL, NULL, NULL, NULL, 'pending', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-11 13:16:31', '2026-04-11 13:16:31'),
(4, 'ORD-1775906209405-1617D1', 1, 'Supaco', 'Digital', '1b Rue de la Prairie', NULL, 'Saint-Genis-Pouilly', '01630', NULL, 'FR', '0783052412', 60.00, 0.00, 9.90, 69.90, 'EUR', 1.000000, NULL, NULL, NULL, NULL, NULL, 'pending', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-11 13:16:49', '2026-04-11 13:16:49'),
(5, 'ORD-1775906390935-5CD78C', 1, 'Supaco', 'Digital', '1b Rue de la Prairie', NULL, 'Saint-Genis-Pouilly', '01630', NULL, 'FR', '0783052412', 20.00, 0.00, 4.90, 24.90, 'EUR', 1.000000, NULL, NULL, NULL, NULL, NULL, 'pending', 'pi_3TKzZrIVAdbyXDlk1VXsoHFp', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-11 13:19:50', '2026-04-11 13:19:51'),
(6, 'ORD-1775906551307-0D8DFE', 1, 'Supaco', 'Digital', '1b Rue de la Prairie', NULL, 'Saint-Genis-Pouilly', '01630', NULL, 'FR', '0783052412', 20.00, 0.00, 4.90, 24.90, 'EUR', 1.000000, NULL, NULL, NULL, NULL, NULL, 'pending', 'pi_3TKzcRIVAdbyXDlk0FZLJaOM', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-11 13:22:31', '2026-04-11 13:22:31'),
(7, 'ORD-1775906869154-69D94B', 1, 'Supaco', 'Digital', '1b Rue de la Prairie', NULL, 'Saint-Genis-Pouilly', '01630', NULL, 'FR', '0783052412', 20.00, 0.00, 4.90, 24.90, 'EUR', 1.000000, NULL, NULL, NULL, NULL, NULL, 'paid', 'pi_3TKzhZIVAdbyXDlk0IRT8AXT', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-11 13:27:49', '2026-04-11 13:28:03'),
(8, 'ORD-1775907464369-582D78', 1, 'Supaco', 'Digital', '1b Rue de la Prairie', NULL, 'Saint-Genis-Pouilly', '01630', NULL, 'FR', '0783052412', 20.00, 0.00, 3.49, 23.49, 'EUR', 1.000000, NULL, NULL, NULL, NULL, NULL, 'pending', 'pi_3TKzrAIVAdbyXDlk1OVikhvd', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-11 13:37:44', '2026-04-11 13:37:44'),
(9, 'ORD-1775908381518-39FC0C', 1, 'Supaco', 'Digital', '1b Rue de la Prairie', NULL, 'Saint-Genis-Pouilly', '01630', NULL, 'FR', '0783052412', 20.00, 0.00, 4.99, 24.99, 'EUR', 1.000000, NULL, NULL, NULL, NULL, NULL, 'paid', 'pi_3TL05xIVAdbyXDlk2BQIej0r', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-11 13:53:01', '2026-04-11 13:54:38');

-- --------------------------------------------------------

--
-- Structure de la table `order_items`
--

CREATE TABLE `order_items` (
  `id` int UNSIGNED NOT NULL,
  `order_id` int UNSIGNED NOT NULL,
  `product_id` int UNSIGNED NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `product_sku` varchar(100) DEFAULT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `quantity` int UNSIGNED NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_name`, `product_sku`, `unit_price`, `quantity`, `subtotal`, `created_at`) VALUES
(1, 1, 1, 'Fakhar Lattafa', 'FAKH', 20.00, 3, 60.00, '2026-04-11 13:15:08'),
(2, 2, 1, 'Fakhar Lattafa', 'FAKH', 20.00, 3, 60.00, '2026-04-11 13:16:08'),
(3, 3, 1, 'Fakhar Lattafa', 'FAKH', 20.00, 3, 60.00, '2026-04-11 13:16:31'),
(4, 4, 1, 'Fakhar Lattafa', 'FAKH', 20.00, 3, 60.00, '2026-04-11 13:16:49'),
(5, 5, 1, 'Fakhar Lattafa', 'FAKH', 20.00, 1, 20.00, '2026-04-11 13:19:50'),
(6, 6, 1, 'Fakhar Lattafa', 'FAKH', 20.00, 1, 20.00, '2026-04-11 13:22:31'),
(7, 7, 1, 'Fakhar Lattafa', 'FAKH', 20.00, 1, 20.00, '2026-04-11 13:27:49'),
(8, 8, 1, 'Fakhar Lattafa', 'FAKH', 20.00, 1, 20.00, '2026-04-11 13:37:44'),
(9, 9, 1, 'Fakhar Lattafa', 'FAKH', 20.00, 1, 20.00, '2026-04-11 13:53:01');

-- --------------------------------------------------------

--
-- Structure de la table `products`
--

CREATE TABLE `products` (
  `id` int UNSIGNED NOT NULL,
  `category_id` int UNSIGNED NOT NULL,
  `name_fr` varchar(255) NOT NULL,
  `name_en` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description_fr` text,
  `description_en` text,
  `price` decimal(10,2) NOT NULL,
  `stock` int UNSIGNED NOT NULL DEFAULT '0',
  `sku` varchar(100) DEFAULT NULL,
  `weight_grams` int UNSIGNED DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `products`
--

INSERT INTO `products` (`id`, `category_id`, `name_fr`, `name_en`, `slug`, `description_fr`, `description_en`, `price`, `stock`, `sku`, `weight_grams`, `is_active`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 'Fakhar Lattafa', 'Fakhar Lattafa', 'fakhar-lattafa', 'Le parfum qui attire tous les regards ✨\nUn parfum luxueux, longue tenue et hyper élégant.\nNotes sucrées, florales et légèrement fruitées : un mélange séduisant qui reste sur la peau toute la journée.\n💎 Top notes : grenade, fruits rouges\n🌸 Heart notes : jasmin, fleurs blanches\n💛 Base notes : musc, vanille, ambre\n⭐ Idéal pour soirée, mariage, sorties ou cadeau\n⭐ Parfum intense, classe et très apprécié\n⭐ Look 100% Dubai style\n📦 Disponible maintenant\n💨 Envoi rapide\n🔥 Rapport qualité prix imbattable', '', 20.00, 83, 'FAKH', 3, 1, '2026-04-10 14:54:55', '2026-04-11 13:53:01', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `product_images`
--

CREATE TABLE `product_images` (
  `id` int UNSIGNED NOT NULL,
  `product_id` int UNSIGNED NOT NULL,
  `url` varchar(500) NOT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `sort_order` int UNSIGNED NOT NULL DEFAULT '0',
  `is_cover` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `url`, `alt_text`, `sort_order`, `is_cover`, `created_at`) VALUES
(1, 1, '/uploads/products/1775855616384-76548.jpeg', NULL, 0, 1, '2026-04-10 23:13:36');

-- --------------------------------------------------------

--
-- Structure de la table `product_tags`
--

CREATE TABLE `product_tags` (
  `id` int UNSIGNED NOT NULL,
  `product_id` int UNSIGNED NOT NULL,
  `tag` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `refresh_tokens`
--

CREATE TABLE `refresh_tokens` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED NOT NULL,
  `token_hash` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `refresh_tokens`
--

INSERT INTO `refresh_tokens` (`id`, `user_id`, `token_hash`, `expires_at`, `created_at`) VALUES
(5, 1, '97f42e5a936f9e32332b5c50c568a58ae3408d6988b623e488c2abcbdf3f674f', '2026-04-17 21:06:23', '2026-04-10 23:06:22'),
(20, 1, '89609d5e4b4ca117f779fb0b0501e1ef8b1bca70a04f04195b22c6738f2dfb2f', '2026-04-18 12:04:35', '2026-04-11 14:04:34');

-- --------------------------------------------------------

--
-- Structure de la table `reviews`
--

CREATE TABLE `reviews` (
  `id` int UNSIGNED NOT NULL,
  `product_id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED NOT NULL,
  `order_id` int UNSIGNED DEFAULT NULL,
  `rating` tinyint UNSIGNED NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `body` text,
  `is_approved` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `shipping_rates`
--

CREATE TABLE `shipping_rates` (
  `id` int UNSIGNED NOT NULL,
  `zone_id` int UNSIGNED NOT NULL,
  `carrier` varchar(100) NOT NULL,
  `service_name` varchar(150) NOT NULL,
  `min_weight_g` int UNSIGNED NOT NULL DEFAULT '0',
  `max_weight_g` int UNSIGNED DEFAULT NULL,
  `price_eur` decimal(10,2) NOT NULL,
  `estimated_days` tinyint UNSIGNED DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `shipping_zones`
--

CREATE TABLE `shipping_zones` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `country_codes` text NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int UNSIGNED NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `role` enum('customer','admin') NOT NULL DEFAULT 'customer',
  `is_verified` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `first_name`, `last_name`, `phone`, `role`, `is_verified`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'admin@rifline.com', '$2a$12$3rO1rm8B5Xpxv4qy/FO0gu6bNytNlL5gGhngKr9xaYNNqp6UawCyi', 'Admin', 'Rif Line', NULL, 'admin', 1, '2026-04-10 14:47:44', '2026-04-10 14:47:44', NULL),
(2, 'supacodigital@gmail.com', '$2a$12$rTNAR1IamIK2W/WyGMsmKOVZmWfqiMqGbUpPRvN9oCLdYpEkx2BJS', 'supaco', 'digital', NULL, 'customer', 0, '2026-04-10 22:55:04', '2026-04-10 22:55:04', NULL),
(3, 'kevinkhek@gmail.com', '$2a$12$pEuQZ50w2/nULCxkibKm6O1qDuhyPVzprSYkVyySaCWzC5lY9Y8F.', 'kevin', 'khek', NULL, 'customer', 0, '2026-04-11 00:04:57', '2026-04-11 00:04:57', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `wishlists`
--

CREATE TABLE `wishlists` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED NOT NULL,
  `product_id` int UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `wishlists`
--

INSERT INTO `wishlists` (`id`, `user_id`, `product_id`, `created_at`) VALUES
(1, 2, 1, '2026-04-10 23:04:22');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Index pour la table `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Index pour la table `currencies`
--
ALTER TABLE `currencies`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Index pour la table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_number` (`order_number`),
  ADD UNIQUE KEY `stripe_payment_intent_id` (`stripe_payment_intent_id`),
  ADD KEY `idx_orders_user` (`user_id`),
  ADD KEY `idx_orders_status` (`status`),
  ADD KEY `idx_orders_number` (`order_number`),
  ADD KEY `idx_orders_sumup_checkout_id` (`sumup_checkout_id`);

--
-- Index pour la table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `idx_order_items_order` (`order_id`);

--
-- Index pour la table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD KEY `idx_products_category` (`category_id`),
  ADD KEY `idx_products_slug` (`slug`),
  ADD KEY `idx_products_active` (`is_active`,`deleted_at`);

--
-- Index pour la table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Index pour la table `product_tags`
--
ALTER TABLE `product_tags`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Index pour la table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token_hash` (`token_hash`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_review` (`user_id`,`product_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `idx_reviews_product` (`product_id`);

--
-- Index pour la table `shipping_rates`
--
ALTER TABLE `shipping_rates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `zone_id` (`zone_id`);

--
-- Index pour la table `shipping_zones`
--
ALTER TABLE `shipping_zones`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `wishlists`
--
ALTER TABLE `wishlists`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_wishlist` (`user_id`,`product_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `idx_wishlists_user` (`user_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `addresses`
--
ALTER TABLE `addresses`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `coupons`
--
ALTER TABLE `coupons`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `currencies`
--
ALTER TABLE `currencies`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `products`
--
ALTER TABLE `products`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `product_tags`
--
ALTER TABLE `product_tags`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT pour la table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `shipping_rates`
--
ALTER TABLE `shipping_rates`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `shipping_zones`
--
ALTER TABLE `shipping_zones`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `wishlists`
--
ALTER TABLE `wishlists`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Contraintes pour la table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Contraintes pour la table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `product_tags`
--
ALTER TABLE `product_tags`
  ADD CONSTRAINT `product_tags_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `shipping_rates`
--
ALTER TABLE `shipping_rates`
  ADD CONSTRAINT `shipping_rates_ibfk_1` FOREIGN KEY (`zone_id`) REFERENCES `shipping_zones` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `wishlists`
--
ALTER TABLE `wishlists`
  ADD CONSTRAINT `wishlists_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `wishlists_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
