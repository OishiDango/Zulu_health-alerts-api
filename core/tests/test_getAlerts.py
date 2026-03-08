from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status


class GetAlertsTests(APITestCase):

    fixtures = ["alerts.json"]

    def setUp(self):
        self.url = reverse("get-alerts")