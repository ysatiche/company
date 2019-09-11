package novelListModel

import (
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
)

func DbConn () (db *sql.DB) {
	dbDriver := "mysql"
	dbUser := "root"
	dbPass := "chenye1234"
	dbName := "novel"
	db, err := sql.Open(dbDriver, dbUser + ":" + dbPass + "@tcp(127.0.0.1:3306)/" + dbName)
	if err != nil {
		panic(err.Error())
	}
	return db
}

func ExecSql (sql string) (res *sql.Rows){
	db := DbConn()
	res, err := db.Query(sql)
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()
	return res
}