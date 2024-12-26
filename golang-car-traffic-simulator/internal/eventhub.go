package internal

import (
	"encoding/json"
	"errors"
	"fmt"
	"go.mongodb.org/mongo-driver/mongo"
)

type EventHub struct {
	RouteService  *RouteService
	mongoClient   *mongo.Client
	chDriverMoved chan *DriverMovedEvent
}

func (eh *EventHub) HandlerEvent(msg []byte) error {
	var baseEvent struct {
		EventName string `json:"event"`
	}
	err := json.Unmarshal(msg, &baseEvent)
	if err != nil {
		return fmt.Errorf("error unmarshal")
	}

	switch baseEvent.EventName {
	case "RouteCreated":
		var event RouteCreatedEvent
		err := json.Unmarshal(msg, &event)
		if err != nil {
			return fmt.Errorf("error unmarshalling event: %w", err)
		}
	case "DeliveryStarted":
	default:
		return errors.New("unknown event")
	}
	return nil
}

//1:35
