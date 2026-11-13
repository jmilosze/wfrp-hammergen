package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"os"

	"github.com/jmilosze/wfrp-hammergen-go/internal/dependencies/mongodb"
)

func envOr(name string, fallback string) string {
	if v := os.Getenv(name); v != "" {
		return v
	}
	return fallback
}

func main() {
	uri := flag.String("uri", envOr("MONGO_URI", "mongodb://admin:admin@localhost:27017"), "MongoDB URI (defaults to MONGO_URI)")
	dbName := flag.String("db", envOr("DB_NAME", "hammergenGo"), "Database name (defaults to DB_NAME)")
	flag.Parse()

	db, err := mongodb.NewDbService(*uri, *dbName)
	if err != nil {
		log.Fatal(err)
	}
	defer func() {
		if err := db.Disconnect(); err != nil {
			log.Print(err)
		}
	}()

	checked, failures, err := mongodb.FindDecodeFailures(context.Background(), db)
	for _, f := range failures {
		fmt.Printf("%s %s: %v\n", f.Collection, f.Id, f.Err)
	}
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Database %s: %d documents checked, %d the API cannot read\n", *dbName, checked, len(failures))
	if len(failures) > 0 {
		os.Exit(1)
	}
}
