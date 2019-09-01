drop database if exists novel;

create database novel;

use novel;

create table novelList
(
  novel_id bigint(20) unsigned not null auto_increment,
  novel_name varchar(25) not null,
  novel_author varchar(25) not null,
  novel_url varchar(80) not null,
  primary key(novel_id),
  index (novel_name),
  index (novel_author)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;