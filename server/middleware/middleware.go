package middleware

import (
	//"context"
	"encoding/json"
	"io/ioutil"

	//"fmt"
	"log"
	"net/http"

	"../models"
	"github.com/gorilla/mux"
)

// GetArticleResponse get article response in an object
type GetArticleResponse struct {
	Content string `json:",omitempty"`
}

var articles []models.Article

// GetAllArticles get all the articles route
func GetAllArticles(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET")
	w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

	resp, status := getAllArticles()

	w.WriteHeader(status)
	w.Header().Set("Context-Type", "application/json")
	log.Printf("Status : GetAllArticles %d", status)
	json.NewEncoder(w).Encode(resp)
}

// get all article names  return them
func getAllArticles() ([]string, int) {
	var articleNames []string
	for i := 0; i < len(articles); i++ {
		articleNames = append(articleNames, articles[i].Name)
	}
	return articleNames, http.StatusOK
}

// CreateArticle create article route
func CreateArticle(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Methods", "PUT,OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
	w.Header().Set("Access-Control-Max-Age", "86400")

	if r.Method == http.MethodOptions {
		// CORS preflight
		return
	}
	status := createArticle(w, r)
	log.Printf("Status  : CreateArticleRequest %d", status)
	w.WriteHeader(status)
}

func createArticle(w http.ResponseWriter, r *http.Request) int {
	name := mux.Vars(r)["name"]
	if name == "" {
		log.Print("No name given")
		return http.StatusBadRequest
	}
	if r.Body == nil {
		log.Print("Body empty")
		return http.StatusBadRequest
	}

	var req string
	body, err := ioutil.ReadAll(r.Body)
	defer r.Body.Close()
	req = string(body)
	if err != nil {
		log.Print("Error", err)
		return http.StatusBadRequest
	}

	if req == "" {
		log.Print("Content empty")
		return http.StatusBadRequest
	}

	article := models.Article{
		Name:    name,
		Content: req,
	}
	//get article if it exists and change its content
	ind := getArticleIndex(name)

	if ind != -1 {
		articles[ind].Content = article.Content
		return http.StatusOK
	}
	articles = append(articles, article)

	return http.StatusCreated
}

// GetArticle get specifict article
func GetArticle(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")

	resp, status := getArticle(r)
	log.Printf("Status : %d", status)
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(resp)

}

// Get one article in the DB
func getArticle(r *http.Request) (GetArticleResponse, int) {
	name := mux.Vars(r)["name"]
	if name == "" {
		return GetArticleResponse{}, http.StatusBadRequest
	}

	for i := 0; i < len(articles); i++ {
		if articles[i].Name == name {
			return GetArticleResponse{Content: articles[i].Content}, http.StatusOK
		}
	}
	// not fouund
	return GetArticleResponse{}, http.StatusNotFound
}

func getArticleIndex(name string) int {
	for i := 0; i < len(articles); i++ {
		if articles[i].Name == name {
			return i
		}
	}
	return -1
}
