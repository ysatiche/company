package main

import (
  "fmt"
  "time"
  "encoding/json"
  "io/ioutil"
  "os"
  "io"
  "net/http"
  "path/filepath"
  "strconv"
  "bufio"
  // "regexp"
  // "strings"
)

// define data structure 
type AudioInfo struct {
  URL string `json:"url"`
  TITLE string `json:"title"`
  IDX int `json:"idx"`
}

const (
  startPageNum = 21
)


func main () {
  t1 := time.Now()
  audioArr := readJson("./test1.json")
  var failArr []AudioInfo
  // failArr := make([]AudioInfo, len(audioArr), len(audioArr))
  // copy(failArr, audioArr)
  // 循环下载 针对文件下载失败情况
  // for {
  //   if len(failArr) < len(audioArr) {
  //     fmt.Println("文件下载失败列表:")
  //     for i:=0; i < len(failArr);i++ {
  //       fmt.Println(failArr[i].TITLE)
  //     }
  //   }
  //   if int(len(failArr) * 15) < len(audioArr)  {
  //     break
  //   }
  //   failArr = ConcurrencyDownload(audioArr)
  // }
  for i := 0; i < int(len(audioArr) / 30);i++ {
    start := i * 30
    end := (i + 1) * 30
    arr := ConcurrencyDownload(audioArr[start:end])
    failArr = append(failArr, arr...)
    if len(arr) > 0 {
      fmt.Println("本轮下载结束，失败列表总个数:", len(arr))
      for j := 0; j < len(arr); j++ {
        fmt.Println(arr[j].TITLE)
      }
    }
  }
  if len(failArr) == 0 {
    fmt.Println("全部文件下载成功！")
  }
  elapsed := time.Since(t1)
  fmt.Println("下载文件所有时间: ", elapsed)
}

func readJson (filepath string) []AudioInfo {
  // read file
  data, err := ioutil.ReadFile(filepath)
  if err != nil {
    fmt.Print(err)
  }

  // json data
  var AudioArr []AudioInfo

  // unmarshall it
  err = json.Unmarshal(data, &AudioArr)
  if err != nil {
    fmt.Println("error:", err)
  }
  return AudioArr
}

func ConcurrencyDownload (arr []AudioInfo) []AudioInfo {
  ch := make(chan int, len(arr))
  var failArr []AudioInfo
  for i := 0; i < len(arr); i++ {
    ad := arr[i]
    go func () {
      idx := DownloadAudio(ad.TITLE, ad.URL, ad.IDX)
      if idx >= 0 {
        failArr = append(failArr, ad)
      }
      ch <- idx
    }()
  }
  ov := make(chan struct{}, 0)
  totalNum := 0
  go func() {
    i := 0
    for num := range ch {
      if num >= 0 {
        totalNum++
      }
      i++
      if i == len(arr) {
        ov <- struct{}{}
      }
    }
  }()

  //超过两分钟，没有结果 ---> 结束
  select {
    case <-time.After(3600 * time.Second):
      close(ch)
      fmt.Println("time out")
    case <-ov:
      fmt.Println("all file result")
      close(ch)
  }
  return failArr
}

// download one file
func DownloadAudio (filename string, url string, idx int) int {
  pageTotalNum := 30
  index := int(idx / pageTotalNum) + startPageNum
  savedPath := filepath.Join("./download", strconv.Itoa(index))
  if _, err := os.Stat(savedPath); os.IsNotExist(err) {
    // os.Mkdir(path, mode)
    os.MkdirAll(savedPath, os.ModePerm)
  }
  // Get the data
  resp, err := http.Get(url)
  if err != nil {
    return idx
  }
  defer resp.Body.Close()

  // Create the file
  audioPath := filepath.Join(savedPath, filename)
  // check if already exist then delete
  _, err = os.Stat(audioPath)
  isFileExist := err == nil || os.IsExist(err)
  if isFileExist == true {
    fmt.Println("文件已存在：", audioPath)
    err := os.Remove(audioPath)
    if err != nil {
      return idx
    }
  }
  file, err := os.Create(audioPath)
  wt := bufio.NewWriter(file)
  if err != nil {
    return idx
  }
  defer file.Close()

  // write the body to file
  _, err = io.Copy(file, resp.Body)
  // fmt.Println(filename)
  // fmt.Println("[file size]", n)
  if err != nil {
    return idx
  }
  wt.Flush()
  return -1
}





