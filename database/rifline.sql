-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:8889
-- Généré le : mar. 05 mai 2026 à 12:07
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
(1, 'Parfums', 'Parfums', 'parfums', '', '', NULL, 0, 1, '2026-04-12 16:24:11', '2026-04-12 16:24:11', NULL),
(2, 'Articles Islamiques', 'Articles Islamiques', 'articles-islamiques', '', '', NULL, 0, 1, '2026-04-12 16:24:26', '2026-04-12 16:24:26', NULL),
(3, 'Décoration Vaisselle', 'Décoration Vaisselle', 'decoration-vaisselle', '', '', NULL, 0, 1, '2026-04-12 16:25:08', '2026-04-12 16:25:08', NULL),
(4, 'Alimentaires', 'Alimentaires', 'alimentaires', '', '', NULL, 0, 1, '2026-04-12 16:25:23', '2026-04-12 16:25:23', NULL);

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
(1, 'EUR', 'Euro', '€', 1.000000, 1, '2026-04-27 22:12:54'),
(2, 'USD', 'Dollar US', '$', 1.080000, 1, '2026-04-27 22:12:54'),
(3, 'GBP', 'Livre sterling', '£', 0.860000, 1, '2026-04-27 22:12:54'),
(4, 'MAD', 'Dirham marocain', 'DH', 0.093000, 1, '2026-04-27 22:12:54');

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

