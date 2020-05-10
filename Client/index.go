package main

import (
	"fmt"
	"html/template"
	"net/http"
)

func index(_w http.ResponseWriter, _r *http.Request) {
	t := template.Must(template.ParseFiles("index.html"))
	t.Execute(_w, "")
}

func main() {
	http.Handle("/css/", http.StripPrefix("/css/", http.FileServer(http.Dir("css/"))))
	http.Handle("/js/", http.StripPrefix("/js/", http.FileServer(http.Dir("js/"))))

	http.HandleFunc("/", index)

	fmt.Printf("Frontend initialized on port 8000. http://localhost:8000/")
	http.ListenAndServe(":8000", nil)
}
