package novelListController

import (
	"github.com/kataras/iris"
	"noverScratch-go/model/novelListModel"
	"noverScratch-go/redis"
	"encoding/json"
	"fmt"
)

// getNovelInfo
func GetNovelInfo(ctx iris.Context) {
	novelId := ctx.FormValue("novelId")
	queryStr := "select * from novelList where novel_id = " + novelId
	novel := novelListModel.DbExecString(queryStr)
	ctx.JSON(iris.Map{
		"data": novel,
		"status": 1,
	})
}

// get top 5 popalar novel
func GetTopFivePopularNovel(ctx iris.Context) {
	queryStr := "select * from novelList"
	novel := novelListModel.DbExecString(queryStr)
	fmt.Println(novel)
	ctx.JSON(iris.Map{
		"data": novel,
		"status": 1,
	})
}

// get all chapters by novel_id
func GetNovelAllChapter(ctx iris.Context) {
	novelId := ctx.FormValue("novelId")
	queryStr := "select chapter_id, chapter_name, chapter_index from novelChapter where novel_id = " + novelId
	chapters := novelListModel.DbExecString(queryStr)
	ctx.JSON(iris.Map{
		"data": chapters,
		"status": 1,
	})
}

// get each chapter data
func GetSpecificChapter(ctx iris.Context) {
	chapterId := ctx.FormValue("chapterId")
	queryStr := "select * from novelChapter where chapter_id = " + chapterId
	chapter := novelListModel.DbExecString(queryStr)
	ctx.JSON(iris.Map{
		"data": chapter,
		"status": 1,
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
