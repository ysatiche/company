drop database if exists novel;

create database novel;

use novel;

create table novelList
(
  novel_id bigint(20) unsigned not null auto_increment,
  novel_name varchar(25) not null,
  novel_author varchar(25) not null,
  novel_cover_img_url varchar(80) not null,
  novel_origin varchar(80) not null,
  novel_origin_url varchar(80) not null,
  novel_desciption varchar(300) not null,
  novel_class varchar(50) not null,
  primary key(novel_id),
  index (novel_name),
  index (novel_author)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table novelChapter
(
  chapter_id bigint(20) unsigned not null auto_increment,
  novel_id bigint(20) unsigned not null,
  chapter_name varchar(80) not null,
  chapter_content text not null,
  chapter_index int not null,
  primary key(chapter_id),
  index (novel_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table novelUser
(
  user_id bigint(20) unsigned not null auto_increment,
  user_email varchar(60) not null,
  user_password varchar(50) not null,
  user_vip_level varchar(10) not null,
  primary key (user_id),
  unique key (user_email),
  index (user_vip_level)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;