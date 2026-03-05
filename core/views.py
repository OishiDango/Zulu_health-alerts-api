from pydoc import locate
import subprocess
import json
import os
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET'])
def hello_world(request):
    return Response({
        "message": "Hello World!",
        "status": "success"
    })

@api_view(["GET"])
def get_alerts(request):
    # for now this returns dummy data
    # replace with actual scraper output
    data = {
        "alerts": [
            {
            "id": "8731269",
            "date": "2026-03-05",
            "title": "AVIAN INFLUENZA - ARGENTINA (02): (CORDOBA) HPAI H5, COMMERCIAL POULTRY",
            "disease": ["Avian Influenza"],
            "species": ["Poultry (domestic)"],
            "region": ["South America"],
            "locations": [
                ["Argentina", "Cordoba Province", "Cordoba"]
            ]
            },
            {
            "id": "8731256",
            "date": "2026-03-05",
            "title": "MYIASIS - MEXICO: NEW WORLD SCREWWORM (COCHLIOMYIA HOMINIVORAX) HUMAN",
            "disease": ["Myiasis"],
            "species": ["Humans"],
            "region": ["North America"],
            "locations": [
                ["Mexico", "Mexico City", "Mexico City"]
            ]
            },
            {
            "id": "8730623",
            "date": "2026-02-06",
            "title": "SHIGELLOSIS, SALMONELLOSIS - UK: ex CAPE VERDE",
            "disease": ["Salmonella", "Shigellosis"],
            "species": ["Humans"],
            "region": ["Africa", "Europe"],
            "locations": [
                ["Cape Verde", "Santiago", "Praia"],
                ["United Kingdom", "England", "London"]
            ]
            },
            {
            "id": "8730620",
            "date": "2026-02-06",
            "title": "BACILLUS CEREUS - UK: INFANT FORMULA, CEREULIDE, CASES, RECALL, ALERT",
            "disease": ["Food-related toxin"],
            "species": ["Humans"],
            "region": ["Europe"],
            "locations": [
                ["United Kingdom"]
            ]
            }
        ]
    }
    return Response(data)

@api_view(['GET'])
def simple_scrapy_test(request):
    # locate the scraper directory
    scraper_path = os.path.join(os.getcwd(), 'scraper')

    try:
        # run Scrapy spider and capture output
        output = subprocess.check_output(
            [
                'scrapy', 'crawl', 'test', # run the 'promed' name spider
                '--nolog',           # close the log output
                '-o', '-:json'       # output to stdout in JSON format
            ],
            cwd=scraper_path,
            stderr=subprocess.STDOUT
        )

        data = json.loads(output)
        return Response(data)

    except subprocess.CalledProcessError as e:
        return Response({
            "error": "Scrapy failed",
            "detail": e.output.decode()
        }, status=500)