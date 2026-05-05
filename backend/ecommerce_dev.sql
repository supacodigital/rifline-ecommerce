-- MySQL dump 10.13  Distrib 8.0.40, for macos12.7 (arm64)
--
-- Host: 127.0.0.1    Database: ecommerce_dev
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
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
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name_fr` varchar(150) NOT NULL,
  `name_en` varchar(150) NOT NULL,
  `slug` varchar(150) NOT NULL,
  `description_fr` text,
  `description_en` text,
  `image_url` varchar(500) DEFAULT NULL,
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Parfums','Parfums','parfums','','',NULL,0,1,'2026-04-12 16:24:11','2026-04-12 16:24:11',NULL),(2,'Articles Islamiques','Articles Islamiques','articles-islamiques','','',NULL,0,1,'2026-04-12 16:24:26','2026-04-12 16:24:26',NULL),(3,'Décoration Vaisselle','Décoration Vaisselle','decoration-vaisselle','','',NULL,0,1,'2026-04-12 16:25:08','2026-04-12 16:25:08',NULL),(4,'Alimentaires','Alimentaires','alimentaires','','',NULL,0,1,'2026-04-12 16:25:23','2026-04-12 16:25:23',NULL);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupons`
--

DROP TABLE IF EXISTS `coupons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupons` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `type` enum('percent','fixed') NOT NULL,
  `value` decimal(10,2) NOT NULL,
  `min_order_amount` decimal(10,2) DEFAULT NULL,
  `max_uses` int unsigned DEFAULT NULL,
  `used_count` int unsigned NOT NULL DEFAULT '0',
  `starts_at` datetime DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupons`
--

LOCK TABLES `coupons` WRITE;
/*!40000 ALTER TABLE `coupons` DISABLE KEYS */;
/*!40000 ALTER TABLE `coupons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `currencies`
--

