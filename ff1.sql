-- MySQL dump 10.13  Distrib 5.6.27, for Win64 (x86_64)
--
-- Host: localhost    Database: ff1
-- ------------------------------------------------------
-- Server version	5.6.27-log

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
-- Table structure for table `armor`
--

DROP TABLE IF EXISTS `armor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `armor` (
  `name` varchar(20) NOT NULL,
  `location` varchar(100) NOT NULL,
  `defense` int(3) NOT NULL,
  `cost` int(7) DEFAULT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `armor`
--

LOCK TABLES `armor` WRITE;
/*!40000 ALTER TABLE `armor` DISABLE KEYS */;
INSERT INTO `armor` VALUES ('Aegis Shield','Mirage Tower L1',16,NULL),('Black Shirt','Sky Castle',24,NULL),('Buckler','Crescent Lake',2,2500),('Cap','Elfland, Temple of Fiends',1,80),('Chain Armor','Coneria',15,80),('Cloth','Coneria, Ice Cave L2B, Sky Castle L3',1,10),('Copper Bracelet','Elfland, Marsh Cave L3',4,1000),('Copper Gauntlet','Melmond, Elf Castle',2,200),('Dragon Armor','Mirage Tower L2',42,NULL),('Flame Armor','Gurgu Volcano',42,NULL),('Flame Shield','Gurgue Volcano L4B',12,NULL),('Gloves','Pravoka',1,60),('Gold Bracelet','Gaia, Castle of Ordeals L3',24,50000),('Heal Helmet','Mirage Tower L1, Sky Castle L1',6,NULL),('Ice Armor','Ice Cave L3B',34,NULL),('Ice Shield','Ice Cave L1',12,NULL),('Iron Armor','Pravoka Elfland, Marsh Castle L3, Castle Coneria',12,800),('Iron Gauntlet','Melmond, Northwest castle, Castle of Ordeals L3',4,750),('Iron Helmet','Melmond, Dwarf Cave',5,450),('Iron Shield','Elfland, Castle Coneria',4,100),('Opal Armor','Sea Shrine L4A',42,NULL),('Opal Bracelet','Sea Shrine L5',34,NULL),('Opal Gauntlet','Sea Shrine L5, Sky Castle L2',8,NULL),('Opal Helmet','Sea Shrine',8,NULL),('Opal Shield','Sea Shrine L5, Sky Castle L2',16,NULL),('Power Gauntlet','Sea Shrine L2B',6,NULL),('ProCape','Sky Caslte L3, ToF Fire Floor',8,NULL),('ProRin','Gaia, ToF Fire Floor, Sky Castle L1, Sky Castle L3',8,20000),('Ribbon','Waterfall, Sea Shrine L2B, Sky Castle L2',1,NULL),('Silver Armor','Crescent Lake, Dwarf Cave',18,7500),('Silver Bracelet','Melmond, Marsh Cave L3',15,5000),('Silver Gauntlet','Crescent Lake, Ice Cave L3B',6,2500),('Silver Helmet','Crescent Lake, Titan\'s Tunnel, Gurgu Volcano L2 (x3), Sky Castle L2',6,250),('Silver Shield','Crescent Lake, Earth Cave L4, Gurgu Volcano L2',8,2500),('Steel Armor','Melmond',34,45000),('White Shirt','Sky Castle',24,NULL),('Wooden Armor','Coneria',3,100),('Wooden Helmet','Elfland, Dwarf Cave',3,100),('Wooden Shield','Pravoka, Earth Cave L2',2,15),('Zeus Gauntlet','Castle of Ordeals',6,NULL);
/*!40000 ALTER TABLE `armor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `battlebackgrounds`
--

DROP TABLE IF EXISTS `battlebackgrounds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `battlebackgrounds` (
  `tile` varchar(30) NOT NULL,
  `spritecoords` varchar(40) NOT NULL,
  PRIMARY KEY (`tile`,`spritecoords`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `battlebackgrounds`
--

LOCK TABLES `battlebackgrounds` WRITE;
/*!40000 ALTER TABLE `battlebackgrounds` DISABLE KEYS */;
INSERT INTO `battlebackgrounds` VALUES ('forest','495, 5, 240, 128'),('grass','5, 5, 240, 128'),('sea','495, 138, 240, 128');
/*!40000 ALTER TABLE `battlebackgrounds` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item`
--

DROP TABLE IF EXISTS `item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `item` (
  `name` varchar(30) NOT NULL,
  `location` varchar(100) NOT NULL,
  `cost` int(7) NOT NULL,
  `effect` varchar(15) NOT NULL,
  `target` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item`
--

LOCK TABLES `item` WRITE;
/*!40000 ALTER TABLE `item` DISABLE KEYS */;
INSERT INTO `item` VALUES ('House','Elflnad, CresLake, Gaia, Onrac',3000,'+++HP, +MP','Many'),('Pure Potion','Everywhere',75,'Removes poison','One'),('Sleeping Bag (Tent)','Coneria, Pravoka',75,'+HP','Many'),('Soft Potion','Elfland, Onrac, Caravan',800,'Removes Stone','One'),('Tent (Cabin)','Pravoka, Elfland, CresLake, Gaia, Onrac',250,'++HP','Many'),('Tonic (Heal Potion)','Everywhere',60,'+HP','One');
/*!40000 ALTER TABLE `item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `monster`
--

DROP TABLE IF EXISTS `monster`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `monster` (
  `name` varchar(50) NOT NULL,
  `hp` int(6) NOT NULL,
  `exp` int(7) NOT NULL,
  `gp` int(5) NOT NULL,
  `atk` int(5) NOT NULL,
  `def` int(5) NOT NULL,
  `spritecoords` varchar(40) DEFAULT NULL,
  `location` varchar(50) DEFAULT NULL,
  `encounterchance` int(3) DEFAULT NULL,
  `countrange` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `monster`
--

LOCK TABLES `monster` WRITE;
/*!40000 ALTER TABLE `monster` DISABLE KEYS */;
INSERT INTO `monster` VALUES ('Agama',296,387,1200,0,0,NULL,NULL,NULL,NULL),('Air',358,1614,807,0,0,NULL,NULL,NULL,NULL),('Ankylo',352,2610,1,0,0,NULL,NULL,NULL,NULL),('Arachnid',64,141,50,0,0,NULL,NULL,NULL,NULL),('Asp',56,123,50,0,0,NULL,NULL,NULL,NULL),('Badman',260,1263,400,0,0,NULL,NULL,NULL,NULL),('Bigeye',304,3591,3951,0,0,NULL,NULL,NULL,NULL),('Blue Dragon',454,1224,400,0,0,NULL,NULL,NULL,NULL),('Bone',10,9,3,3,1,'157, 16, 32, 32','Cornelia',10,'1-2'),('Bull',164,489,489,0,0,NULL,NULL,NULL,NULL),('Caribe',92,240,20,0,0,NULL,NULL,NULL,NULL),('Catman',160,780,780,0,0,NULL,NULL,NULL,NULL),('Cerebus',192,1182,600,0,0,NULL,NULL,NULL,NULL),('Chimera',80,165,50,0,0,NULL,NULL,NULL,NULL),('Cobra',80,165,50,0,0,NULL,NULL,NULL,NULL),('Cocktrice',50,186,200,0,0,NULL,NULL,NULL,NULL),('Crawl',84,186,200,0,0,NULL,NULL,NULL,NULL),('Creep',56,63,15,0,0,NULL,NULL,NULL,NULL),('Earth',288,1536,768,0,0,NULL,NULL,NULL,NULL),('Evilman',190,2700,3000,0,0,NULL,NULL,NULL,NULL),('Eye',162,3225,3225,0,0,NULL,NULL,NULL,NULL),('Fighter',200,3420,3420,0,0,NULL,NULL,NULL,NULL),('Fire',276,1620,800,0,0,NULL,NULL,NULL,NULL),('Frost Dragon',200,1701,2000,0,0,NULL,NULL,NULL,NULL),('Frost Gator',142,1890,2000,0,0,NULL,NULL,NULL,NULL),('Frost Giant',336,1752,1752,0,0,NULL,NULL,NULL,NULL),('Gargoyle',80,132,80,0,0,NULL,NULL,NULL,NULL),('Gas Dragon',532,4068,5000,0,0,NULL,NULL,NULL,NULL),('Gator',184,816,900,0,0,NULL,NULL,NULL,NULL),('Geist',56,117,117,0,0,NULL,NULL,NULL,NULL),('Ghost',180,990,990,0,0,NULL,NULL,NULL,NULL),('Ghoul',48,93,50,0,0,NULL,NULL,NULL,NULL),('Giant',240,879,879,0,0,NULL,NULL,NULL,NULL),('Giant Pede',320,2244,1000,0,0,NULL,NULL,NULL,NULL),('Green Medusa',96,1218,1218,0,0,NULL,NULL,NULL,NULL),('Green Ogre',132,282,300,0,0,NULL,NULL,NULL,NULL),('Grey Imp',16,18,18,2,1,'36, 16, 32, 32','Cornelia',50,'1-3'),('Grey Naga',420,3489,4000,0,0,NULL,NULL,NULL,NULL),('Grey Shark',344,2361,600,0,0,NULL,NULL,NULL,NULL),('Grey Wolf',72,93,22,0,0,NULL,NULL,NULL,NULL),('Grey Worm',280,1671,400,0,0,NULL,NULL,NULL,NULL),('Guard',200,1224,200,0,0,NULL,NULL,NULL,NULL),('Hydra',212,915,150,0,0,NULL,NULL,NULL,NULL),('Hyena',120,288,72,0,0,NULL,NULL,NULL,NULL),('Iguana',92,153,50,0,0,NULL,NULL,NULL,NULL),('Image',86,231,231,0,0,NULL,NULL,NULL,NULL),('Imp',8,6,6,1,0,'4, 16, 32, 32','Cornelia',80,'2-5'),('Iron Golem',304,6717,3000,0,0,NULL,NULL,NULL,NULL),('Jimera',350,4584,5000,0,0,NULL,NULL,NULL,NULL),('Kyzoku',50,60,120,0,0,NULL,NULL,NULL,NULL),('Lobster',148,639,3000,0,0,NULL,NULL,NULL,NULL),('Mad Pony',64,63,15,0,0,NULL,NULL,NULL,NULL),('Mage',105,1095,1095,0,0,NULL,NULL,NULL,NULL),('Mancat',110,603,800,0,0,NULL,NULL,NULL,NULL),('Manticor',64,1317,650,0,0,NULL,NULL,NULL,NULL),('Medusa',68,699,699,0,0,NULL,NULL,NULL,NULL),('Muck',76,255,70,0,0,NULL,NULL,NULL,NULL),('Mud Golem',176,1257,800,0,0,NULL,NULL,NULL,NULL),('Mummy',80,300,300,0,0,NULL,NULL,NULL,NULL),('Naga',356,2355,2355,0,0,NULL,NULL,NULL,NULL),('Naocho',344,3189,500,0,0,NULL,NULL,NULL,NULL),('Nitemare',200,1272,700,0,0,NULL,NULL,NULL,NULL),('Ocho',208,1224,102,0,0,NULL,NULL,NULL,NULL),('Oddeye',10,42,10,4,1,'867, 2, 37, 48','Cornelia',10,'1-1'),('Ogre',100,195,195,0,0,NULL,NULL,NULL,NULL),('Ooze',76,252,70,0,0,NULL,NULL,NULL,NULL),('Pede',222,1194,300,0,0,NULL,NULL,NULL,NULL),('Perilisk',44,423,500,0,0,NULL,NULL,NULL,NULL),('Phantom',360,1,1,0,0,NULL,NULL,NULL,NULL),('Red Ankylo',246,1428,300,0,0,NULL,NULL,NULL,NULL),('Red Bone',144,378,378,0,0,NULL,NULL,NULL,NULL),('Red Caribe',172,546,46,0,0,NULL,NULL,NULL,NULL),('Red Dragon',248,2904,4000,0,0,NULL,NULL,NULL,NULL),('Red Gargoyle',94,387,387,0,0,NULL,NULL,NULL,NULL),('Red Giant',300,1506,1506,0,0,NULL,NULL,NULL,NULL),('Red Hydra',182,1215,400,0,0,NULL,NULL,NULL,NULL),('Red Sahag',64,150,150,0,0,NULL,NULL,NULL,NULL),('Rock Golem',200,2385,1000,0,0,NULL,NULL,NULL,NULL),('Saber Tooth',200,843,500,0,0,NULL,NULL,NULL,NULL),('Sahag',28,30,30,0,0,NULL,NULL,NULL,NULL),('Sand Worm',200,2683,900,0,0,NULL,NULL,NULL,NULL),('Sauria',196,1977,658,0,0,NULL,NULL,NULL,NULL),('Scorpion',84,225,70,0,0,NULL,NULL,NULL,NULL),('Scum',24,84,20,0,0,NULL,NULL,NULL,NULL),('Sea Snake',224,957,600,0,0,NULL,NULL,NULL,NULL),('Sea Troll',216,852,852,0,0,NULL,NULL,NULL,NULL),('Sentry',400,4000,2000,0,0,NULL,NULL,NULL,NULL),('Shadow',50,90,45,0,0,NULL,NULL,NULL,NULL),('Shark',120,267,66,0,0,NULL,NULL,NULL,NULL),('Slime',156,1101,900,0,0,NULL,NULL,NULL,NULL),('Sorcerer',112,822,999,0,0,NULL,NULL,NULL,NULL),('Specter',52,150,150,0,0,NULL,NULL,NULL,NULL),('Sphinx',228,1160,1160,0,0,NULL,NULL,NULL,NULL),('Spider',28,30,8,0,0,NULL,NULL,NULL,NULL),('T-rex',600,7200,600,0,0,NULL,NULL,NULL,NULL),('Tiger',132,438,108,0,0,NULL,NULL,NULL,NULL),('Troll',184,621,621,0,0,NULL,NULL,NULL,NULL),('Tyro',480,3387,502,0,0,NULL,NULL,NULL,NULL),('Water',300,1962,800,0,0,NULL,NULL,NULL,NULL),('Werewolf',68,135,65,0,0,NULL,NULL,NULL,NULL),('Wizard Mummy',188,984,1000,0,0,NULL,NULL,NULL,NULL),('Wizard Ogre',144,723,723,0,0,NULL,NULL,NULL,NULL),('Wizard Sahag',204,882,882,0,0,NULL,NULL,NULL,NULL),('Wizard Vampire',300,2385,3000,0,0,NULL,NULL,NULL,NULL),('Wolf',20,24,6,3,2,'72, 16, 32, 32','Cornelia',15,'1-2'),('Worm',448,4344,1000,0,0,NULL,NULL,NULL,NULL),('Wraith',114,432,432,0,0,NULL,NULL,NULL,NULL),('Wyrm',260,1218,502,0,0,NULL,NULL,NULL,NULL),('Wyvern',212,1173,50,0,0,NULL,NULL,NULL,NULL),('Zombie',20,24,12,0,0,NULL,NULL,NULL,NULL),('Zombie Bull',224,1050,1050,0,0,NULL,NULL,NULL,NULL),('Zombie Dragon',268,2331,999,0,0,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `monster` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questitem`
--

DROP TABLE IF EXISTS `questitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `questitem` (
  `name` varchar(20) NOT NULL,
  `location` varchar(200) NOT NULL,
  `quote` varchar(60) NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questitem`
--

LOCK TABLES `questitem` WRITE;
/*!40000 ALTER TABLE `questitem` DISABLE KEYS */;
INSERT INTO `questitem` VALUES ('Adamant','Obtained from the Sky Castle','The legendary metal.'),('Bottle','Obtained from the Caravan Master for 50,000G','Pop! a fairy appears, and is gone.'),('Chime','Obtained from Lefein','Stamped on the bottom: MADE IN LEFEIN.'),('Crown','Obtained from the Marsh Cave','The stolen CROWN.'),('Crystal','Obtained from Astros in the Northwest Castle','A ball made of cystal.'),('Cube','Obtained from the Waterfall','Colors gather and wirl in the CUBE.'),('Floater','Obtained from the Ice Cave','A mysterious rock.'),('Herb','Obtained from Matoya the Witch in Matoya\'s Cave','Yuck! This medicine is too bitter!'),('Key','Obtained from the Elf Prince in the Castle of Elf','The mystic KEY.'),('Lute','Obtained from Princess Sara in Castle Coneria','Beautiful music fills the air.'),('Oxyale','Obtained from the Fairy at Gaia','The OXYALE furnishes fresh air.'),('Rod','Obtained from Sarda the Sage in Sarda\'s Cave','The rod to remove the plate from the earth.'),('Ruby','Obtained from the Vampire in the Earth Cave','A large red stone.'),('Slab','Obtained from the Sea Shrine','Unknown symbols cover the SLAB.'),('Tail','Obtained from the Castle of Ordeals','OOHH!! It stinks! Throw it over... No! Don\'t do that!'),('TNT','Obtained from Castle Coneria','Be careful!');
/*!40000 ALTER TABLE `questitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `spell`
--

DROP TABLE IF EXISTS `spell`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `spell` (
  `location` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(50) NOT NULL,
  `sell` int(7) NOT NULL,
  `cost` int(5) NOT NULL,
  `white` int(1) NOT NULL,
  `reqlvl` int(3) NOT NULL,
  `type` enum('neutral','earth','fire','water','wind','holy','darkness','silence','poison','stone') NOT NULL,
  `all` int(1) NOT NULL,
  `applyon` int(1) NOT NULL,
  `statusch` enum('neutral','confusion','darkness','death','silence','poison','sleep','stone','paralysis','weak') NOT NULL,
  `hp` int(3) NOT NULL,
  `str` int(3) NOT NULL,
  `agil` int(3) NOT NULL,
  `int` int(3) NOT NULL,
  `stam` int(3) NOT NULL,
  `luck` int(3) NOT NULL,
  `atk` int(3) NOT NULL,
  `def` int(3) NOT NULL,
  `accu` int(3) NOT NULL,
  `EVAS` int(3) NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `spell`
--

LOCK TABLES `spell` WRITE;
/*!40000 ALTER TABLE `spell` DISABLE KEYS */;
INSERT INTO `spell` VALUES ('ElfLand','Cura','Heals more amount of HP',800,1500,1,3,'neutral',0,1,'neutral',70,0,0,0,0,0,0,0,0,0),('Cornelia','Cure','Heals small amount of HP',50,100,1,1,'neutral',0,1,'neutral',30,0,0,0,0,0,0,0,0,0),('Cornelia','Fog','Increase your defense',50,100,1,1,'neutral',0,1,'neutral',0,0,0,0,0,0,0,8,0,0),('Cornelia','Harm','Deals small amount of damage',50,100,1,1,'holy',0,0,'neutral',-50,0,0,0,0,0,0,0,0,0),('Pravoka','Invis','Increase your evasion greatly',150,400,1,2,'neutral',0,1,'neutral',0,0,0,0,0,0,0,0,0,120),('Pravoka','Lamp','Has chance to cause darkness',150,400,1,2,'neutral',0,1,'darkness',0,0,0,0,0,0,0,0,0,0),('Pravoka','Mute','Has chance to cause silence',150,400,1,2,'neutral',0,0,'silence',0,0,0,0,0,0,0,0,0,0),('Cornelia','Ruse','Increase your evasion',50,100,1,1,'neutral',0,1,'neutral',0,0,0,0,0,0,0,0,0,80);
/*!40000 ALTER TABLE `spell` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (58,'a@b.bg','vcOBdkXaK5EB','90da1fc87487c4bf7a3e6f24d68425f2','2015-09-27 02:30:04'),(68,'pipi@abv.bg','7ecCLMEgg3gT','3059733589f06505446e3969c18c1b6e','2016-01-30 12:44:23'),(71,'sisi@abv.bg','Cr6qUi46snjO','4a5521462d2854537d98f54590790d95','2016-01-30 16:54:07');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `weapon`
--

DROP TABLE IF EXISTS `weapon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `weapon` (
  `name` varchar(100) NOT NULL,
  `damage` int(5) NOT NULL,
  `hitrate` int(5) NOT NULL,
  `sell` int(6) DEFAULT NULL,
  `location` varchar(100) NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `weapon`
--

LOCK TABLES `weapon` WRITE;
/*!40000 ALTER TABLE `weapon` DISABLE KEYS */;
INSERT INTO `weapon` VALUES ('Bane Sword',22,20,NULL,'Sky Castle L1'),('Catclaw',22,35,65000,'Gaia'),('Coral Sword',19,15,NULL,'Earth Cave'),('Defense',30,35,NULL,'Waterfall'),('Dragon Sword',19,15,NULL,'Dwarf Cave'),('Falchon',15,10,450,'Melmond, Northwest Castle'),('Flame Sword',26,20,NULL,'Ice Cave L2B'),('Giant Sword',21,20,NULL,'Gurgu Volcano L2'),('Great Axe',22,5,NULL,'Titan\'s Tunnel'),('Hand Axe',16,5,550,'Pravoka'),('Heal Staff',6,0,NULL,'Castle of Ordeals L3'),('Ice Sword',29,25,NULL,'Castle of Ordeals L3, Gurgu Volcano L4B'),('Iron Hammer',9,0,10,'Coneria, Pravoka'),('Iron Nunchuck',16,0,200,'ElfLand'),('Iron Staff',14,0,200,'ElfLand, Melmond, Castle Coneria'),('Katana',33,35,NULL,'Sky Castle L3, ToF Fire Floor'),('Large Dagger',7,10,175,'ElfLand, Marsh Cave L2A'),('Light Axe',28,15,NULL,'Sea Shrine L2B, Sea Shrine L4A'),('Long Sword',20,10,1500,'Melmond'),('Mage Staff',12,10,NULL,'Sea Shrine L4A'),('Masmune',56,50,NULL,'ToF Air Floor'),('Power Staff',12,0,NULL,'Northwest Castle'),('Rapier',9,5,10,'Coneria'),('Rune Sword',18,15,NULL,'Temple of Fiends'),('Sabre',13,5,450,'ElfLand, Melmond, Castle Coneria'),('Scimitar',10,10,200,'Pravoka'),('Short Sword',15,10,550,'Pravoka, Marsh Cave L2A'),('Silver Axe',25,10,4500,'Crescent Lake, Gurgu Volcano L2'),('Silver Dagger',10,15,800,'Crescent Lake, Marsh Cave L3'),('Silver Hammer',12,5,2500,'Crescent Lake, Elf Castle'),('Silver Sword',23,15,4000,'ElfLand, Crescent Lake'),('Small Dagger',5,10,5,'Coneria'),('Sun Sword',32,30,NULL,'Mirage Tower L2'),('Thor\'s Hammer',18,15,NULL,'Mirage Tower L2'),('Vorpal',24,25,NULL,'Mirage Tower L1'),('Were Sword',18,15,NULL,'Temple of Fiends'),('Wizard Staff',15,15,NULL,'Waterfall'),('Wooden Nunchuck',12,0,10,'Coneria'),('Wooden Staff',6,0,5,'Coneria, Earth Cave L4, Gurgu Volcano L4B'),('Xcalber',45,35,NULL,'Dwarf Cave');
/*!40000 ALTER TABLE `weapon` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-02-16  1:20:19
