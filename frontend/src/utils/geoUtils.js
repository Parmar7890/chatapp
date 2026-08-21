export function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if(!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
            return;
        }
        navigator.geolocation.watchPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => reject(error),
            { enableHighAccuracy: true }
        )}   
)

}

export function watchLocation(onLocationUpdate) {
    if(!navigator.geolocation) {
        console.error('Geolocation is not supported');
        return null;
    }

    return navigator.geolocation.watchPosition(
        (position) => {
            onLocationUpdate({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
        },
        (error) => console.error('Location error:', error),
        {enableHighAccuracy: true}
    );
}

export function clearLocationWatch(watchId) {
    if(watchId != null) {
        navigator.geolocation.clearWatch(watchId);
    }
}