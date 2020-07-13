package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"./models"
	"./router"
)

func TestCreateArticle(t *testing.T) {
	testReq := "This is a wiki"

	req := httptest.NewRequest("PUT", "/articles/wiki", bytes.NewBuffer([]byte(testReq)))

	// We create a ResponseRecorder (which satisfies http.ResponseWriter) to record the response.
	rr := httptest.NewRecorder()
	router.Router().ServeHTTP(rr, req)
	// Check the status code is what we expect.
	if status := rr.Code; status != http.StatusCreated {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	//update existing article
	testReq = "A wiki is a knowledge base websiteThis is a wiki"
	req = httptest.NewRequest("PUT", "/articles/wiki", bytes.NewBuffer([]byte(testReq)))

	// We create a ResponseRecorder (which satisfies http.ResponseWriter) to record the response.
	rr = httptest.NewRecorder()
	router.Router().ServeHTTP(rr, req)
	// Check the status code is what we expect.
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}
}

func TestGetArticle(t *testing.T) {
	testReq := "A wiki is a knowledge base website"

	// add an article
	req := httptest.NewRequest("PUT", "/articles/wiki", bytes.NewBuffer([]byte(testReq)))
	rr := httptest.NewRecorder()
	router.Router().ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	// try get an article
	req2 := httptest.NewRequest("GET", "/articles/wiki", nil)
	rr2 := httptest.NewRecorder()
	router.Router().ServeHTTP(rr2, req2)

	expected := "A wiki is a knowledge base website"
	if !strings.Contains(rr2.Body.String(), expected) {
		t.Errorf("handler returned unexpected body: got %v want %v",
			rr2.Body.String(), expected)
	}
}

func TestGetAllArticles(t *testing.T) {
	testReq := "This is a wiki"
	prepReq := httptest.NewRequest("PUT", "/articles/wiki", bytes.NewBuffer([]byte(testReq)))
	prepRr := httptest.NewRecorder()

	router.Router().ServeHTTP(prepRr, prepReq)
	if status := prepRr.Code; status != http.StatusCreated && status != http.StatusOK {
		t.Error("failed to add article to prep test")
	}

	req, err := http.NewRequest("GET", "/articles/", nil)
	if err != nil {
		t.Fatal(err)
	}
	if err != nil {
		panic(err)
	}

	rr := httptest.NewRecorder()
	router.Router().ServeHTTP(rr, req)

	// Check the status code is what we expect.
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusNotFound)
	}

	expected := []models.Article{}

	resp := json.Unmarshal(rr.Body.Bytes(), &expected)
	if len(expected) < 1 {
		t.Errorf("handler returned unexpected body: got %v want an array",
			resp)
	}

}
