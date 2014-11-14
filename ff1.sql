-- MySQL dump 10.13  Distrib 5.6.21, for Win64 (x86_64)
--
-- Host: localhost    Database: ff1
-- ------------------------------------------------------
-- Server version	5.6.21-log

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
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `salt` varchar(12) NOT NULL,
  `password` varchar(32) NOT NULL,
  `created` datetime NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (29,'thesopa@abv.bg','v5qgOBBwT5K9','db8e8ef6b98c6d9dffcef7544e5bcf8a','2014-10-27 17:27:57'),(30,'aa@a','VOFPokvMCxvn','6cb2054de120c8bb142aa0cf4a460e08','2014-10-27 21:37:05'),(31,'aasd@asdasd','1Ei8586bCq10','0a0eb634d9d1e21dabc93d0ab3994a00','2014-10-27 21:54:08'),(32,'asdasdasd@asdasdf','KwROKoCDWX2u','5963f97d0efe7a0219634872827a341d','2014-10-27 22:03:00'),(33,'asd@asd','wmZsgW9wyxgK','370b0ddb95ccd57840d43e019144565d','2014-10-27 22:08:44'),(34,'asd@asdd','V9DmkcS19WZ0','370b0ddb95ccd57840d43e019144565d','2014-10-27 22:10:55'),(35,'pradnq@asd','VKGow3zRqcol','9a27b669b71ccd5df7e685bf85282ede','2014-10-27 22:33:49'),(36,'losho@losho','ar0azfQUBQDC','91f6fbd516af57a956a73b6af374186c','2014-10-27 22:34:53'),(37,'dobre@dobre','q6qhXAz54ExH','c0061b6a1e0da1af99834102b8739043','2014-10-27 22:35:32'),(38,'s@s','bQqq8IaSacVF','aa5d4b5686df1e341de4be4e6aab8943','2014-10-27 22:36:22'),(39,'dadada@dada','LzpO9WePhX3m','d106296b56337b997cbea04fd498aa24','2014-10-27 22:40:13'),(40,'a@a','DASNKD1aeKtp','6cb2054de120c8bb142aa0cf4a460e08','2014-10-27 22:43:34'),(41,'a@ab','LET9utYnVzLl','17a87a8686a217572169f752f8c069b4','2014-10-27 22:50:10'),(42,'blabla@a','4cvAdxJV4WLU','d106296b56337b997cbea04fd498aa24','2014-10-27 22:55:50'),(43,'bb@a','7AayFSqvsb7d','837005e1d25c226b4b481e0238f948c3','2014-10-27 22:59:34'),(44,'p@p','QjODbuTFxP02','0f77afeee50dfcf56c6e09d2b9185155','2014-10-27 23:11:28'),(45,'hakuna@matata.bg','9gilMZLq3a7D','3ed049bf7c85ac780c718c3ae1d48767','2014-10-27 23:13:11'),(46,'hakunda@matata.bg','A4dxO7IXd5xt','cd32c8954321d1329b38d97301f09511','2014-10-27 23:14:27'),(47,'d@a','vvHAYZOarbSB','ea6b1032098bb409df9e17a6e83ade26','2014-10-27 23:24:43'),(48,'bobo@bobo.bg','L9Bk3Z2X8mmm','d177a7ca06d9c31b1b867c32ae61fa4c','2014-10-28 19:30:12'),(49,'gaga@gaga.bg','DOzeSbkwjyCW','08f3658f2e36dfd073c91b60c00c35fe','2014-10-28 22:51:10'),(50,'angel@abv.bg','nzjxxOVqOAyH','a77b5a2bb58239b55f164c4524af2c9b','2014-11-07 13:52:55');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-11-14 17:52:47
