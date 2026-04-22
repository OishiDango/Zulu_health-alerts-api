import os
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException

from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .serializers import SignupSerializer


@api_view(["POST"])
@permission_classes([AllowAny])
def signup_view(request):
    serializer = SignupSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)

        # Send welcome email via Brevo
        if user.email:
            configuration = sib_api_v3_sdk.Configuration()
            configuration.api_key['api-key'] = os.environ.get(
                'BREVO_API_KEY'
            )

            api_instance = sib_api_v3_sdk.TransactionalEmailsApi(
                sib_api_v3_sdk.ApiClient(configuration)
            )

            img_base = (
                "https://raw.githubusercontent.com/"
                "ZuluSENG3011/Zulu_health-alerts-api/email_sender/"
            )

            html_content = (
                f"<h1>Welcome, {user.username}!</h1>"
                "<p>Thanks for signing up! Here's what you can do next "
                "with our Health Alert API, which reads disease "
                "outbreaks from across the world.</p>"
                "<p>You can try out our market analytics page! "
                "Where we compare global disease outbreaks to "
                "current market predictions.</p>"
                f"<img src='{img_base}zulu_1.png' "
                "alt='Zulu Health Alerts' width='1000'>"
                "<p>Or our global world map, which shows global disease "
                "outbreaks by country on a visualised world map.</p>"
                f"<img src='{img_base}zulu_2.png' "
                "alt='Zulu Health Alerts' width='1000'>"
                "<p>Our AI chat box, which will answer all your "
                "questions.</p>"
                f"<img src='{img_base}zulu_3.png' "
                "alt='Zulu Health Alerts' width='1000'>"
                "<p>And many more features, on our team's global "
                "Health API.</p>"
            )

            email = sib_api_v3_sdk.SendSmtpEmail(
                to=[{"email": user.email, "name": user.username}],
                sender={
                    "email": "l4liem@gmail.com",
                    "name": "Zulu Health Alerts",
                },
                subject="Welcome to Zulu Health Alerts API!",
                html_content=html_content,
            )

            try:
                api_instance.send_transac_email(email)
            except ApiException as e:
                print(f"Brevo email error: {e}")

        return Response(
            {
                "message": "User created successfully.",
                "token": token.key,
                "user": {
                    "username": user.username,
                    "email": user.email,
                },
            },
            status=status.HTTP_201_CREATED,
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)
    if user is None:
        return Response(
            {"detail": "Invalid username or password."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    token, _ = Token.objects.get_or_create(user=user)
    return Response(
        {
            "message": "Login successful.",
            "token": token.key,
            "user": {
                "username": user.username,
                "email": user.email,
            },
        }
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me_view(request):
    user: User = request.user
    return Response(
        {
            "username": user.username,
            "email": user.email,
        }
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_view(request):
    request.user.auth_token.delete()
    return Response({"message": "Logged out successfully."})
