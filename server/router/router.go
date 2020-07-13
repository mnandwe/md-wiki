package router

import (
	"../middleware"
	"github.com/gorilla/mux"
)

// Router is exported and used in main.go
func Router() *mux.Router {

	router := mux.NewRouter()

	router.HandleFunc("/articles/", middleware.GetAllArticles).Methods("GET", "OPTIONS")
	router.HandleFunc("/articles/{name}", middleware.CreateArticle).Methods("PUT", "OPTIONS")
	router.HandleFunc("/articles/{name}", middleware.GetArticle).Methods("GET", "OPTIONS")
	return router
}
