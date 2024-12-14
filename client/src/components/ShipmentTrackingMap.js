// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { MapPin, Navigation, Crosshair, Bike, Car, Truck } from 'lucide-react';

// const libraries = ["places", "geometry"];

// const mapContainerStyle = {
//     width: '100%',
//     height: '500px',
// };

// const center = {
//     lat: 20,
//     lng: 0,
// };

// const ShipmentTrackingMap = () => {
//     const [map, setMap] = useState(null);
//     const [directionsResponse, setDirectionsResponse] = useState(null);
//     const [distance, setDistance] = useState('');
//     const [duration, setDuration] = useState('');
//     const [travelMode, setTravelMode] = useState('DRIVING');
//     const [userLocation, setUserLocation] = useState(null);
//     const [estimatedTimes, setEstimatedTimes] = useState({});
//     const [selectedMode, setSelectedMode] = useState(null);

//     const mapRef = useRef(null);
//     const originRef = useRef(null);
//     const destinationRef = useRef(null);
//     const mapInstanceRef = useRef(null);
//     const markerRef = useRef(null);
//     const directionsRendererRef = useRef(null);

//     const apiKey = 'AlzaSylmZy5-Fsdp8ENm1NbfNFVMvq6CnW-1MAz';

//     useEffect(() => {
//         if (window.google && window.google.maps) {
//             initializeMap();
//         } else {
//             const script = document.createElement('script');
//             script.src = `https://maps.gomaps.pro/maps/api/js?key=${apiKey}&libraries=${libraries.join(',')}&callback=initMap`;
//             script.async = true;
//             script.defer = true;
//             script.onload = initializeMap;
//             document.head.appendChild(script);

//             return () => {
//                 document.head.removeChild(script);
//             };
//         }
//     }, []);

//     const initializeMap = () => {
//         if (!mapRef.current) return;

//         const mapOptions = {
//             center: center,
//             zoom: 15,
//             styles: [
//                 {
//                     featureType: "poi",
//                     elementType: "labels",
//                     stylers: [{ visibility: "off" }]
//                 }
//             ]
//         };

//         mapInstanceRef.current = new window.google.maps.Map(mapRef.current, mapOptions);
//         setMap(mapInstanceRef.current);

//         directionsRendererRef.current = new window.google.maps.DirectionsRenderer();
//         directionsRendererRef.current.setMap(mapInstanceRef.current);

