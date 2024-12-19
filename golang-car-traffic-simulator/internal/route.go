package internal

import (
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"math"
)

type Directions struct {
	Lat string
	Lng string
}

type Route struct {
	ID           string
	Distance     int
	Directions   []Directions
	FreightPrice float64
}

type RouteService struct {
	mongo          *mongo.Client
	freightService *FreightService
}

type FreightService struct{}

func (fs *FreightService) Calculate(distance int) float64 {
	return math.Floor((float64(distance)*0.15+0.3)*100) / 100
}

func (rs *RouteService) CreateRoute(route Route) (Route, error) {
	route.FreightPrice = rs.freightService.Calculate(route.Distance)
	update := bson.M{
		"$set": bson.M{
			"distance":      route.Distance,
			"directions":    route.Directions,
			"freight_price": route.FreightPrice,
		},
	}
	filter := bson.M{"_id": route.ID}
	opts := options.Update().SetUpsert(true)
	_, err := rs.mongo.Database("routes").Collection("routes").UpdateOne(nil, filter, update, opts)
	if err != nil {
		return Route{}, err
	}
	return route, err
}

func main() {

}

//46
