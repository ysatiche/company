package route

import (
	"noverScratch-go/controller/novelListController"
	"github.com/kataras/iris"
)

func RegisterRoute(app *iris.Application) error {
	// v1 接口
	v1 := app.Party("/v1")
	{
		v1.Get("/getNovelInfo", novelListController.GetNovelInfo)
		v1.Get("/insertNovel", novelListController.InsertNovel)
		v1.Get("/getSpecificChapter", novelListController.GetSpecificChapter)
	}
	// 404 error handle
	app.OnErrorCode(iris.StatusNotFound, func(ctx iris.Context) {
		ctx.WriteString("404 Not Found")
	})

	return nil
}