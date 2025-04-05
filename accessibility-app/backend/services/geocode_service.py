import requests

def reverse_geocode(lat: float, lon: float) -> dict:
    url = f"https://nominatim.openstreetmap.org/reverse"
    params = {"lat": lat, "lon": lon, "format": "json"}
    response = requests.get(url, params=params)
    return response.json()
