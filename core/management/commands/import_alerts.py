import json
from django.core.management.base import BaseCommand
from core.models import Alert


class Command(BaseCommand):
    help = "Import alerts from a JSON file"

    def add_arguments(self, parser):
        parser.add_argument("file", type=str)

    def handle(self, *args, **options):
        file_path = options["file"]

        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        created = 0
        updated = 0

        for item in data:
            fields = item["fields"]

            obj, was_created = Alert.objects.update_or_create(
                external_id=fields["external_id"],
                defaults={
                    "date": fields["date"],
                    "title": fields["title"],
                    "diseases": fields["diseases"],
                    "species": fields["species"],
                    "regions": fields["regions"],
                    "locations": fields["locations"],
                },
            )

            if was_created:
                created += 1
            else:
                updated += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Import complete: {created} created, {updated} updated"
            )
        )