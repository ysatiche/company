package novelListController

import (
	"github.com/kataras/iris"
	"noverScratch-go/model/novelListModel"
	"noverScratch-go/redis"
	"encoding/json"
)

// getNovelInfo
func GetNovelInfo(ctx iris.Context) {

}

// insert novel
func InsertNovel(ctx iris.Context) {
	novelName := ctx.FormValue("novelName")
	novelAuthor := ctx.FormValue("novelAuthor")
	novelUrl := ctx.FormValue("novelUrl")
	novel := &novelListModel.Novel{
		NovelName: novelName,
		NovelAuthor: novelAuthor,
		NovelUrl: novelUrl,
	}
	novelListModel.InserNovel(novel)
	b, err := json.Marshal(novel)
	if err != nil {
		panic(err)
	}
	err = redis.PutCacheNovelList(string(b))
	novelList, error := redis.GetCacheNovelList()
	if error != nil {
		panic(error)
	}
	ctx.JSON(iris.Map{
		"data": novelList,
	})
}
