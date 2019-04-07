---
title: MySQL 笔记
date: 2017-03-26 16:10:11
updated: 2017-10-20 00:00:00
categories:
- 笔记小抄
tags:
- mysql
- note
---


这是一篇关于 MySQL 的语法笔记，主要供自己和新手们查看。
<!-- more -->

## 参考资料

写在最前面...当然是不要重复造轮子！做笔记也是如此！So ~ 先引用一发：

- **[21分钟 MySQL 入门教程](http://www.cnblogs.com/mr-wid/archive/2013/05/09/3068229.html)**

## 遣词造句

像翻译英语句子一样来记录语法。

#### 按用户名查询用户的所有昵称

```sql
SELECT DISTINCT(nick) FROM TABLE_SAMPLE WHERE name IN
(SELECT name FROM TABLE_SAMPLE GROUP BY name)
```

#### 按月以及平台查询用户数

```sql
SELECT
DATE_FORMAT(time, '%Y-%m') months, COUNT(DISTINCT(uid)) AS user_count
FROM TABLE_SAMPLE GROUP BY months, platforms
```

#### 查询时间单位的数据总和

```mysql
# 每分钟
SELECT
SUM(data) AS sum
FROM TABLE_SAMPLE GROUP BY YEAR(time), MONTH(time), DAY(time), HOUR(time), MINUTE(time)

# 每10分钟
SELECT
SUM(data) AS sum
FROM TABLE_SAMPLE GROUP BY YEAR(time), MONTH(time), DAY(time), HOUR(time), FLOOR(MINUTE(time)/10)

# 每小时
SELECT
SUM(data) AS sum
FROM TABLE_SAMPLE GROUP BY YEAR(time), MONTH(time), DAY(time), HOUR(time)

# 后面依此类推...
```

#### 查询每小时的数据总和



#### 一次查询里查询多样数据

```sql
SELECT
(SELECT uid FROM TABLE_SAMPLE_1 WHERE name = '我最帅') AS uid,
(SELECT height FROM TABLE_SAMPLE_2 WHERE name = '我最帅') AS height
```

#### 一次更新多条数据

```sql
UPDATE TABLE_SAMPLE
SET credit = credit + CASE
  WHEN name = '我最帅' THEN 1000
  WHEN name = '我不帅' THEN 0 END,
  time = CURRENT_DATE
WHERE name IN ('我最帅', '我不帅')
```

#### 一次插入多条数据

```sql
INSERT INTO TABLE_SAMPLE (name, credit)
VALUES ('我最帅', 1000), ('我不帅', 0)
```


## Tips

- 字串存在： `LOCATE(你要查的字符串，对应的域) > 0`
- 字串连接：`CONCAT(STR1, STR2, ...)` ， `CONCAT_WS` 第一个参数是分隔符
- 时间：`FROM_UNIXTIME` 和 `UNIX_TIMESTAMP`
- 查看倒数第 20 到 30 笔数据：`ORDER BY id DESC LIMIT 20, 30`
- 日期：`CURDATE() = DATE(NOW())`