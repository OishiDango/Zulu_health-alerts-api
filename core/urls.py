from django.urls import path
from . import views
from .views import get_alerts, stats_regions, stats_timeseries

urlpatterns = [
<<<<<<< HEAD
    path("", views.home, name="home"),
    path("search-def/", views.simple_scrapy_test, name="search_def"),
    path("alerts/", get_alerts, name="alerts"),
    path("stats/timeseries/", stats_timeseries, name="stats_timeseries"),
    path("stats/regions/", stats_regions, name="stats_regions"),
    path("stats/diseases/", views.stats_diseases, name="stats_diseases"),
]
=======
    path("search-def/", views.simple_scrapy_test, name="search_def"),
    path("alerts", get_alerts, name="alerts"),
    path("stats/timeseries", stats_timeseries, name="stats_timeseries"),
    path("stats/regions", stats_regions, name="stats_regions"),
    path("stats/diseases", views.stats_diseases, name="stats_diseases"),
    path("summary/region", views.region_summary_view, name="region_summary"),
]
>>>>>>> 1ff9cbc49765760c6b94fd50a2e96fc9027ba7b5