DROP TABLE IF EXISTS `currencies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `currencies` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `code` char(3) NOT NULL,
  `name` varchar(100) NOT NULL,
  `symbol` varchar(10) NOT NULL,
  `rate_vs_eur` decimal(10,6) NOT NULL DEFAULT '1.000000',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `currencies`
--

LOCK TABLES `currencies` WRITE;
/*!40000 ALTER TABLE `currencies` DISABLE KEYS */;
INSERT INTO `currencies` VALUES (1,'EUR','Euro','€',1.000000,1,'2026-04-27 22:12:54'),(2,'USD','Dollar US','$',1.080000,1,'2026-04-27 22:12:54'),(3,'GBP','Livre sterling','£',0.860000,1,'2026-04-27 22:12:54'),(4,'MAD','Dirham marocain','DH',0.093000,1,'2026-04-27 22:12:54');
/*!40000 ALTER TABLE `currencies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `order_id` int unsigned NOT NULL,
  `product_id` int unsigned NOT NULL,
  `variant_id` int unsigned DEFAULT NULL,
  `variant_name` varchar(255) DEFAULT NULL,
  `product_name` varchar(255) NOT NULL,
  `product_sku` varchar(100) DEFAULT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `quantity` int unsigned NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `idx_order_items_order` (`order_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,1,NULL,NULL,'Fakhar Lattafa','FAKH',20.00,1,20.00,'2026-04-12 16:28:14'),(2,2,1,NULL,NULL,'Fakhar Lattafa','FAKH',20.00,3,60.00,'2026-04-12 20:35:09'),(3,3,1,NULL,NULL,'Fakhar Lattafa','FAKH',20.00,3,60.00,'2026-04-12 20:40:02'),(4,4,1,NULL,NULL,'Fakhar Lattafa','FAKH',20.00,1,20.00,'2026-04-12 20:41:58'),(5,5,1,NULL,NULL,'Fakhar Lattafa','FAKH',20.00,1,20.00,'2026-04-12 20:44:04'),(6,6,1,NULL,NULL,'Fakhar Lattafa','FAKH',20.00,1,20.00,'2026-04-12 20:49:02'),(7,7,1,NULL,NULL,'Fakhar Lattafa','FAKH',20.00,1,20.00,'2026-04-12 22:16:43'),(8,8,1,NULL,NULL,'Fakhar Lattafa','FAKH',20.00,1,20.00,'2026-04-12 22:18:16'),(9,9,1,NULL,NULL,'Fakhar Lattafa','FAKH',20.00,1,20.00,'2026-04-12 22:31:08'),(10,10,1,NULL,NULL,'Fakhar Lattafa','FAKH',20.00,1,20.00,'2026-04-12 22:32:55'),(11,11,1,NULL,NULL,'Fakhar Lattafa','FAKH',20.00,1,20.00,'2026-04-12 22:34:37'),(12,12,1,NULL,NULL,'Fakhar Lattafa','FAKH',20.00,1,20.00,'2026-04-12 22:36:35'),(13,13,1,NULL,NULL,'Fakhar Lattafa','FAKH',20.00,1,20.00,'2026-04-12 22:38:52'),(14,14,1,NULL,NULL,'Fakhar Lattafa','FAKH',20.00,1,20.00,'2026-04-16 15:05:59'),(15,15,1,NULL,NULL,'Fakhar Lattafa','FAKH',20.00,1,20.00,'2026-04-27 22:08:46'),(16,16,1,NULL,NULL,'Fakhar Lattafa','FAKH',20.00,1,20.00,'2026-04-27 22:09:48'),(17,17,1,NULL,NULL,'Fakhar Lattafa','FAKH',20.00,3,60.00,'2026-04-30 16:11:40'),(18,18,1,NULL,NULL,'Fakhar Lattafa','FAKH',20.00,3,60.00,'2026-05-04 22:37:02'),(19,19,1,NULL,NULL,'Fakhar Lattafa','FAKH',20.00,1,20.00,'2026-05-04 23:19:18'),(20,19,1,1,'Vanille','Fakhar Lattafa','FAKH',20.00,1,20.00,'2026-05-04 23:19:18'),(21,20,1,NULL,NULL,'Fakhar Lattafa','FAKH',20.00,1,20.00,'2026-05-04 23:27:46'),(22,20,1,1,'Vanille','Fakhar Lattafa','FAKH',20.00,1,20.00,'2026-05-04 23:27:46'),(23,21,1,NULL,NULL,'Fakhar Lattafa','FAKH',20.00,1,20.00,'2026-05-04 23:28:33'),(24,21,1,1,'Vanille','Fakhar Lattafa','FAKH',20.00,1,20.00,'2026-05-04 23:28:33'),(25,22,1,NULL,NULL,'Fakhar Lattafa','FAKH',20.00,1,20.00,'2026-05-04 23:35:56'),(26,22,1,1,'Vanille','Fakhar Lattafa','FAKH',20.00,1,20.00,'2026-05-04 23:35:56');
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `order_number` varchar(50) NOT NULL,
  `user_id` int unsigned NOT NULL,
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
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_number` (`order_number`),
  KEY `idx_orders_user` (`user_id`),
  KEY `idx_orders_status` (`status`),
  KEY `idx_orders_number` (`order_number`),
  KEY `idx_orders_sumup_checkout_id` (`sumup_checkout_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'ORD-1776004094023-CD5809',1,'Supaco','Digital','1b Rue de la Prairie',NULL,'Saint-Genis-Pouilly','01630',NULL,'FR','0783052412',20.00,0.00,4.99,24.99,'EUR',1.000000,NULL,'colissimo_home',NULL,NULL,NULL,'cancelled',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-12 16:28:14','2026-04-16 14:44:13'),(2,'ORD-1776018909952-D0AEB7',1,'Supaco','Digital','1b Rue de la Prairie',NULL,'Saint-Genis-Pouilly','01630',NULL,'FR','0783052412',60.00,0.00,4.99,64.99,'EUR',1.000000,NULL,'colissimo_home',NULL,NULL,NULL,'cancelled',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-12 20:35:09','2026-04-16 14:44:13'),(3,'ORD-1776019202981-03FDE8',1,'Supaco','Digital','1b Rue de la Prairie',NULL,'Saint-Genis-Pouilly','01630',NULL,'FR','0783052412',60.00,0.00,4.99,64.99,'EUR',1.000000,NULL,'colissimo_home',NULL,NULL,NULL,'cancelled','271a57a4-d67a-4ce3-bc17-0893e6126f64',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-12 20:40:02','2026-04-16 14:44:13'),(4,'ORD-1776019318052-679CD1',1,'Supaco','Digital','1b Rue de la Prairie',NULL,'Saint-Genis-Pouilly','01630',NULL,'FR','0783052412',20.00,0.00,4.99,24.99,'EUR',1.000000,NULL,'colissimo_home',NULL,NULL,NULL,'cancelled','796a60c2-25a7-4b00-88d6-23e014749e27',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-12 20:41:58','2026-04-16 14:44:13'),(5,'ORD-1776019444845-AA1335',1,'Supaco','Digital','1b Rue de la Prairie',NULL,'Saint-Genis-Pouilly','01630',NULL,'FR','0783052412',20.00,0.00,4.99,24.99,'EUR',1.000000,NULL,'colissimo_home',NULL,NULL,NULL,'cancelled','09f763ae-6173-47d0-a994-a00d3153beec',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-12 20:44:04','2026-04-16 14:44:13'),(6,'ORD-1776019742745-A3F087',1,'Supaco','Digital','1b Rue de la Prairie',NULL,'Saint-Genis-Pouilly','01630',NULL,'FR','0783052412',20.00,0.00,4.99,24.99,'EUR',1.000000,NULL,'colissimo_home',NULL,NULL,NULL,'cancelled','b0b58b26-9e56-4a73-a1f2-ca3a44ecaf27',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-12 20:49:02','2026-04-16 14:44:13'),(7,'ORD-1776025003012-A50EC8',1,'Supaco','Digital','1b Rue de la Prairie',NULL,'Saint-Genis-Pouilly','01630',NULL,'FR','0783052412',20.00,0.00,4.99,24.99,'EUR',1.000000,NULL,'colissimo_home',NULL,NULL,NULL,'cancelled','0a2e3fc4-11ec-46e8-9533-c5e8fb45a459',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-12 22:16:43','2026-04-16 14:44:13'),(8,'ORD-1776025096937-C1F78C',1,'Supaco','Digital','1b Rue de la Prairie',NULL,'Saint-Genis-Pouilly','01630',NULL,'FR','0783052412',20.00,0.00,4.99,24.99,'EUR',1.000000,NULL,'colissimo_home',NULL,NULL,NULL,'cancelled','c3804d43-2165-439d-af93-f9487271af5e',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-12 22:18:16','2026-04-16 14:44:13'),(9,'ORD-1776025868668-047409',1,'Supaco','Digital','1b Rue de la Prairie',NULL,'Saint-Genis-Pouilly','01630',NULL,'FR','0783052412',20.00,0.00,4.99,24.99,'EUR',1.000000,NULL,'colissimo_home',NULL,NULL,NULL,'cancelled','1f4dc4ce-7796-4f3f-8eae-a678c5c8ae78',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-12 22:31:08','2026-04-16 14:44:13'),(10,'ORD-1776025975393-E8AB3C',1,'Supaco','Digital','1b Rue de la Prairie',NULL,'Saint-Genis-Pouilly','01630',NULL,'FR','0783052412',20.00,0.00,4.99,24.99,'EUR',1.000000,NULL,'colissimo_home',NULL,NULL,NULL,'cancelled','5218c9cb-a42f-4ba4-96d8-283160c45a42',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-12 22:32:55','2026-04-16 14:44:13'),(11,'ORD-1776026077279-E0CA68',1,'Supaco','Digital','1b Rue de la Prairie',NULL,'Saint-Genis-Pouilly','01630',NULL,'FR','0783052412',20.00,0.00,4.99,24.99,'EUR',1.000000,NULL,'colissimo_home',NULL,NULL,NULL,'cancelled','e8b2f801-696f-4f9c-a464-8febdb0a4ca6',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-12 22:34:37','2026-04-16 14:44:13'),(12,'ORD-1776026195736-542AEA',1,'Supaco','Digital','1b Rue de la Prairie',NULL,'Saint-Genis-Pouilly','01630',NULL,'FR','0783052412',20.00,0.00,4.99,24.99,'EUR',1.000000,NULL,'colissimo_home',NULL,NULL,NULL,'cancelled','1977e4f9-1684-44df-9b32-d0f0bf244682',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-12 22:36:35','2026-04-16 14:44:13'),(13,'ORD-1776026332771-030FA0',1,'Supaco','Digital','1b Rue de la Prairie',NULL,'Saint-Genis-Pouilly','01630',NULL,'FR','0783052412',20.00,0.00,4.99,24.99,'EUR',1.000000,NULL,'colissimo_home',NULL,NULL,NULL,'paid','7354844e-2bcf-493b-90e4-08a3c98e00a5',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-12 22:38:52','2026-04-12 22:39:17'),(14,'ORD-1776344759881-E6C5E8',1,'Kevin','Khek','1b Rue de la Prairie',NULL,'Saint-Genis-Pouilly','01630',NULL,'FR','0783052412',20.00,0.00,4.99,24.99,'EUR',1.000000,NULL,'colissimo_home',NULL,NULL,NULL,'cancelled','d6c02b7a-c3c1-4539-b898-fc984eeac6d7',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-16 15:05:59','2026-04-27 22:03:38'),(15,'ORD-1777320526596-112256',3,'Jean','Dupont','12 rue de la République',NULL,'Paris','75001',NULL,'FR','0612345678',20.00,0.00,4.99,24.99,'EUR',1.000000,NULL,'colissimo_home',NULL,NULL,NULL,'cancelled','2b9cca8f-1968-4887-b7a6-8cc9da2ebb9e',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-27 22:08:46','2026-04-27 23:13:01'),(16,'ORD-1777320588681-25E43A',3,'Jean','Dupont','12 rue de la République',NULL,'Paris','75001',NULL,'FR','0612345678',20.00,0.00,0.00,20.00,'EUR',1.000000,NULL,NULL,NULL,NULL,NULL,'cancelled','2153f9d0-2bc0-4a18-a96d-23862efc9604',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-27 22:09:48','2026-04-27 23:13:01'),(17,'ORD-1777558300590-00ECEF',4,'Supaco','Digital','1b Rue de la Prairie',NULL,'Saint-Genis-Pouilly','01630',NULL,'FR','0783052412',60.00,0.00,4.99,64.99,'EUR',1.000000,NULL,'colissimo_home',NULL,NULL,NULL,'cancelled',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-30 16:11:40','2026-05-04 22:16:52'),(18,'ORD-1777927022242-655661',4,'Supaco','Digital','1b Rue de la Prairie',NULL,'Saint-Genis-Pouilly','01630',NULL,'FR','0783052412',60.00,0.00,3.49,63.49,'EUR',1.000000,NULL,'mondial_relay','12802437','LOCKER 24/7 CARREFOUR MKT ST GE','RUE DE GENEVE 43, 01630 SAINT GENIS POUILLY','cancelled','17d0730d-5edf-4945-b87c-2d5efac199f9',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-04 22:37:02','2026-05-04 23:22:02'),(19,'ORD-1777929558177-2D3E46',4,'Supaco','Digital','1b Rue de la Prairie',NULL,'Saint-Genis-Pouilly','01630',NULL,'FR','0783052412',40.00,0.00,4.99,44.99,'EUR',1.000000,NULL,'colissimo_home',NULL,NULL,NULL,'cancelled','d24c5a3f-842c-41d0-b617-b625a6de6613',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-04 23:19:18','2026-05-05 13:52:20'),(20,'ORD-1777930066005-71B486',4,'Supaco','Digital','1b Rue de la Prairie',NULL,'Saint-Genis-Pouilly','01630',NULL,'FR','0783052412',40.00,0.00,3.49,43.49,'EUR',1.000000,NULL,'mondial_relay','12802437','LOCKER 24/7 CARREFOUR MKT ST GE','RUE DE GENEVE 43, 01630 SAINT GENIS POUILLY','cancelled','dd9f56c4-25be-4690-b488-22ff71b53607',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-04 23:27:46','2026-05-05 13:52:20'),(21,'ORD-1777930113112-093A05',4,'Supaco','Digital','1b Rue de la Prairie',NULL,'Saint-Genis-Pouilly','01630',NULL,'FR','0783052412',40.00,0.00,4.99,44.99,'EUR',1.000000,NULL,'colissimo_home',NULL,NULL,NULL,'cancelled','2acec63d-0f91-426a-b316-eafa5032294d',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-04 23:28:33','2026-05-05 13:52:20'),(22,'ORD-1777930556945-8C783F',4,'Supaco','Digital','1b Rue de la Prairie',NULL,'Saint-Genis-Pouilly','01630',NULL,'FR','0783052412',40.00,0.00,4.99,44.99,'EUR',1.000000,NULL,'colissimo_home',NULL,NULL,NULL,'cancelled','d0f16e48-b015-4bb0-8321-2d41a2dc06a1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-04 23:35:56','2026-05-05 13:52:20');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `token_hash` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` datetime NOT NULL,
  `used_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_token_hash` (`token_hash`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `fk_prt_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
INSERT INTO `password_reset_tokens` VALUES (1,1,'4dfcaf9326633e31769b3d1af3a8dde1cdc6bdc2006f55b64430c99b82a9dbb9','2026-04-16 14:07:48',NULL,'2026-04-16 15:07:47');
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int unsigned NOT NULL,
  `url` varchar(500) NOT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `is_cover` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (1,1,'/uploads/products/1776004026382-397204.jpeg',NULL,0,1,'2026-04-12 16:27:06');
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_tags`
--

DROP TABLE IF EXISTS `product_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_tags` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int unsigned NOT NULL,
  `tag` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_tags_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_tags`
--

LOCK TABLES `product_tags` WRITE;
/*!40000 ALTER TABLE `product_tags` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_variants`
--

DROP TABLE IF EXISTS `product_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_variants` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `sku` varchar(100) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_variant_sku` (`sku`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_variants`
--

LOCK TABLES `product_variants` WRITE;
/*!40000 ALTER TABLE `product_variants` DISABLE KEYS */;
INSERT INTO `product_variants` VALUES (1,1,'Vanille','/uploads/products/1777928040403-953030.jpeg',NULL,20.00,96,0,1,'2026-05-04 22:49:27','2026-05-04 23:35:56');
/*!40000 ALTER TABLE `product_variants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `category_id` int unsigned NOT NULL,
  `name_fr` varchar(255) NOT NULL,
  `name_en` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description_fr` text,
  `description_en` text,
  `price` decimal(10,2) NOT NULL,
  `stock` int unsigned NOT NULL DEFAULT '0',
  `sku` varchar(100) DEFAULT NULL,
  `weight_grams` int unsigned DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `sku` (`sku`),
  KEY `idx_products_category` (`category_id`),
  KEY `idx_products_slug` (`slug`),
  KEY `idx_products_active` (`is_active`,`deleted_at`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,1,'Fakhar Lattafa','Fakhar Lattafa','fakhar-lattafa','Le parfum qui attire tous les regards ✨\nUn parfum luxueux, longue tenue et hyper élégant.\nNotes sucrées, florales et légèrement fruitées : un mélange séduisant qui reste sur la peau toute la journée.\n💎 Top notes : grenade, fruits rouges\n🌸 Heart notes : jasmin, fleurs blanches\n💛 Base notes : musc, vanille, ambre\n⭐ Idéal pour soirée, mariage, sorties ou cadeau\n⭐ Parfum intense, classe et très apprécié\n⭐ Look 100% Dubai style\n📦 Disponible maintenant\n💨 Envoi rapide\n🔥 Rapport qualité prix imbattable','',20.00,80,'FAKH',4,1,'2026-04-12 16:26:54','2026-05-05 13:52:20',NULL),(3,1,'Fakhar Lattafa  2','Fakhar Lattafa  2','fakhar-lattafa-2','wefretvrtv','',20.00,100,'FAKH1',100,1,'2026-04-30 16:18:33','2026-04-30 16:18:33',NULL);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_tokens` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `token_hash` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token_hash` (`token_hash`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
INSERT INTO `refresh_tokens` VALUES (1,1,'9728f4c88a762fb278bd2007c1fff21bf626a025c79a0025999a4d7628a8be3a','2026-04-19 14:23:54','2026-04-12 16:23:53'),(18,3,'d640a4d3d78fa62959bd6651832857a52a2943bbc5384257d375fece7db866ab','2026-05-04 20:08:06','2026-04-27 22:08:06'),(19,3,'94e2d9b7fc4b96874c704da5ca3baa3e0c8052e25b2114af268bd54b5d1393a7','2026-05-04 20:09:33','2026-04-27 22:09:33'),(20,1,'4a2801c4972203068c44a3aa95f239b41703cea26e262fb029b588fa9483a405','2026-05-04 20:10:56','2026-04-27 22:10:55'),(21,1,'15592dbce68f49e5fd1421e546bbee3a0f77bc4f8ccc586ff3d5bf93dda98aa4','2026-05-04 20:11:12','2026-04-27 22:11:12'),(22,1,'eaee5635532ceec7442d05bdadb621d07bd9426ec1940193ed74f4c844513894','2026-05-04 20:12:54','2026-04-27 22:12:54'),(23,3,'21b23ec4c5139c38b2c2f476978f439d7d783d7943f0dd2ad5d755fde8d85877','2026-05-04 20:13:10','2026-04-27 22:13:09'),(33,4,'2e0ac0c6ef50be735171fb646a9debfe79ad02c018e6aa1018fb9242893ee774','2026-05-12 11:52:35','2026-05-05 13:52:34');
/*!40000 ALTER TABLE `refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int unsigned NOT NULL,
  `user_id` int unsigned NOT NULL,
  `order_id` int unsigned DEFAULT NULL,
  `rating` tinyint unsigned NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `body` text,
  `is_approved` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_review` (`user_id`,`product_id`),
  KEY `order_id` (`order_id`),
  KEY `idx_reviews_product` (`product_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shipping_rates`
--

DROP TABLE IF EXISTS `shipping_rates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shipping_rates` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `zone_id` int unsigned NOT NULL,
  `carrier` varchar(100) NOT NULL,
  `service_name` varchar(150) NOT NULL,
  `min_weight_g` int unsigned NOT NULL DEFAULT '0',
  `max_weight_g` int unsigned DEFAULT NULL,
  `price_eur` decimal(10,2) NOT NULL,
  `estimated_days` tinyint unsigned DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `zone_id` (`zone_id`),
  CONSTRAINT `shipping_rates_ibfk_1` FOREIGN KEY (`zone_id`) REFERENCES `shipping_zones` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shipping_rates`
--

LOCK TABLES `shipping_rates` WRITE;
/*!40000 ALTER TABLE `shipping_rates` DISABLE KEYS */;
/*!40000 ALTER TABLE `shipping_rates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shipping_zones`
--

DROP TABLE IF EXISTS `shipping_zones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shipping_zones` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `country_codes` text NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shipping_zones`
--

LOCK TABLES `shipping_zones` WRITE;
/*!40000 ALTER TABLE `shipping_zones` DISABLE KEYS */;
/*!40000 ALTER TABLE `shipping_zones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `role` enum('customer','admin') NOT NULL DEFAULT 'customer',
  `is_verified` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin@rifline.com','$2a$12$zmI6gjTS38F/z9DHORhbg.bul5meRSGubWRuwmvTwUz6uowOV5YfG','Admin','Rif Line',NULL,'admin',1,'2026-04-12 16:23:33','2026-04-30 16:13:57',NULL),(2,'supacodigital@gmail.com','$2a$12$M9huCqHokFxNU83EmZlLFe32BQZonxB1R.ul7OIyA8x8mDQgwFjDm','Kevin','Khek',NULL,'customer',0,'2026-04-16 15:08:08','2026-04-16 15:08:08',NULL),(3,'test@rifline.com','$2a$12$7AY4OxWf3IQI1JOkjvBubeeHHT4goNTFESNm2zWfcFS/ExJ/bGZT.','Test','User',NULL,'customer',0,'2026-04-27 22:08:06','2026-04-27 22:08:06',NULL),(4,'ali@rifline.com','$2a$12$zmI6gjTS38F/z9DHORhbg.bul5meRSGubWRuwmvTwUz6uowOV5YfG','ali','rifline',NULL,'admin',0,'2026-04-30 16:10:28','2026-04-30 16:15:27',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlists`
--

DROP TABLE IF EXISTS `wishlists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlists` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `product_id` int unsigned NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_wishlist` (`user_id`,`product_id`),
  KEY `product_id` (`product_id`),
  KEY `idx_wishlists_user` (`user_id`),
  CONSTRAINT `wishlists_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `wishlists_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlists`
--

LOCK TABLES `wishlists` WRITE;
/*!40000 ALTER TABLE `wishlists` DISABLE KEYS */;
INSERT INTO `wishlists` VALUES (1,1,1,'2026-04-12 16:37:31');
/*!40000 ALTER TABLE `wishlists` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-05 13:56:10