//         // Get user's current location
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     const userPos = {
//                         lat: position.coords.latitude,
//                         lng: position.coords.longitude
//                     };
//                     setUserLocation(userPos);
//                     mapInstanceRef.current.setCenter(userPos);

//                     markerRef.current = new window.google.maps.Marker({
//                         position: userPos,
//                         map: mapInstanceRef.current,
//                         icon: {
//                             path: window.google.maps.SymbolPath.CIRCLE,
//                             scale: 8,
//                             fillColor: "#4285F4",
//                             fillOpacity: 1,
//                             strokeColor: "#ffffff",
//                             strokeWeight: 2,
//                         },
//                         title: "Your Location"
//                     });
//                 },
//                 () => {
//                     console.error("Error: The Geolocation service failed.");
//                 }
//             );
//         }
//     };

//     const calculateRoute = useCallback(async () => {
//         if (!originRef.current?.value || !destinationRef.current?.value) {
//             return;
//         }
//         const directionsService = new window.google.maps.DirectionsService();
//         try {
//             const results = await directionsService.route({
//                 origin: originRef.current.value,
//                 destination: destinationRef.current.value,
//                 travelMode: window.google.maps.TravelMode[travelMode],
//             });
//             setDirectionsResponse(results);
//             directionsRendererRef.current.setDirections(results);
//             setDistance(results.routes[0].legs[0].distance.text);
//             setDuration(results.routes[0].legs[0].duration.text);

//             // Calculate estimated times for all modes
//             const modes = ['DRIVING', 'BICYCLING', 'TRANSIT', 'WALKING'];
//             const estimatedTimesPromises = modes.map(mode =>
//                 directionsService.route({
//                     origin: originRef.current.value,
//                     destination: destinationRef.current.value,
//                     travelMode: window.google.maps.TravelMode[mode],
//                 })
//             );

//             const estimatedTimesResults = await Promise.all(estimatedTimesPromises);
//             const times = {};
//             modes.forEach((mode, index) => {
//                 times[mode] = estimatedTimesResults[index].routes[0].legs[0].duration.text;
//             });
//             setEstimatedTimes(times);
//         } catch (error) {
//             console.error('Error calculating route:', error);
//         }
//     }, [travelMode]);

//     const clearRoute = useCallback(() => {
//         setDirectionsResponse(null);
//         directionsRendererRef.current.setDirections(null);
//         setDistance('');
//         setDuration('');
//         setEstimatedTimes({});
//         setSelectedMode(null);
//         if (originRef.current) originRef.current.value = '';
//         if (destinationRef.current) destinationRef.current.value = '';
//     }, []);

//     const AutocompleteInput = ({ inputRef, placeholder }) => {
//         useEffect(() => {
//             if (window.google && window.google.maps && inputRef.current) {
//                 const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);
//                 autocomplete.addListener('place_changed', () => {
//                     const place = autocomplete.getPlace();
//                     if (place.geometry) {
//                         mapInstanceRef.current.panTo(place.geometry.location);
//                         mapInstanceRef.current.setZoom(15);
//                     }
//                 });
//             }
//         }, [inputRef]);

//         return (
//             <input
//                 ref={inputRef}
//                 placeholder={placeholder}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//         );
//     };

//     const TransportModeIcon = ({ mode, estimated }) => {
//         const IconComponent = mode === 'BICYCLING' ? Bike : mode === 'DRIVING' ? Car : Truck;
//         return (
//             <div
//                 className={`flex items-center justify-center w-12 h-12 rounded-full cursor-pointer transition-colors duration-200 ${selectedMode === mode ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
//                 onClick={() => {
//                     setTravelMode(mode);
//                     setSelectedMode(mode);
//                     setDuration(estimatedTimes[mode]);
//                 }}
//             >
//                 <IconComponent size={24} />
//             </div>
//         );
//     };

//     return (
//         <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
//             <div className="p-6">
//                 <h2 className="text-2xl font-bold mb-6">Real-Time Mapping</h2>
//                 <div className="space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <AutocompleteInput inputRef={originRef} placeholder="Enter origin" />
//                         <AutocompleteInput inputRef={destinationRef} placeholder="Enter destination" />
//                     </div>
//                     <div className="flex items-center space-x-4">
//                         <button
//                             onClick={calculateRoute}
//                             className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         >
//                             Calculate Route
//                         </button>
//                         <button
//                             onClick={clearRoute}
//                             className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
//                         >
//                             Clear Route
//                         </button>
//                     </div>
//                     <div
//                         ref={mapRef}
//                         className="w-full h-[500px] rounded-lg shadow-md"
//                     />
//                     {distance && duration && (
//                         <div className="bg-gray-100 p-4 rounded-md">
//                             <h3 className="text-lg font-semibold mb-2">Route Information</h3>
//                             <div className="grid grid-cols-2 gap-4 mb-4">
//                                 <div className="flex items-center">
//                                     <MapPin className="mr-2" />
//                                     <p>Distance: {distance}</p>
//                                 </div>
//                                 <div className="flex items-center">
//                                     <Navigation className="mr-2" />
//                                     <p>Duration: {duration}</p>
//                                 </div>
//                             </div>
//                             <div className="flex items-center justify-around mb-4">
//                                 <TransportModeIcon mode="BICYCLING" estimated={estimatedTimes.BICYCLING} />
//                                 <TransportModeIcon mode="DRIVING" estimated={estimatedTimes.DRIVING} />
//                                 <TransportModeIcon mode="TRANSIT" estimated={estimatedTimes.TRANSIT} />
//                             </div>
//                             <p className="text-center text-sm text-gray-600">
//                                 Click on an icon to see estimated time for that mode of transport.
//                             </p>
//                             {selectedMode && (
//                                 <p className="mt-2 text-center font-semibold">
//                                     Estimated time by {selectedMode.toLowerCase()}: {estimatedTimes[selectedMode]}
//                                 </p>
//                             )}
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ShipmentTrackingMap;



import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Navigation, Crosshair, Bike, Car, Truck, Loader } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

const libraries = ["places", "geometry"];

