CREATE DATABASE  IF NOT EXISTS `nexclipper` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `nexclipper`;
-- MariaDB dump 10.17  Distrib 10.4.13-MariaDB, for osx10.15 (x86_64)
--
-- Host: 127.0.0.1    Database: nexclipper
-- ------------------------------------------------------
-- Server version	10.5.4-MariaDB-1:10.5.4+maria~focal

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ACCOUNTS_ZONE`
--

DROP TABLE IF EXISTS `ACCOUNTS_ZONE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ACCOUNTS_ZONE` (
  `ID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `NAME` varchar(200) NOT NULL,
  `PLATFORM` varchar(45) NOT NULL,
  `DESCRIPTION` varchar(200) DEFAULT NULL,
  `USER_ID` bigint(20) unsigned NOT NULL,
  `CREATED_AT` timestamp NULL DEFAULT current_timestamp(),
  `UPDATED_AT` timestamp NULL DEFAULT NULL,
  `IS_DELETED` tinyint(1) NOT NULL DEFAULT 0,
  `CREATED_BY` bigint(20) unsigned DEFAULT 0,
  `UPDATED_BY` bigint(20) unsigned DEFAULT 0,
  `IS_INIT` tinyint(1) DEFAULT 0 COMMENT 'ZONE 초기화 작업 수행 여부',
  `DASHBOARD_URL` varchar(300) DEFAULT NULL,
  `CLUSTER_NAME` varchar(300) DEFAULT NULL,
  `TAGS` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `API_KEYS`
--

DROP TABLE IF EXISTS `API_KEYS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `API_KEYS` (
  `USER_ID` bigint(20) unsigned NOT NULL,
  `API_KEY` varchar(100) NOT NULL,
  `CREATED_AT` timestamp NULL DEFAULT current_timestamp(),
  `UPDATED_AT` timestamp NULL DEFAULT NULL,
  `CREATED_BY` bigint(20) unsigned DEFAULT 0,
  `UPDATED_BY` bigint(20) unsigned DEFAULT 0,
  `IS_DELETED` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`USER_ID`),
  UNIQUE KEY `API_KEY_UNIQUE` (`API_KEY`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `JOIN_FILTERS`
--

DROP TABLE IF EXISTS `JOIN_FILTERS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `JOIN_FILTERS` (
  `ID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `PATTERN` varchar(200) DEFAULT NULL COMMENT '검색 필터 패턴',
  `TYPE` varchar(10) DEFAULT NULL COMMENT '필터 타입(whitelist / blacklist)',
  `CREATED_AT` timestamp NULL DEFAULT current_timestamp(),
  `UPDATED_AT` timestamp NULL DEFAULT NULL,
  `IS_DELETED` tinyint(1) DEFAULT 0,
  `CREATED_BY` varchar(45) DEFAULT NULL,
  `UPDATED_BY` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='회원가입 필터 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `OAUTH_USERS`
--

DROP TABLE IF EXISTS `OAUTH_USERS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `OAUTH_USERS` (
  `OAUTH_ID` varchar(45) NOT NULL,
  `OAUTH_CLIENT_ID` varchar(45) NOT NULL,
  `USER_ID` bigint(20) NOT NULL,
  `CREATED_AT` timestamp NULL DEFAULT current_timestamp(),
  `UPDATED_AT` timestamp NULL DEFAULT NULL,
  `CREATED_BY` bigint(20) unsigned DEFAULT 0,
  `UPDATED_BY` bigint(20) unsigned DEFAULT 0,
  `IS_DELETED` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`OAUTH_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `USERS`
--

DROP TABLE IF EXISTS `USERS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `USERS` (
  `ID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `NAME` varchar(100) NOT NULL,
  `EMAIL` varchar(200) DEFAULT NULL,
  `FIRST_NAME` varchar(45) DEFAULT NULL,
  `LAST_NAME` varchar(45) DEFAULT NULL,
  `MOBILE` varchar(45) DEFAULT NULL,
  `PHOTO` varchar(255) DEFAULT NULL,
  `CREATED_AT` timestamp NULL DEFAULT current_timestamp(),
  `UPDATED_AT` timestamp NULL DEFAULT NULL,
  `CREATED_BY` bigint(20) unsigned DEFAULT 0,
  `UPDATED_BY` bigint(20) unsigned DEFAULT 0,
  `IS_DELETED` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-09-08 18:58:31
