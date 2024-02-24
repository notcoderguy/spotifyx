import os
import json
import requests
import time
import datetime
import colorama

import redis

from base64 import b64encode
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
SPOTIFY_SECRET_ID = os.getenv("SPOTIFY_SECRET_ID")
SPOTIFY_REFRESH_TOKEN = os.getenv("SPOTIFY_REFRESH_TOKEN")
SPOTIFY_TOKEN = ""
REDIS_HOST = os.getenv("REDIS_HOST")
INITIAL_WAIT_TIME = int(os.getenv("WAIT_TIME", 10))
current_wait_time = INITIAL_WAIT_TIME

REFRESH_TOKEN_URL = "https://accounts.spotify.com/api/token"
NOW_PLAYING_URL = "https://api.spotify.com/v1/me/player/currently-playing"
RECENTLY_PLAYING_URL = "https://api.spotify.com/v1/me/player/recently-played?limit=1"
TOP_TRACKS_URL = "https://api.spotify.com/v1/me/top/tracks?limit=50"

def getRedis():
    return redis.StrictRedis(host=REDIS_HOST, port=6379, db=0)

def setRedis(key, value):
    getRedis().set(key, value)
    
def getRedisValue(key):
    return getRedis().get(key)

def getAuth():
    return b64encode(f"{SPOTIFY_CLIENT_ID}:{SPOTIFY_SECRET_ID}".encode()).decode(
        "ascii"
    )
    
def refreshToken():
    data = {
        "grant_type": "refresh_token",
        "refresh_token": SPOTIFY_REFRESH_TOKEN,
    }

    headers = {"Authorization": "Basic {}".format(getAuth())}
    response = requests.post(
        REFRESH_TOKEN_URL, data=data, headers=headers).json()

    try:
        return response["access_token"]
    except KeyError:
        print(json.dumps(response))
        print("\n---\n")
        raise KeyError(str(response))
    
def topTracks():
    data = get(TOP_TRACKS_URL)
    print(colorama.Fore.YELLOW + "Setting Redis key to top tracks." + colorama.Style.RESET_ALL)
    setRedis("top-tracks", json.dumps(data))
    
    for track in data["items"]:
        print(colorama.Fore.GREEN + "[TOP TRACKS] - " + f"{track['name']} by {track['artists'][0]['name']}" + colorama.Style.RESET_ALL)
    
    print(colorama.Fore.YELLOW + "Top tracks have been set." + colorama.Style.RESET_ALL)
    return data
    

def get(url):
    global SPOTIFY_TOKEN

    if (SPOTIFY_TOKEN == ""):
        SPOTIFY_TOKEN = refreshToken()

    try:
        response = requests.get(
            url, headers={"Authorization": f"Bearer {SPOTIFY_TOKEN}"})

        if response.status_code == 401:
            SPOTIFY_TOKEN = refreshToken()
            response = requests.get(
                url, headers={"Authorization": f"Bearer {SPOTIFY_TOKEN}"}).json()
            return response
        elif response.status_code == 204:
            raise Exception(f"{url} returned no data.")
        else:
            return response.json()
    except Exception as e:
        print(f"Failed to get data from {url}.\r\n```{e}```")
        return {}
    
def saveToDB(data, is_playing):
    global current_wait_time
    print(colorama.Fore.YELLOW + "Setting Redis key to current song." + colorama.Style.RESET_ALL)
    setRedis("current-song", json.dumps(data))
    
    # Adjust wait time based on is_playing status
    if is_playing:
        current_wait_time = INITIAL_WAIT_TIME
    else:
        current_wait_time = min(60, current_wait_time + 10)
    
    print(colorama.Fore.YELLOW + f"Waiting {current_wait_time} seconds before checking again." + colorama.Style.RESET_ALL)
    time.sleep(current_wait_time)

def main():
    last_top_tracks_update = datetime.datetime.now() - datetime.timedelta(weeks=1)
    while True:
        now = datetime.datetime.now()
        if (now - last_top_tracks_update).days >= 1:
            topTracks()
            last_top_tracks_update = now
        try:
            data = get(NOW_PLAYING_URL)
            is_playing = True
            print(colorama.Fore.GREEN + f"[Now playing] - {data['item']['name']} - {data['item']['artists'][0]['name']}" + colorama.Style.RESET_ALL)
            saveToDB(data, is_playing)
        except Exception:
            try:
                data = get(RECENTLY_PLAYING_URL)
                is_playing = False
                print(colorama.Fore.RED + "No song is currently playing. Showing previously played song." + colorama.Style.RESET_ALL)
                print(colorama.Fore.GREEN + f"[Last played] - {data['items'][0]['track']['name']} - {data['items'][0]['track']['artists'][0]['name']}" + colorama.Style.RESET_ALL)
                saveToDB(data, is_playing)
            except Exception:
                print(colorama.Fore.RED + "Failed to get data from Spotify. Retrying in 10 seconds." + colorama.Style.RESET_ALL)
                time.sleep(10)
                continue
        
if __name__ == "__main__":
    main()