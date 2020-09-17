package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
)

// var variable *package.Type in pkg
var tpl *template.Template

// var style *styles.CSS

type pageData struct {
	Title     string
	FirstName string
}

func init() {
	tpl = template.Must(template.ParseGlob("templates/*.gohtml"))
}

func main() {
	fmt.Println("Running Server on port: 8080")

	// apply /pub/css/style.css to web app
	http.Handle("/public/", http.StripPrefix("/public", http.FileServer(http.Dir("./pub"))))

	http.HandleFunc("/", idx)                           // index
	http.HandleFunc("/about", abot)                     // about
	http.HandleFunc("/contact", cntct)                  // contact
	http.HandleFunc("/apply", aply)                     // apply
	http.HandleFunc("/apps", apps)                      // apps
	http.HandleFunc("/apps/countdown", count)           // countdown timer
	http.HandleFunc("/apps/recipe", recipe)           	// recipe app  
	http.Handle("/favicon.ico", http.NotFoundHandler()) // don't err on favicon

	// nil means use DefaultServeMux
	http.ListenAndServe(":8080", nil)
}

func idx(w http.ResponseWriter, req *http.Request) {

	pd := pageData{
		Title: "Index Page",
	}

	err := tpl.ExecuteTemplate(w, "index.gohtml", pd)
	if err != nil {
		log.Printf("LOGGED: %s", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	// fmt.Println("we got to: " + req.URL.Path) // print out the path of the URL request
}

func apps(w http.ResponseWriter, req *http.Request) {
	pd := pageData{
		Title: "Apps Page",
	}

	err := tpl.ExecuteTemplate(w, "apps.gohtml", pd)
	if err != nil {
		log.Println("LOGGED:", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
}
func count(w http.ResponseWriter, req *http.Request) {
	pd := pageData{
		Title: "Countdown Timer",
	}

	err := tpl.ExecuteTemplate(w, "countdown.gohtml", pd)
	if err != nil {
		log.Println("LOGGED:", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
}
func recipe(w http.ResponseWriter, req *http.Request) {
	pd := pageData{
		Title: "Recipes",
	}

	err := tpl.ExecuteTemplate(w, "recipe.gohtml", pd)
	if err != nil {
		log.Println("LOGGED:", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
}

func abot(w http.ResponseWriter, req *http.Request) {
	pd := pageData{
		Title: "About Page",
	}

	err := tpl.ExecuteTemplate(w, "about.gohtml", pd)
	if err != nil {
		log.Println("LOGGED:", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
}

func cntct(w http.ResponseWriter, req *http.Request) {
	pd := pageData{
		Title: "Contact Page",
	}

	err := tpl.ExecuteTemplate(w, "contact.gohtml", pd)
	if err != nil {
		log.Println("LOGGED:", err)
		http.Error(w, "Internal Server Error ", http.StatusInternalServerError)
		return
	}
}

func aply(w http.ResponseWriter, req *http.Request) {
	pd := pageData{
		Title: "Apply Page",
	}

	var first string
	if req.Method == http.MethodPost {
		first = req.FormValue("fname")
		pd.FirstName = first
	}

	err := tpl.ExecuteTemplate(w, "apply.gohtml", pd)
	if err != nil {
		log.Println("LOGGED:", err)
		http.Error(w, "Internal Server Error ", http.StatusInternalServerError)
		return
	}
}
