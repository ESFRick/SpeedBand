package server

import (
	"math/rand"
	"net/http"
)

type Config struct {
	Host  string
	Port  int
	Debug bool
}

type Server struct {
	config      Config
	randomBlock []byte
	activeTests chan struct{}
}

func New(config Config) *Server {
	block := make([]byte, 1024*1024)
	src := rand.New(rand.NewSource(1337))
	if _, err := src.Read(block); err != nil {
		panic(err)
	}
	return &Server{
		config:      config,
		randomBlock: block,
		activeTests: make(chan struct{}, 8),
	}
}

func (s *Server) Handler() http.Handler {
	mux := http.NewServeMux()
	s.registerRoutes(mux)
	return s.withRequestHeaders(mux)
}
