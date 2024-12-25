package internal

import "go.mongodb.org/mongo-driver/mongo"

type EventHub struct {
	RouteService  *RouteService
	mongoClient   *mongo.Client
	chDriverMoved chan *DriverMovedEvent
}
