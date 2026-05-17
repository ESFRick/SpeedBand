package webui

import (
	"embed"
	"io/fs"
	"net/http"
)

//go:embed static/*
var files embed.FS

func StaticFS() http.FileSystem {
	sub, err := fs.Sub(files, "static")
	if err != nil {
		panic(err)
	}
	return http.FS(sub)
}

func ReadStatic(name string) ([]byte, error) {
	return files.ReadFile("static/" + name)
}
