from django.test import TestCase
from django.utils import timezone
from accounts.models import OTPVerification
from accounts.views import create_or_resend_otp

class OTPTestCase(TestCase):
    def test_create_or_resend_otp(self):
        email = "test@example.com"
        create_or_resend_otp(email)
        
        otp_entry = OTPVerification.objects.get(email=email)
        self.assertIsNotNone(otp_entry)
        self.assertEqual(otp_entry.email, email)
        self.assertTrue(otp_entry.created_at <= timezone.now())