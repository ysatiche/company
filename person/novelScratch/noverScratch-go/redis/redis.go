package redis

import (
	"gopkg.in/redis.v4"
)

const (
	DbName int = 0
	RedisNovelListKey string = "novelList"
)

func redisConn () (conn *redis.Client){
	client := redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
		Password: "",
		DB: 0,
	})
	return client
}

func PutCacheNovelList(novelList string) (err error) {
	redisStorage := redisConn()
	error := redisStorage.Set(RedisNovelListKey, novelList, 0).Err()
	defer redisStorage.Close()
	return error
}

func GetCacheNovelList () (novel string, err error) {
	redisStorage := redisConn()
	novelList, err := redisStorage.Get(RedisNovelListKey).Result()
	return novelList, err
}
