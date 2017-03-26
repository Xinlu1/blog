---
title: MySQL 笔记
date: 2017-03-26 16:10:11
tags:
- mysql
- note
---

这是一篇关于 MySQL 的技术笔记，记录了一些常用的语法，供未来参考。

## 参考资料

不要重复造轮子！写文章也是一样！So ~ 先引用一发：

- **[21分钟 MySQL 入门教程](http://www.cnblogs.com/mr-wid/archive/2013/05/09/3068229.html)**

## 遣词造句

下面像翻译英语句子一样，来记录一下语法。

#### 按用户名查询用户的所有昵称

```mysql
SELECT DISTINCT(nick) FROM TABLE_SAMPLE WHERE name IN
(SELECT name FROM SSSS GROUP BY name)
```

#### 按月和平台查询用户数

```mysql
SELECT
DATE_FORMAT(time, '%Y-%m') months, COUNT(DISTINCT(uid)) AS user_count
FROM TABLE_SAMPLE GROUP BY months, platforms
```

#### 一次查询里查询多种数据

```mysql
SELECT
(SELECT uid FROM SSSS1 WHERE name = '我最帅') AS uid,
(SELECT height FROM SSSS2 WHERE name = '我最帅') AS height
```

#### 一次更新多条数据

```mysql
UPDATE SSSS
SET credit = credit + CASE WHEN name = '我最帅' THEN 1000
					   WHEN name = '我不帅' THEN 0 END,
	time = CURRENT_DATE
WHERE name IN ('我最帅', '我不帅')
```

#### 一次插入多条数据

```mysql
INSERT INTO SSSS (name, credit)
VALUES ('我最帅', 1000), ('我不帅', 0)
```

## Tips

- 字串是否存在： `LOCATE(你要查的字符串，对应的域) > 0`
- 连接：`CONCAT(STR1, STR2, ...)` ，还有 `CONCAT_WS` 第一个参数是分隔符
- 时间：`FROM_UNIXTIME` 和 `UNIX_TIMESTAMP`
- 查看倒数第 20 到 30 笔数据：`ORDER BY id DESC LIMIT 20, 30`
- 日期：`CURDATE() = DATE(NOW())`