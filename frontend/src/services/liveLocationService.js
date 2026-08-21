import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { WS_URL } from '../config/config';

let locationStompClient = null;
let currentLocationSubscription = null;

export function connectLiveLocations(geohash, onLocationUpdate) {
  locationStompClient = new Client({
    webSocketFactory: () => new SockJS(WS_URL),
    reconnectDelay: 5000,
    onConnect: () => {
      subscribeToLocations(geohash, onLocationUpdate);
    },
    onStompError: (frame) => console.error('Location STOMP error:', frame.headers['message']),
  });

  locationStompClient.activate();
}

export function subscribeToLocations(geohash, onLocationUpdate) {
  if (!locationStompClient || !locationStompClient.connected) return;

  if (currentLocationSubscription) {
    currentLocationSubscription.unsubscribe();
  }

  currentLocationSubscription = locationStompClient.subscribe(
    `/topic/group-${geohash}-locations`,
    (message) => {
      onLocationUpdate(JSON.parse(message.body));
    }
  );
}

export function disconnectLiveLocations() {
  if (locationStompClient) {
    locationStompClient.deactivate();
    locationStompClient = null;
    currentLocationSubscription = null;
  }
}