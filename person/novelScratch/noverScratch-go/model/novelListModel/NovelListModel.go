package novelListModel

type Novel struct {
	NovelName string `validate:"required"`
	NovelAuthor string `validate:"required"`
	NovelUrl string `validate:"required"`
}

func InserNovel (novel *Novel) {
	db := DbConn()
	insForm, err := db.Prepare("INSERT INTO novelList(novel_name, novel_author, novel_url) VALUES(?,?,?)")
	if err != nil {
		panic(err.Error())
	}
	insForm.Exec(novel.NovelName, novel.NovelAuthor, novel.NovelUrl)
	defer db.Close()
}
