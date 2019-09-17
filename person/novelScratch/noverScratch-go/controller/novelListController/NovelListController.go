package novelListController

import (
	"github.com/kataras/iris"
	"noverScratch-go/model/novelListModel"
	"noverScratch-go/redis"
	"encoding/json"
)

// getNovelInfo
func GetNovelInfo(ctx iris.Context) {
	novelId := ctx.FormValue("novelId")
	queryStr := "select * from novellist where novel_id = " + novel_id
	novel := novelListModel.DbExecString(queryStr)
	ctx.JSON(iris.Map{
		"data": novel,
	})
}

// get each chapter data
func GetSpecificChapter(ctx iris.Context) {
	novelId := ctx.FormValue("novelId")
	chapterIndex := ctx.FormValue("chapterIndex")
	queryStr := "select * from novelChapter where chapter_index = " + chapterIndex + " and novel_id = " + novel_id
	chapter := novelListModel.DbExecString(queryStr)
	ctx.JSON(iris.Map{
		"data": chapter,
	})
}

// insert novel
func InsertNovel(ctx iris.Context) {
	novelName := ctx.FormValue("novelName")
	novelAuthor := ctx.FormValue("novelAuthor")
	novelUrl := ctx.FormValue("novelUrl")
	novel := &novelListModel.NovelList{
		NovelName: novelName,
		NovelAuthor: novelAuthor,
		NovelCoverImgUrl: novelUrl,
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
