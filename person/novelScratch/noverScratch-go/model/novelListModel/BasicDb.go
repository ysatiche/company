package novelListModel

import (
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
	"time"
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

// query interface func
func DbExecString(sqlstring string) string {
	conn := DbConn()
	defer conn.Close()
	stmt, err := conn.Prepare(sqlstring)
	if err != nil {
		return "Error"
	}
	defer stmt.Close()
	rows, err := stmt.Query()
	if err != nil {
		return "Error"
	}
	defer rows.Close()
	// Get column names
	columns, err := rows.Columns()
	if err != nil {
		panic(err.Error()) // proper error handling instead of panic in your app
	}
	// Make a slice for the values
	values := make([]sql.RawBytes, len(columns))
	// rows.Scan wants '[]interface{}' as an argument, so we must copy the
	// references into such a slice
	// See http://code.google.com/p/go-wiki/wiki/InterfaceSlice for details
	scanArgs := make([]interface{}, len(values))
	for i := range values {
		scanArgs[i] = &values[i]
	}
	// Fetch rows
	var jsonstring string
	jsonstring = "{\"timestamp\": \"" + time.Now().Format("2006-01-02 15:04:05") + "\",\"data\":["
	allcount := 0
	for rows.Next() {
		jsonstring += "{"
		// get RawBytes from data
		err = rows.Scan(scanArgs...)
		if err != nil {
			panic(err.Error()) // proper error handling instead of panic in your app
		}
		var value string
		for i, col := range values {
			if col == nil {
				value = "NULL"
			} else {
				value = string(col)
			}
			if i == len(values)-1 {
				jsonstring += "\"" + columns[i] + "\":\"" + value + "\""
			} else {
				jsonstring += "\"" + columns[i] + "\":\"" + value + "\","
			}
		}
		jsonstring += "},"
		allcount++
	}
	if allcount > 0 {
		// jsonstring = Substr(jsonstring, 0, len(jsonstring)-1)
		jsonstring = jsonstring[0:len(jsonstring)-1]
	}
	jsonstring += "]}"
	if err = rows.Err(); err != nil {
		panic(err.Error()) // proper error handling instead of panic in your app
	}
	return jsonstring
}