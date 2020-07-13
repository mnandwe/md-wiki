package models


type Article struct {
 
  Name      string     `json:"name,omitempty"`
  Content   string     `json:"content,omitempty"`
}