const ShipmentTrackingMap = () => {
    const [map, setMap] = useState(null);
    const [directionsResponse, setDirectionsResponse] = useState(null);
    const [distance, setDistance] = useState('');
    const [duration, setDuration] = useState('');
    const [travelMode, setTravelMode] = useState('DRIVING');
    const [userLocation, setUserLocation] = useState(null);
    const [estimatedTimes, setEstimatedTimes] = useState({});
    const [selectedMode, setSelectedMode] = useState(null);
    const [simulationStatus, setSimulationStatus] = useState(null);

    const mapRef = useRef(null);
    const originRef = useRef(null);
    const destinationRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);
    const directionsRendererRef = useRef(null);
    const lorryMarkerRef = useRef(null);
    const simulationIntervalRef = useRef(null);

    const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with your actual API key

    useEffect(() => {
        if (window.google && window.google.maps) {
            initializeMap();
        } else {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${libraries.join(',')}&callback=initMap`;
            script.async = true;
            script.defer = true;
            script.onload = initializeMap;
            document.head.appendChild(script);

            return () => {
                document.head.removeChild(script);
            };
        }
    }, []);

    const initializeMap = () => {
        if (!mapRef.current) return;

        const mapOptions = {
            center: { lat: 20, lng: 0 },
            zoom: 15,
            styles: [
                {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [{ visibility: "off" }]
                }
            ]
        };

        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, mapOptions);
        setMap(mapInstanceRef.current);

        directionsRendererRef.current = new window.google.maps.DirectionsRenderer();
        directionsRendererRef.current.setMap(mapInstanceRef.current);
    };

    const startShipmentSimulation = useCallback(() => {
        if (!directionsResponse) {
            toast.error('Please calculate a route first');
            return;
        }

        // Clear any existing simulation
        if (lorryMarkerRef.current) {
            lorryMarkerRef.current.setMap(null);
        }
        if (simulationIntervalRef.current) {
            clearInterval(simulationIntervalRef.current);
        }

        // Get the route
        const route = directionsResponse.routes[0];
        const path = route.overview_path;

        // Create lorry marker
        const lorryIcon = {
            url: 'https://cdn-icons-png.flaticon.com/128/4385/4385447.png', // Replace with lorry icon URL
            scaledSize: new window.google.maps.Size(50, 50),
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(25, 25)
        };

        lorryMarkerRef.current = new window.google.maps.Marker({
            position: path[0],
            map: mapInstanceRef.current,
            icon: lorryIcon,
            title: 'Shipment Lorry'
        });

        // Start simulation
        let currentIndex = 0;
        const totalPoints = path.length;
        const midPointIndex = Math.floor(totalPoints / 2);

        setSimulationStatus('started');
        toast.success('Shipment started from source');

        simulationIntervalRef.current = setInterval(() => {
            if (currentIndex < totalPoints - 1) {
                currentIndex++;
                lorryMarkerRef.current.setPosition(path[currentIndex]);

                // Check for mid-point
                if (currentIndex === midPointIndex) {
                    toast.success('Shipment reached halfway');
                }

                // Final destination
                if (currentIndex === totalPoints - 1) {
                    clearInterval(simulationIntervalRef.current);
                    setSimulationStatus('completed');
                    toast.success('Shipment arrived at destination');
                }
            }
        }, 250); // Adjust speed as needed
    }, [directionsResponse]);

    const calculateRoute = useCallback(async () => {
        if (!originRef.current?.value || !destinationRef.current?.value) {
            return;
        }
        const directionsService = new window.google.maps.DirectionsService();
        try {
            const results = await directionsService.route({
                origin: originRef.current.value,
                destination: destinationRef.current.value,
                travelMode: window.google.maps.TravelMode[travelMode],
            });
            setDirectionsResponse(results);
            directionsRendererRef.current.setDirections(results);
            setDistance(results.routes[0].legs[0].distance.text);
            setDuration(results.routes[0].legs[0].duration.text);
        } catch (error) {
            console.error('Error calculating route:', error);
        }
    }, [travelMode]);

    const clearRoute = useCallback(() => {
        // Clear existing simulation
        if (lorryMarkerRef.current) {
            lorryMarkerRef.current.setMap(null);
        }
        if (simulationIntervalRef.current) {
            clearInterval(simulationIntervalRef.current);
        }
        setSimulationStatus(null);

        // Reset other states
        setDirectionsResponse(null);
        directionsRendererRef.current.setDirections(null);
        setDistance('');
        setDuration('');
        if (originRef.current) originRef.current.value = '';
        if (destinationRef.current) destinationRef.current.value = '';
    }, []);

    const AutocompleteInput = ({ inputRef, placeholder }) => {
        useEffect(() => {
            if (window.google && window.google.maps && inputRef.current) {
                const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);
                autocomplete.addListener('place_changed', () => {
                    const place = autocomplete.getPlace();
                    if (place.geometry) {
                        mapInstanceRef.current.panTo(place.geometry.location);
                        mapInstanceRef.current.setZoom(15);
                    }
                });
            }
        }, [inputRef]);

        return (
            <input
                ref={inputRef}
                placeholder={placeholder}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        );
    };

    return (
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <Toaster
                position="top-right"
                toastOptions={{
                    success: { duration: 5000 },
                    style: {
                        background: '#4B5563',
                        color: '#FFFFFF',
                    },
                }}
            />
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Shipment Tracking</h2>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AutocompleteInput inputRef={originRef} placeholder="Enter origin" />
                        <AutocompleteInput inputRef={destinationRef} placeholder="Enter destination" />
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={calculateRoute}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Calculate Route
                        </button>
                        <button
                            onClick={clearRoute}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Clear Route
                        </button>
                        {directionsResponse && (
                            <button
                                onClick={startShipmentSimulation}
                                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                Start Simulation
                            </button>
                        )}
                    </div>
                    <div
                        ref={mapRef}
                        className="w-full h-[500px] rounded-lg shadow-md"
                    />
                    {distance && duration && (
                        <div className="bg-gray-100 p-4 rounded-md">
                            <h3 className="text-lg font-semibold mb-2">Route Information</h3>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="flex items-center">
                                    <MapPin className="mr-2" />
                                    <p>Distance: {distance}</p>
                                </div>
                                <div className="flex items-center">
                                    <Navigation className="mr-2" />
                                    <p>Duration: {duration}</p>
                                </div>
                            </div>
                            {simulationStatus && (
                                <div className="mt-4 text-center">
                                    <p className="font-semibold">
                                        {simulationStatus === 'started' && 'Shipment in Progress'}
                                        {simulationStatus === 'completed' && 'Shipment Completed'}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShipmentTrackingMap;