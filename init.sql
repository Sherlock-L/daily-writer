CREATE DATABASE `diary_db` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */;

-- diary_db.diary definition

CREATE TABLE `diary` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL COMMENT '日记标题',
  `content` text NOT NULL COMMENT '日记内容',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint(4) NOT NULL DEFAULT '0' COMMENT '是否删除(0:未删除,1:已删除)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COMMENT='日记表';

-- v4版本
alter  table diary  add column   `mood` varchar(20) NOT NULL DEFAULT '平常' COMMENT '心情选项 快乐、悲伤、愤怒、恐惧、厌恶、惊讶、平常' after `title`,
 add column   `weather` varchar(20) NOT NULL DEFAULT '平常' COMMENT '天气选项 晴天、雨天、多云天、雾天、沙天、尘天、平常' after `mood`,
 add column   `location` varchar(125) NOT NULL DEFAULT '' COMMENT '地点' after `weather`;