INSERT INTO `orders` (`id`, `order_number`, `user_id`, `shipping_first_name`, `shipping_last_name`, `shipping_address1`, `shipping_address2`, `shipping_city`, `shipping_postal`, `shipping_state`, `shipping_country`, `shipping_phone`, `subtotal_eur`, `discount_eur`, `shipping_cost_eur`, `total_eur`, `currency_code`, `currency_rate`, `coupon_code`, `shipping_method_id`, `service_point_id`, `service_point_name`, `service_point_address`, `status`, `sumup_checkout_id`, `shipengine_shipment_id`, `tracking_number`, `carrier`, `label_url`, `shipped_at`, `delivered_at`, `notes`, `created_at`, `updated_at`) VALUES
(1, 'ORD-1776004094023-CD5809', 1, 'Supaco', 'Digital', '1b Rue de la Prairie', NULL, 'Saint-Genis-Pouilly', '01630', NULL, 'FR', '0783052412', 20.00, 0.00, 4.99, 24.99, 'EUR', 1.000000, NULL, 'colissimo_home', NULL, NULL, NULL, 'cancelled', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-12 16:28:14', '2026-04-16 14:44:13'),
(2, 'ORD-1776018909952-D0AEB7', 1, 'Supaco', 'Digital', '1b Rue de la Prairie', NULL, 'Saint-Genis-Pouilly', '01630', NULL, 'FR', '0783052412', 60.00, 0.00, 4.99, 64.99, 'EUR', 1.000000, NULL, 'colissimo_home', NULL, NULL, NULL, 'cancelled', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-12 20:35:09', '2026-04-16 14:44:13'),
(3, 'ORD-1776019202981-03FDE8', 1, 'Supaco', 'Digital', '1b Rue de la Prairie', NULL, 'Saint-Genis-Pouilly', '01630', NULL, 'FR', '0783052412', 60.00, 0.00, 4.99, 64.99, 'EUR', 1.000000, NULL, 'colissimo_home', NULL, NULL, NULL, 'cancelled', '271a57a4-d67a-4ce3-bc17-0893e6126f64', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-12 20:40:02', '2026-04-16 14:44:13'),
(4, 'ORD-1776019318052-679CD1', 1, 'Supaco', 'Digital', '1b Rue de la Prairie', NULL, 'Saint-Genis-Pouilly', '01630', NULL, 'FR', '0783052412', 20.00, 0.00, 4.99, 24.99, 'EUR', 1.000000, NULL, 'colissimo_home', NULL, NULL, NULL, 'cancelled', '796a60c2-25a7-4b00-88d6-23e014749e27', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-12 20:41:58', '2026-04-16 14:44:13'),
(5, 'ORD-1776019444845-AA1335', 1, 'Supaco', 'Digital', '1b Rue de la Prairie', NULL, 'Saint-Genis-Pouilly', '01630', NULL, 'FR', '0783052412', 20.00, 0.00, 4.99, 24.99, 'EUR', 1.000000, NULL, 'colissimo_home', NULL, NULL, NULL, 'cancelled', '09f763ae-6173-47d0-a994-a00d3153beec', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-12 20:44:04', '2026-04-16 14:44:13'),
(6, 'ORD-1776019742745-A3F087', 1, 'Supaco', 'Digital', '1b Rue de la Prairie', NULL, 'Saint-Genis-Pouilly', '01630', NULL, 'FR', '0783052412', 20.00, 0.00, 4.99, 24.99, 'EUR', 1.000000, NULL, 'colissimo_home', NULL, NULL, NULL, 'cancelled', 'b0b58b26-9e56-4a73-a1f2-ca3a44ecaf27', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-12 20:49:02', '2026-04-16 14:44:13'),
(7, 'ORD-1776025003012-A50EC8', 1, 'Supaco', 'Digital', '1b Rue de la Prairie', NULL, 'Saint-Genis-Pouilly', '01630', NULL, 'FR', '0783052412', 20.00, 0.00, 4.99, 24.99, 'EUR', 1.000000, NULL, 'colissimo_home', NULL, NULL, NULL, 'cancelled', '0a2e3fc4-11ec-46e8-9533-c5e8fb45a459', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-12 22:16:43', '2026-04-16 14:44:13'),
(8, 'ORD-1776025096937-C1F78C', 1, 'Supaco', 'Digital', '1b Rue de la Prairie', NULL, 'Saint-Genis-Pouilly', '01630', NULL, 'FR', '0783052412', 20.00, 0.00, 4.99, 24.99, 'EUR', 1.000000, NULL, 'colissimo_home', NULL, NULL, NULL, 'cancelled', 'c3804d43-2165-439d-af93-f9487271af5e', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-12 22:18:16', '2026-04-16 14:44:13'),
(9, 'ORD-1776025868668-047409', 1, 'Supaco', 'Digital', '1b Rue de la Prairie', NULL, 'Saint-Genis-Pouilly', '01630', NULL, 'FR', '0783052412', 20.00, 0.00, 4.99, 24.99, 'EUR', 1.000000, NULL, 'colissimo_home', NULL, NULL, NULL, 'cancelled', '1f4dc4ce-7796-4f3f-8eae-a678c5c8ae78', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-12 22:31:08', '2026-04-16 14:44:13'),
(10, 'ORD-1776025975393-E8AB3C', 1, 'Supaco', 'Digital', '1b Rue de la Prairie', NULL, 'Saint-Genis-Pouilly', '01630', NULL, 'FR', '0783052412', 20.00, 0.00, 4.99, 24.99, 'EUR', 1.000000, NULL, 'colissimo_home', NULL, NULL, NULL, 'cancelled', '5218c9cb-a42f-4ba4-96d8-283160c45a42', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-12 22:32:55', '2026-04-16 14:44:13'),
(11, 'ORD-1776026077279-E0CA68', 1, 'Supaco', 'Digital', '1b Rue de la Prairie', NULL, 'Saint-Genis-Pouilly', '01630', NULL, 'FR', '0783052412', 20.00, 0.00, 4.99, 24.99, 'EUR', 1.000000, NULL, 'colissimo_home', NULL, NULL, NULL, 'cancelled', 'e8b2f801-696f-4f9c-a464-8febdb0a4ca6', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-12 22:34:37', '2026-04-16 14:44:13'),
(12, 'ORD-1776026195736-542AEA', 1, 'Supaco', 'Digital', '1b Rue de la Prairie', NULL, 'Saint-Genis-Pouilly', '01630', NULL, 'FR', '0783052412', 20.00, 0.00, 4.99, 24.99, 'EUR', 1.000000, NULL, 'colissimo_home', NULL, NULL, NULL, 'cancelled', '1977e4f9-1684-44df-9b32-d0f0bf244682', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-12 22:36:35', '2026-04-16 14:44:13'),
(13, 'ORD-1776026332771-030FA0', 1, 'Supaco', 'Digital', '1b Rue de la Prairie', NULL, 'Saint-Genis-Pouilly', '01630', NULL, 'FR', '0783052412', 20.00, 0.00, 4.99, 24.99, 'EUR', 1.000000, NULL, 'colissimo_home', NULL, NULL, NULL, 'paid', '7354844e-2bcf-493b-90e4-08a3c98e00a5', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-12 22:38:52', '2026-04-12 22:39:17'),
(14, 'ORD-1776344759881-E6C5E8', 1, 'Kevin', 'Khek', '1b Rue de la Prairie', NULL, 'Saint-Genis-Pouilly', '01630', NULL, 'FR', '0783052412', 20.00, 0.00, 4.99, 24.99, 'EUR', 1.000000, NULL, 'colissimo_home', NULL, NULL, NULL, 'cancelled', 'd6c02b7a-c3c1-4539-b898-fc984eeac6d7', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-16 15:05:59', '2026-04-27 22:03:38'),
(15, 'ORD-1777320526596-112256', 3, 'Jean', 'Dupont', '12 rue de la République', NULL, 'Paris', '75001', NULL, 'FR', '0612345678', 20.00, 0.00, 4.99, 24.99, 'EUR', 1.000000, NULL, 'colissimo_home', NULL, NULL, NULL, 'cancelled', '2b9cca8f-1968-4887-b7a6-8cc9da2ebb9e', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-27 22:08:46', '2026-04-27 23:13:01'),
(16, 'ORD-1777320588681-25E43A', 3, 'Jean', 'Dupont', '12 rue de la République', NULL, 'Paris', '75001', NULL, 'FR', '0612345678', 20.00, 0.00, 0.00, 20.00, 'EUR', 1.000000, NULL, NULL, NULL, NULL, NULL, 'cancelled', '2153f9d0-2bc0-4a18-a96d-23862efc9604', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-27 22:09:48', '2026-04-27 23:13:01'),
(17, 'ORD-1777558300590-00ECEF', 4, 'Supaco', 'Digital', '1b Rue de la Prairie', NULL, 'Saint-Genis-Pouilly', '01630', NULL, 'FR', '0783052412', 60.00, 0.00, 4.99, 64.99, 'EUR', 1.000000, NULL, 'colissimo_home', NULL, NULL, NULL, 'cancelled', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-30 16:11:40', '2026-05-04 22:16:52'),
(18, 'ORD-1777927022242-655661', 4, 'Supaco', 'Digital', '1b Rue de la Prairie', NULL, 'Saint-Genis-Pouilly', '01630', NULL, 'FR', '0783052412', 60.00, 0.00, 3.49, 63.49, 'EUR', 1.000000, NULL, 'mondial_relay', '12802437', 'LOCKER 24/7 CARREFOUR MKT ST GE', 'RUE DE GENEVE 43, 01630 SAINT GENIS POUILLY', 'cancelled', '17d0730d-5edf-4945-b87c-2d5efac199f9', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-05-04 22:37:02', '2026-05-04 23:22:02'),
(19, 'ORD-1777929558177-2D3E46', 4, 'Supaco', 'Digital', '1b Rue de la Prairie', NULL, 'Saint-Genis-Pouilly', '01630', NULL, 'FR', '0783052412', 40.00, 0.00, 4.99, 44.99, 'EUR', 1.000000, NULL, 'colissimo_home', NULL, NULL, NULL, 'cancelled', 'd24c5a3f-842c-41d0-b617-b625a6de6613', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-05-04 23:19:18', '2026-05-05 13:52:20'),
(20, 'ORD-1777930066005-71B486', 4, 'Supaco', 'Digital', '1b Rue de la Prairie', NULL, 'Saint-Genis-Pouilly', '01630', NULL, 'FR', '0783052412', 40.00, 0.00, 3.49, 43.49, 'EUR', 1.000000, NULL, 'mondial_relay', '12802437', 'LOCKER 24/7 CARREFOUR MKT ST GE', 'RUE DE GENEVE 43, 01630 SAINT GENIS POUILLY', 'cancelled', 'dd9f56c4-25be-4690-b488-22ff71b53607', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-05-04 23:27:46', '2026-05-05 13:52:20'),
(21, 'ORD-1777930113112-093A05', 4, 'Supaco', 'Digital', '1b Rue de la Prairie', NULL, 'Saint-Genis-Pouilly', '01630', NULL, 'FR', '0783052412', 40.00, 0.00, 4.99, 44.99, 'EUR', 1.000000, NULL, 'colissimo_home', NULL, NULL, NULL, 'cancelled', '2acec63d-0f91-426a-b316-eafa5032294d', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-05-04 23:28:33', '2026-05-05 13:52:20'),
(22, 'ORD-1777930556945-8C783F', 4, 'Supaco', 'Digital', '1b Rue de la Prairie', NULL, 'Saint-Genis-Pouilly', '01630', NULL, 'FR', '0783052412', 40.00, 0.00, 4.99, 44.99, 'EUR', 1.000000, NULL, 'colissimo_home', NULL, NULL, NULL, 'cancelled', 'd0f16e48-b015-4bb0-8321-2d41a2dc06a1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-05-04 23:35:56', '2026-05-05 13:52:20');

-- --------------------------------------------------------

--
-- Structure de la table `order_items`
--

CREATE TABLE `order_items` (
  `id` int UNSIGNED NOT NULL,
  `order_id` int UNSIGNED NOT NULL,
  `product_id` int UNSIGNED NOT NULL,
  `variant_id` int UNSIGNED DEFAULT NULL,
  `variant_name` varchar(255) DEFAULT NULL,
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

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `variant_id`, `variant_name`, `product_name`, `product_sku`, `unit_price`, `quantity`, `subtotal`, `created_at`) VALUES
(1, 1, 1, NULL, NULL, 'Fakhar Lattafa', 'FAKH', 20.00, 1, 20.00, '2026-04-12 16:28:14'),
(2, 2, 1, NULL, NULL, 'Fakhar Lattafa', 'FAKH', 20.00, 3, 60.00, '2026-04-12 20:35:09'),
(3, 3, 1, NULL, NULL, 'Fakhar Lattafa', 'FAKH', 20.00, 3, 60.00, '2026-04-12 20:40:02'),
(4, 4, 1, NULL, NULL, 'Fakhar Lattafa', 'FAKH', 20.00, 1, 20.00, '2026-04-12 20:41:58'),
(5, 5, 1, NULL, NULL, 'Fakhar Lattafa', 'FAKH', 20.00, 1, 20.00, '2026-04-12 20:44:04'),
(6, 6, 1, NULL, NULL, 'Fakhar Lattafa', 'FAKH', 20.00, 1, 20.00, '2026-04-12 20:49:02'),
(7, 7, 1, NULL, NULL, 'Fakhar Lattafa', 'FAKH', 20.00, 1, 20.00, '2026-04-12 22:16:43'),
(8, 8, 1, NULL, NULL, 'Fakhar Lattafa', 'FAKH', 20.00, 1, 20.00, '2026-04-12 22:18:16'),
(9, 9, 1, NULL, NULL, 'Fakhar Lattafa', 'FAKH', 20.00, 1, 20.00, '2026-04-12 22:31:08'),
(10, 10, 1, NULL, NULL, 'Fakhar Lattafa', 'FAKH', 20.00, 1, 20.00, '2026-04-12 22:32:55'),
(11, 11, 1, NULL, NULL, 'Fakhar Lattafa', 'FAKH', 20.00, 1, 20.00, '2026-04-12 22:34:37'),
(12, 12, 1, NULL, NULL, 'Fakhar Lattafa', 'FAKH', 20.00, 1, 20.00, '2026-04-12 22:36:35'),
(13, 13, 1, NULL, NULL, 'Fakhar Lattafa', 'FAKH', 20.00, 1, 20.00, '2026-04-12 22:38:52'),
(14, 14, 1, NULL, NULL, 'Fakhar Lattafa', 'FAKH', 20.00, 1, 20.00, '2026-04-16 15:05:59'),
(15, 15, 1, NULL, NULL, 'Fakhar Lattafa', 'FAKH', 20.00, 1, 20.00, '2026-04-27 22:08:46'),
(16, 16, 1, NULL, NULL, 'Fakhar Lattafa', 'FAKH', 20.00, 1, 20.00, '2026-04-27 22:09:48'),
(17, 17, 1, NULL, NULL, 'Fakhar Lattafa', 'FAKH', 20.00, 3, 60.00, '2026-04-30 16:11:40'),
(18, 18, 1, NULL, NULL, 'Fakhar Lattafa', 'FAKH', 20.00, 3, 60.00, '2026-05-04 22:37:02'),
(19, 19, 1, NULL, NULL, 'Fakhar Lattafa', 'FAKH', 20.00, 1, 20.00, '2026-05-04 23:19:18'),
(20, 19, 1, 1, 'Vanille', 'Fakhar Lattafa', 'FAKH', 20.00, 1, 20.00, '2026-05-04 23:19:18'),
(21, 20, 1, NULL, NULL, 'Fakhar Lattafa', 'FAKH', 20.00, 1, 20.00, '2026-05-04 23:27:46'),
(22, 20, 1, 1, 'Vanille', 'Fakhar Lattafa', 'FAKH', 20.00, 1, 20.00, '2026-05-04 23:27:46'),
(23, 21, 1, NULL, NULL, 'Fakhar Lattafa', 'FAKH', 20.00, 1, 20.00, '2026-05-04 23:28:33'),
(24, 21, 1, 1, 'Vanille', 'Fakhar Lattafa', 'FAKH', 20.00, 1, 20.00, '2026-05-04 23:28:33'),
(25, 22, 1, NULL, NULL, 'Fakhar Lattafa', 'FAKH', 20.00, 1, 20.00, '2026-05-04 23:35:56'),
(26, 22, 1, 1, 'Vanille', 'Fakhar Lattafa', 'FAKH', 20.00, 1, 20.00, '2026-05-04 23:35:56');

-- --------------------------------------------------------

--
-- Structure de la table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `id` int NOT NULL,
  `user_id` int UNSIGNED NOT NULL,
  `token_hash` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` datetime NOT NULL,
  `used_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `password_reset_tokens`
--

INSERT INTO `password_reset_tokens` (`id`, `user_id`, `token_hash`, `expires_at`, `used_at`, `created_at`) VALUES
(1, 1, '4dfcaf9326633e31769b3d1af3a8dde1cdc6bdc2006f55b64430c99b82a9dbb9', '2026-04-16 14:07:48', NULL, '2026-04-16 15:07:47');

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
(1, 1, 'Fakhar Lattafa', 'Fakhar Lattafa', 'fakhar-lattafa', 'Le parfum qui attire tous les regards ✨\nUn parfum luxueux, longue tenue et hyper élégant.\nNotes sucrées, florales et légèrement fruitées : un mélange séduisant qui reste sur la peau toute la journée.\n💎 Top notes : grenade, fruits rouges\n🌸 Heart notes : jasmin, fleurs blanches\n💛 Base notes : musc, vanille, ambre\n⭐ Idéal pour soirée, mariage, sorties ou cadeau\n⭐ Parfum intense, classe et très apprécié\n⭐ Look 100% Dubai style\n📦 Disponible maintenant\n💨 Envoi rapide\n🔥 Rapport qualité prix imbattable', '', 20.00, 80, 'FAKH', 4, 1, '2026-04-12 16:26:54', '2026-05-05 13:52:20', NULL),
(3, 1, 'Fakhar Lattafa  2', 'Fakhar Lattafa  2', 'fakhar-lattafa-2', 'wefretvrtv', '', 20.00, 100, 'FAKH1', 100, 1, '2026-04-30 16:18:33', '2026-04-30 16:18:33', NULL);

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
(1, 1, '/uploads/products/1776004026382-397204.jpeg', NULL, 0, 1, '2026-04-12 16:27:06');

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
-- Structure de la table `product_variants`
--

CREATE TABLE `product_variants` (
  `id` int UNSIGNED NOT NULL,
  `product_id` int UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `sku` varchar(100) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `product_variants`
--

INSERT INTO `product_variants` (`id`, `product_id`, `name`, `image_url`, `sku`, `price`, `stock`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 1, 'Vanille', '/uploads/products/1777928040403-953030.jpeg', NULL, 20.00, 96, 0, 1, '2026-05-04 22:49:27', '2026-05-04 23:35:56');

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
(1, 1, '9728f4c88a762fb278bd2007c1fff21bf626a025c79a0025999a4d7628a8be3a', '2026-04-19 14:23:54', '2026-04-12 16:23:53'),
(18, 3, 'd640a4d3d78fa62959bd6651832857a52a2943bbc5384257d375fece7db866ab', '2026-05-04 20:08:06', '2026-04-27 22:08:06'),
(19, 3, '94e2d9b7fc4b96874c704da5ca3baa3e0c8052e25b2114af268bd54b5d1393a7', '2026-05-04 20:09:33', '2026-04-27 22:09:33'),
(20, 1, '4a2801c4972203068c44a3aa95f239b41703cea26e262fb029b588fa9483a405', '2026-05-04 20:10:56', '2026-04-27 22:10:55'),
(21, 1, '15592dbce68f49e5fd1421e546bbee3a0f77bc4f8ccc586ff3d5bf93dda98aa4', '2026-05-04 20:11:12', '2026-04-27 22:11:12'),
(22, 1, 'eaee5635532ceec7442d05bdadb621d07bd9426ec1940193ed74f4c844513894', '2026-05-04 20:12:54', '2026-04-27 22:12:54'),
(23, 3, '21b23ec4c5139c38b2c2f476978f439d7d783d7943f0dd2ad5d755fde8d85877', '2026-05-04 20:13:10', '2026-04-27 22:13:09'),
(33, 4, '2e0ac0c6ef50be735171fb646a9debfe79ad02c018e6aa1018fb9242893ee774', '2026-05-12 11:52:35', '2026-05-05 13:52:34');

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
(1, 'admin@rifline.com', '$2a$12$zmI6gjTS38F/z9DHORhbg.bul5meRSGubWRuwmvTwUz6uowOV5YfG', 'Admin', 'Rif Line', NULL, 'admin', 1, '2026-04-12 16:23:33', '2026-04-30 16:13:57', NULL),
(2, 'supacodigital@gmail.com', '$2a$12$M9huCqHokFxNU83EmZlLFe32BQZonxB1R.ul7OIyA8x8mDQgwFjDm', 'Kevin', 'Khek', NULL, 'customer', 0, '2026-04-16 15:08:08', '2026-04-16 15:08:08', NULL),
(3, 'test@rifline.com', '$2a$12$7AY4OxWf3IQI1JOkjvBubeeHHT4goNTFESNm2zWfcFS/ExJ/bGZT.', 'Test', 'User', NULL, 'customer', 0, '2026-04-27 22:08:06', '2026-04-27 22:08:06', NULL),
(4, 'ali@rifline.com', '$2a$12$zmI6gjTS38F/z9DHORhbg.bul5meRSGubWRuwmvTwUz6uowOV5YfG', 'ali', 'rifline', NULL, 'admin', 0, '2026-04-30 16:10:28', '2026-04-30 16:15:27', NULL);

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
(1, 1, 1, '2026-04-12 16:37:31');

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
-- Index pour la table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_token_hash` (`token_hash`),
  ADD KEY `idx_user_id` (`user_id`);

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
-- Index pour la table `product_variants`
--
ALTER TABLE `product_variants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_variant_sku` (`sku`),
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
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `coupons`
--
ALTER TABLE `coupons`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `currencies`
--
ALTER TABLE `currencies`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT pour la table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT pour la table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `products`
--
ALTER TABLE `products`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
-- AUTO_INCREMENT pour la table `product_variants`
--
ALTER TABLE `product_variants`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

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
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
-- Contraintes pour la table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD CONSTRAINT `fk_prt_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

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
-- Contraintes pour la table `product_variants`
--
ALTER TABLE `product_variants`
  ADD CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

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
