package novelListModel

import (
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
	"fmt"
)

type NovelList struct {
	NovelId int
	NovelName string `validate:"required"`
	NovelAuthor string `validate:"required"`
	NovelCoverImgUrl string `validate:"required"`
	NovelOrigin string `validate:"required"`
	NovelOriginUrl string `validate:"required"`
	NovelDescription string `validate:"required"`
	NovelClass string `validate:"required"`
	NovelProcess string `validate:"required"` 
}

type NovelChapter struct {
	ChapterId int
	NovelId int
	ChapterName string
	ChapterContent string
	chapterIndex int
}

func InserNovel (novel *NovelList) {
	db := DbConn()
	insForm, err := db.Prepare("INSERT INTO novelList(novel_name, novel_author, novel_url) VALUES(?,?,?)")
	if err != nil {
		panic(err.Error())
	}
	insForm.Exec(novel.NovelName, novel.NovelAuthor, novel.NovelCoverImgUrl)
	defer db.Close()
}

// get chapter data
func GetSpecificChapter (chapterIndex string)(res *sql.Rows){
	db := DbConn()
	fmt.Println("chapterIndex")
	fmt.Println(chapterIndex)
	res, err := db.Query("select * from novelChapter where chapter_index = ?",  chapterIndex)
	if err != nil {
		panic(err.Error())
	}
	fmt.Println(res.Columns())
	defer db.Close()
	return res
}
